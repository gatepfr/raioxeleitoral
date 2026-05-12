import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cand = await prisma.candidate.findFirst({
    where: {
      nome_urna: { contains: 'ADAN LENHARO', mode: 'insensitive' },
      municipio: 'APUCARANA'
    }
  });
  console.log(JSON.stringify(cand, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
