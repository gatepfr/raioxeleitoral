import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 1. Stats Summary
    const totalLeads = await db.lead.count()
    const closedDeals = await db.lead.count({
      where: { status: 'FECHADO' }
    })
    
    const negotiationValue = await db.lead.aggregate({
      _sum: { valor_contrato: true },
      where: {
        status: { in: ['REUNIAO', 'PROPOSTA'] }
      }
    })

    // 2. Funnel Data (Group by Status)
    const funnelStats = await db.lead.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    // 3. Recent Activity (Latest Interactions)
    const recentActivity = await db.interaction.findMany({
      take: 10,
      orderBy: { data_registro: 'desc' },
      include: {
        lead: {
          include: {
            my_candidate: true
          }
        }
      }
    })

    return NextResponse.json({
      summary: {
        totalLeads,
        closedDeals,
        totalNegotiationValue: negotiationValue._sum.valor_contrato || 0,
      },
      funnel: funnelStats.map(f => ({
        status: f.status,
        count: f._count._all
      })),
      recentActivity: recentActivity.map(a => ({
        id: a.id,
        candidateName: a.lead.my_candidate.nome,
        type: a.tipo_contato,
        note: a.anotacao,
        date: a.data_registro
      }))
    })
  } catch (error) {
    console.error("Dashboard Stats Error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
