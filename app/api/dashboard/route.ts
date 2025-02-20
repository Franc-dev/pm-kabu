import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { projects, tasks, users, teams } from "@/src/db/schema"
import { sql } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const projectSummary = await db
      .select({
        status: projects.status,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(projects)
      .groupBy(projects.status)

      logger.info("Fetching project summary", { projectSummary })

    const taskSummary = await db
      .select({
        status: tasks.status,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(tasks)
      .groupBy(tasks.status)

      logger.info("Fetching task summary", { taskSummary })

    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users)
    const teamCount = await db.select({ count: sql<number>`count(*)` }).from(teams)
    const projectCount = await db.select({ count: sql<number>`count(*)` }).from(projects)
    const taskCount = await db.select({ count: sql<number>`count(*)` }).from(tasks)

    logger.info("Fetching user and team count", { userCount, teamCount })

    const recentProjects = await db.select().from(projects).orderBy(sql`${projects.createdAt} DESC`).limit(5)

    return NextResponse.json({
      projectSummary,
      taskSummary,
      userCount: userCount[0].count,
      teamCount: teamCount[0].count,
      projectCount: projectCount[0].count,
      taskCount: taskCount[0].count,
      recentProjects,
    })
  } catch (error) {
    logger.error("Error fetching dashboard data", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

