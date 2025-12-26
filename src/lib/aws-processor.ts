import { fetchDailyCosts, AWSCostParams, DailyCost } from "./aws-cost";
import { db } from "./db";
import { expenses, awsConfigs, expenseCategories } from "@/drizzle.schema";
import { eq, and, sql } from "drizzle-orm";
import { decrypt } from "./encryption";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

async function categorizeService(serviceName: string, amount: number): Promise<number | null> {
  // 1. Try to find an existing category
  // For now, let's default to "Software" or "Hosting" if they exist.
  // Or use Bedrock to guess.
  
  // Simple heuristic for now to save tokens/latency, can be upgraded to Bedrock later
  const lowerService = serviceName.toLowerCase();
  let categoryName = "Software"; // Default

  if (lowerService.includes("route 53") || lowerService.includes("domain")) {
    categoryName = "Office Supplies"; // Or "Dues & Subscriptions"
  } else if (lowerService.includes("support")) {
    categoryName = "Professional Services";
  }

  // Find category ID
  const category = await db.query.expenseCategories.findFirst({
    where: eq(expenseCategories.name, categoryName)
  });

  return category ? category.id : null;
}

export async function syncAWSExpenses(userId: number, startDate: string, endDate: string) {
  // 1. Get Credentials
  const config = await db.query.awsConfigs.findFirst({
    where: eq(awsConfigs.userId, userId)
  });

  if (!config) throw new Error("AWS Config not found");

  const accessKeyId = decrypt(config.awsAccessKeyId);
  const secretAccessKey = decrypt(config.awsSecretAccessKey);

  // 2. Fetch Data
  const dailyCosts = await fetchDailyCosts({
    accessKeyId,
    secretAccessKey,
    region: config.awsRegion,
    startDate,
    endDate
  });

  // 3. Aggregate by Service + Month
  const aggregated = new Map<string, {
    service: string;
    month: string; // YYYY-MM
    amount: number;
    tags: Record<string, string>;
  }>();

  for (const cost of dailyCosts) {
    const date = new Date(cost.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const key = `${cost.service}-${month}`;

    if (!aggregated.has(key)) {
      aggregated.set(key, {
        service: cost.service,
        month,
        amount: 0,
        tags: cost.tags
      });
    }
    
    const entry = aggregated.get(key)!;
    entry.amount += cost.amount;
  }

  // 4. Process Aggregates
  const miscThreshold = 1.00;
  const miscBuckets = new Map<string, number>(); // month -> total

  for (const [key, entry] of Array.from(aggregated)) {
    if (entry.amount < miscThreshold) {
      const currentMisc = miscBuckets.get(entry.month) || 0;
      miscBuckets.set(entry.month, currentMisc + entry.amount);
      aggregated.delete(key);
    }
  }

  // 5. Save to DB
  // Handle regular entries
  for (const entry of Array.from(aggregated.values())) {
    const fingerprint = `aws-${userId}-${entry.service}-${entry.month}`;
    const categoryId = await categorizeService(entry.service, entry.amount);
    
    // Calculate date as the first of the month (or last?)
    // Let's use the first of the month for the record date
    const [year, month] = entry.month.split('-').map(Number);
    const expenseDate = new Date(year, month - 1, 1);

    await db.insert(expenses).values({
      userId,
      vendor: "AWS",
      description: `AWS Service: ${entry.service}`,
      amount: entry.amount.toFixed(2),
      expenseDate,
      source: "aws_auto",
      awsService: entry.service,
      awsTags: entry.tags,
      fingerprint,
      categoryId,
      isDeductible: true, // Usually true for business AWS
    }).onConflictDoUpdate({
      target: expenses.fingerprint,
      set: {
        amount: entry.amount.toFixed(2),
        updatedAt: new Date()
      }
    });
  }

  // Handle Misc entries
  for (const [monthStr, amount] of Array.from(miscBuckets)) {
    if (amount > 0) {
      const fingerprint = `aws-${userId}-misc-${monthStr}`;
      const [year, month] = monthStr.split('-').map(Number);
      const expenseDate = new Date(year, month - 1, 1);
      const categoryId = await categorizeService("Miscellaneous", amount);

      await db.insert(expenses).values({
        userId,
        vendor: "AWS",
        description: "AWS Miscellaneous Services",
        amount: amount.toFixed(2),
        expenseDate,
        source: "aws_auto",
        awsService: "Miscellaneous",
        awsTags: {},
        fingerprint,
        categoryId,
        isDeductible: true,
      }).onConflictDoUpdate({
        target: expenses.fingerprint,
        set: {
          amount: amount.toFixed(2),
          updatedAt: new Date()
        }
      });
    }
  }
  
  // Update last synced
  await db.update(awsConfigs)
    .set({ lastSyncedAt: new Date() })
    .where(eq(awsConfigs.id, config.id));
}
