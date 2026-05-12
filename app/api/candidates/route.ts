import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uf = searchParams.get("uf")
    const municipio = searchParams.get("municipio")
    const cargo = searchParams.get("cargo")
    const partido = searchParams.get("partido")
    const nomeUrna = searchParams.get("nomeUrna")
    const minPatrimonioStr = searchParams.get("minPatrimonio")
    const maxPatrimonioStr = searchParams.get("maxPatrimonio")

    const minPatrimonio = minPatrimonioStr ? parseFloat(minPatrimonioStr) : null
    const maxPatrimonio = maxPatrimonioStr ? parseFloat(maxPatrimonioStr) : null

    const page = parseInt(searchParams.get("page") || "1")
    const limit = 50
    const skip = (page - 1) * limit

    const sortBy = searchParams.get("sortBy") || "nome_urna"
    const sortOrder = (searchParams.get("sortOrder") || "asc") as 'asc' | 'desc'

    // Map frontend "Localidade" to database "municipio"
    const dbSortBy = sortBy === "localidade" ? "municipio" : sortBy

    const where: any = {
      ...(uf && { uf: { equals: uf, mode: 'insensitive' } }),
      ...(municipio && { municipio: { equals: municipio, mode: 'insensitive' } }),
      ...(cargo && { cargo: { contains: cargo, mode: 'insensitive' } }),
      ...(partido && { partido: { equals: partido, mode: 'insensitive' } }),
      ...(nomeUrna && { nome_urna: { contains: nomeUrna, mode: 'insensitive' } }),
      ...((minPatrimonio !== null || maxPatrimonio !== null) && {
        patrimonio_total: {
          ...(minPatrimonio !== null && { gte: minPatrimonio }),
          ...(maxPatrimonio !== null && { lte: maxPatrimonio }),
        }
      }),
    }

    const [candidates, totalCount] = await Promise.all([
      db.candidate.findMany({
        where,
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
          assets: true,
          socials: true
        }
      }),
      db.candidate.count({ where })
    ])

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

    return NextResponse.json({
      candidates: candidatesWithLead,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      }
    })
  } catch (error: any) {
    console.error("API Error Details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ 
      error: "Failed to fetch candidates",
      details: error.message 
    }, { status: 500 })
  }
}
