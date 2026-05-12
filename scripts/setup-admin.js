const { PrismaClient } = require('@prisma/client');

// Garante que o script use a URL do banco definida no ambiente (essencial para Docker)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('Tentando conectar ao banco para configurar Admin...');
  const user = await prisma.user.upsert({
    where: { email: 'politicaiceberg@gmail.com' },
    update: {
      password: 'admin123'
    },
    create: {
      email: 'politicaiceberg@gmail.com',
      password: 'admin123',
      name: 'Admin Raio X'
    }
  });
  console.log('Usuário Admin configurado:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
