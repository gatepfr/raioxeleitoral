import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id

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
