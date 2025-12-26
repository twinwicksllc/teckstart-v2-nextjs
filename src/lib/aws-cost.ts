import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer";

export interface AWSCostParams {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface DailyCost {
  date: string;
  service: string;
  amount: number;
  tags: Record<string, string>;
}

export async function fetchDailyCosts(params: AWSCostParams): Promise<DailyCost[]> {
  const client = new CostExplorerClient({
    region: params.region || "us-east-1",
    credentials: {
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
    },
  });

  const command = new GetCostAndUsageCommand({
    TimePeriod: {
      Start: params.startDate,
      End: params.endDate,
    },
    Granularity: "DAILY",
    Metrics: ["UnblendedCost"],
    GroupBy: [
      { Type: "DIMENSION", Key: "SERVICE" },
      // We can also group by tags if needed, but for now let's stick to service
      // { Type: "TAG", Key: "Project" } 
    ],
  });

  try {
    const response = await client.send(command);
    
    const costs: DailyCost[] = [];

    if (response.ResultsByTime) {
      for (const result of response.ResultsByTime) {
        const date = result.TimePeriod?.Start;
        if (!date) continue;

        if (result.Groups) {
          for (const group of result.Groups) {
            const service = group.Keys?.[0] || "Unknown";
            const amount = parseFloat(group.Metrics?.UnblendedCost?.Amount || "0");
            
            if (amount > 0) {
              costs.push({
                date,
                service,
                amount,
                tags: {}, // Tags would require grouping by TAG or fetching tags separately
              });
            }
          }
        }
      }
    }

    return costs;
  } catch (error) {
    console.error("Error fetching AWS costs:", error);
    throw error;
  }
}
