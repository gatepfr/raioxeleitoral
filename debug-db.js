
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const count = await prisma.candidateSocial.count();
    console.log('--- DATABASE CHECK ---');
    console.log('Total Social Media Records:', count);
    
    if (count > 0) {
      const examples = await prisma.candidateSocial.findMany({ 
        take: 3,
        include: {
          candidate: {
            select: {
              nome_urna: true,
              ano_ultima_eleicao: true
            }
          }
        }
      });
      console.log('Sample Records:');
      examples.forEach(s => {
        console.log(`- [${s.candidate.ano_ultima_eleicao}] ${s.candidate.nome_urna}: ${s.tipo_rede} -> ${s.url}`);
      });
    } else {
      console.log('WARNING: No social media records found in CandidateSocial table.');
    }
  } catch (e) {
    console.error('Error connecting to DB:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
