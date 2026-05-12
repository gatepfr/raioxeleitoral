const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Como usar: node scripts/add-user.js nome email senha
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('Uso: node scripts/add-user.js "Nome do Vendedor" "email@vendedor.com" "senha123"');
  process.exit(1);
}

const [name, email, password] = args;

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Em uma versão futura, adicionaremos criptografia aqui
      },
    });
    console.log('✅ Vendedor adicionado com sucesso!');
    console.log('Nome:', user.name);
    console.log('E-mail:', user.email);
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Erro: Já existe um usuário cadastrado com este e-mail.');
    } else {
      console.error('❌ Erro ao criar usuário:', error);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
