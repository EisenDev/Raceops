import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { username: 'admin@admin.com' },
  });

  if (user) {
    console.log('SUCCESS: Admin user found.');
    console.log('ID:', user.id);
    console.log('Username:', user.username);
    console.log('Role:', user.role);
  } else {
    console.log('FAILURE: Admin user not found.');
  }
}

checkUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
