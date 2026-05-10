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

    return NextResponse.json(candidates)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}
