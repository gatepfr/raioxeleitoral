import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uf = searchParams.get("uf")
    const municipio = searchParams.get("municipio")
    const cargo = searchParams.get("cargo")

    const candidates = await db.candidate.findMany({
      where: {
        ...(uf && { uf: { equals: uf, mode: 'insensitive' } }),
        ...(municipio && { municipio: { equals: municipio, mode: 'insensitive' } }),
        ...(cargo && { cargo: { equals: cargo, mode: 'insensitive' } }),
      },
      take: 50,
      orderBy: { nome_completo: 'asc' },
      include: {
        assets: true,
        socials: true
      }
    })

    // Manual join with MyCandidate/Lead to check if captured
    const sq_candidatos = candidates.map(c => c.sq_candidato)
    const capturedCandidates = await db.myCandidate.findMany({
      where: {
        tse_id: { in: sq_candidatos }
      },
      include: {
        lead: true
      }
    })

    const candidatesWithLead = candidates.map(candidate => {
      const myCandidate = capturedCandidates.find(mc => mc.tse_id === candidate.sq_candidato)
      return {
        ...candidate,
        lead: myCandidate?.lead || null
      }
    })

    return NextResponse.json(candidatesWithLead)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}
