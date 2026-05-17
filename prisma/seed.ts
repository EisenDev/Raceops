'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { challenges } from './challenges';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Create Default Admin
  const adminEmail = 'admin@admin.com';
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

  // 2. Create Default Teams
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

  // 3. Create Default Settings
  const settings = [
    { key: 'eventName', value: 'Infosoft Amazing Race 2026' },
    { key: 'scoresLocked', value: 'false' },
  ];

  for (const setting of settings) {
    await prisma.gameSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log('Default settings seeded successfully.');

  // 4. Create Advanced Code Challenges (Station 11) - Exact 10 challenges
  for (const challenge of challenges) {
    // For seeding, we use title as a unique key or generate a stable cardCode
    const cardCode = `ST11-${challenge.languageTrack}-${challenge.title.toUpperCase().replace(/\s+/g, '-')}`;
    
    await prisma.codeChallenge.upsert({
      where: { cardCode: cardCode },
      update: {
        difficulty: challenge.difficulty,
        title: challenge.title,
        prompt: challenge.prompt,
        participantCode: challenge.participantCode,
        correctCode: challenge.correctCode,
        buggyCode: challenge.buggyCode,
        expectedOutput: challenge.expectedOutput,
        validationRule: challenge.validationRule,
        genericHint: challenge.genericHint,
        languageTrack: challenge.languageTrack,
      },
      create: {
        cardCode: cardCode,
        difficulty: challenge.difficulty,
        title: challenge.title,
        prompt: challenge.prompt,
        participantCode: challenge.participantCode,
        correctCode: challenge.correctCode,
        buggyCode: challenge.buggyCode,
        expectedOutput: challenge.expectedOutput,
        validationRule: challenge.validationRule,
        genericHint: challenge.genericHint,
        languageTrack: challenge.languageTrack,
      },
    });
  }
  console.log(`Seeded ${challenges.length} advanced code challenges.`);

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
