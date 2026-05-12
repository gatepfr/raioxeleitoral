const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'politicaiceberg@gmail.com' },
    update: {
      password: 'admin123'
    },
    create: {
      email: 'politicaiceberg@gmail.com',
      password: 'admin123',
      name: 'Admin Iceberg'
    }
  });
  console.log('Usuário Admin configurado:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
