import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { withDatabase } from "@/lib/db";
import { db } from "@/lib/db";
import { projects } from "../../drizzle.schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProjects = await withDatabase(async () => {
      return await db.select()
        .from(projects)
        .where(eq(projects.userId, session.id))
        .orderBy(desc(projects.createdAt))
        .limit(50);
    });

    return NextResponse.json(userProjects);
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, clientName, clientEmail, description, budget, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const newProject = await withDatabase(async () => {
      const result = await db.insert(projects).values({
        userId: session.id,
        name,
        clientName,
        clientEmail,
        description,
        budget: budget ? parseFloat(budget) : null,
        status: status || "active",
      });

      // Return the created project
      return await db.select()
        .from(projects)
        .where(eq(projects.id, Number(result.insertId)))
        .limit(1);
    });

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}