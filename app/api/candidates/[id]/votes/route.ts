import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise
    const resolvedParams = await params
    const candidateId = resolvedParams.id

    const votes = await db.candidateVote.findMany({
      where: {
        candidate_id: candidateId
      },
      orderBy: {
        votos: 'desc'
      }
    })

    return NextResponse.json(votes)
  } catch (error: any) {
    console.error("Error fetching candidate votes:", error)
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 })
  }
}
