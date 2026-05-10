import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { candidate_id } = body;

    if (!candidate_id) {
      return NextResponse.json(
        { error: "candidate_id is required" },
        { status: 400 }
      );
    }

    // Check if candidate exists
    const candidate = await db.candidate.findUnique({
      where: { id: candidate_id },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Check if lead already exists for this candidate
    const existingLead = await db.lead.findUnique({
      where: { candidate_id: candidate_id },
    });

    if (existingLead) {
      return NextResponse.json(
        { error: "Lead already exists for this candidate" },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        candidate_id: candidate_id,
        status: "PROSPECT",
      },
    });

    return NextResponse.json(lead, { status: 201 });
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
        candidate: {
          include: {
            assets: true,
            socials: true,
          },
        },
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
