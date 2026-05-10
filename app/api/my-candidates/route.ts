import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get("uf");
    const municipio = searchParams.get("municipio");

    const where: any = {};
    if (uf) where.uf = uf;
    if (municipio) where.municipio = municipio;

    const myCandidates = await db.myCandidate.findMany({
      where,
      include: {
        lead: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(myCandidates);
  } catch (error) {
    console.error("Error fetching my candidates:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nome,
      partido,
      cpf,
      email,
      telefone,
      uf,
      municipio,
      cargo,
      origem_indicacao,
      rede_social,
      tipo_origem,
      tse_id,
    } = body;

    // Basic validation
    if (!nome || !telefone || !uf || !municipio || !cargo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const myCandidate = await tx.myCandidate.create({
        data: {
          nome,
          partido,
          cpf,
          email,
          telefone,
          uf,
          municipio,
          cargo,
          origem_indicacao,
          rede_social,
          tipo_origem: tipo_origem || "MANUAL",
          tse_id,
        },
      });

      const lead = await tx.lead.create({
        data: {
          my_candidate_id: myCandidate.id,
          status: "PROSPECT",
        },
      });

      return { ...myCandidate, lead };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating my candidate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
