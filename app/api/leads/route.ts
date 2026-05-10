import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { my_candidate_id, candidate_id } = body;

    if (!my_candidate_id && !candidate_id) {
      return NextResponse.json(
        { error: "my_candidate_id or candidate_id is required" },
        { status: 400 }
      );
    }

    // Case 1: Capturing from TSE Candidate
    if (candidate_id) {
      const candidate = await db.candidate.findUnique({
        where: { id: candidate_id },
      });

      if (!candidate) {
        return NextResponse.json(
          { error: "Candidate not found" },
          { status: 404 }
        );
      }

      // Check if already captured
      const existingMyCandidate = await db.myCandidate.findFirst({
        where: { tse_id: candidate.sq_candidato },
        include: { lead: true }
      });

      if (existingMyCandidate?.lead) {
        return NextResponse.json(
          { error: "Lead already exists for this candidate" },
          { status: 400 }
        );
      }

      // Use transaction to create MyCandidate and Lead
      const result = await db.$transaction(async (tx) => {
        let myCandidate = existingMyCandidate;

        if (!myCandidate) {
          myCandidate = await tx.myCandidate.create({
            data: {
              nome: candidate.nome_completo,
              partido: candidate.partido,
              cpf: candidate.cpf,
              uf: candidate.uf,
              municipio: candidate.municipio,
              cargo: candidate.cargo,
              tipo_origem: "TSE",
              tse_id: candidate.sq_candidato,
              telefone: "", // Required field in schema
              email: candidate.email_tse,
            },
          });
        }

        const lead = await tx.lead.create({
          data: {
            my_candidate_id: myCandidate.id,
            status: "PROSPECT",
          },
        });

        return lead;
      });

      return NextResponse.json(result, { status: 201 });
    }

    // Case 2: Creating lead for existing MyCandidate
    if (my_candidate_id) {
      // Check if my_candidate exists
      const myCandidate = await db.myCandidate.findUnique({
        where: { id: my_candidate_id },
      });

      if (!myCandidate) {
        return NextResponse.json(
          { error: "MyCandidate not found" },
          { status: 404 }
        );
      }

      // Check if lead already exists for this my_candidate
      const existingLead = await db.lead.findUnique({
        where: { my_candidate_id: my_candidate_id },
      });

      if (existingLead) {
        return NextResponse.json(
          { error: "Lead already exists for this candidate" },
          { status: 400 }
        );
      }

      const lead = await db.lead.create({
        data: {
          my_candidate_id: my_candidate_id,
          status: "PROSPECT",
        },
      });

      return NextResponse.json(lead, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      include: {
        my_candidate: true,
        interactions: {
          orderBy: {
            data_registro: 'desc',
          },
        },
      },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
