import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkCategories() {
  const { db } = await import("../src/lib/db");
  const { expenseCategories } = await import("../src/drizzle.schema");
  
  const categories = await db.select().from(expenseCategories);
  console.log("Current Categories:", JSON.stringify(categories, null, 2));
  
  if (categories.length === 0) {
    console.log("No categories found. Seeding default categories...");
    const defaults = [
      { name: "Advertising", scheduleCLine: "8" },
      { name: "Office Supplies", scheduleCLine: "18" },
      { name: "Meals", scheduleCLine: "24b" },
      { name: "Travel", scheduleCLine: "24a" },
      { name: "Equipment", scheduleCLine: "22" },
      { name: "Software", scheduleCLine: "18" },
      { name: "Professional Services", scheduleCLine: "17" },
      { name: "Internet", scheduleCLine: "25" },
      { name: "Phone", scheduleCLine: "25" },
      { name: "Utilities", scheduleCLine: "25" },
      { name: "Insurance", scheduleCLine: "15" },
      { name: "Rent", scheduleCLine: "20" },
      { name: "Other", scheduleCLine: "27" },
    ];
    
    for (const cat of defaults) {
      await db.insert(expenseCategories).values(cat).onConflictDoNothing();
    }
    console.log("Seeding complete.");
  }
}

checkCategories().catch(console.error);
