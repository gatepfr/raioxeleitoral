import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const totalCandidates = await prisma.candidate.count();
  const candidates2024 = await prisma.candidate.count({ where: { ano_ultima_eleicao: 2024 } });
  const candidates2022 = await prisma.candidate.count({ where: { ano_ultima_eleicao: 2022 } });
  
  const votes2024 = await prisma.candidate.count({ where: { ano_ultima_eleicao: 2024, total_votos: { gt: 0 } } });
  const expenses2024 = await prisma.candidate.count({ where: { ano_ultima_eleicao: 2024, total_despesas: { gt: 0 } } });
  
  const sumExpenses = await prisma.candidate.aggregate({
    _sum: {
      total_despesas: true
    }
  });

  console.log({
    totalCandidates,
    candidates2024,
    candidates2022,
    votes2024,
    expenses2024,
    sumExpenses: sumExpenses._sum.total_despesas
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
