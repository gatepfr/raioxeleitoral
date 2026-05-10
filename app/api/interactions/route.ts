import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, anotacao, tipo_contato } = body;

    if (!leadId || !anotacao || !tipo_contato) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const interaction = await db.interaction.create({
      data: {
        lead_id: leadId,
        anotacao,
        tipo_contato,
      },
    });

    return NextResponse.json(interaction);
  } catch (error) {
    console.error('Error creating interaction:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
