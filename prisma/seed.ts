'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Create Default Admin
  const userPart = 'admin';
  const domainPart = 'admin.com';
  const adminEmail = `${userPart}@${domainPart}`;
  
  const hashedPassword = await bcrypt.hash('adminpass', 10);

  await prisma.user.upsert({
    where: { username: adminEmail },
    update: {},
    create: {
      username: adminEmail,
      passwordHash: hashedPassword,
      name: 'Admin CEO',
      role: 'ADMIN',
    },
  });
  console.log(`Admin user created/verified: ${adminEmail}`);

  // 2. Create Default Teams (Yellow, Pink, Red, Green, Blue)
  const teams = [
    { name: 'Yellow', code: 'YELLOW', color: '#FACC15' },
    { name: 'Pink', code: 'PINK', color: '#F472B6' },
    { name: 'Red', code: 'RED', color: '#EF4444' },
    { name: 'Green', code: 'GREEN', color: '#22C55E' },
    { name: 'Blue', code: 'BLUE', color: '#3B82F6' },
  ];

  for (const team of teams) {
    await prisma.team.upsert({
      where: { code: team.code },
      update: {},
      create: {
        name: team.name,
        code: team.code,
        color: team.color,
      },
    });
  }
  console.log('Default teams seeded successfully.');

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
