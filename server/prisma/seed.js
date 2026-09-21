// Prisma seed script for SolveMe
// Populates 10 realistic Indian civic problem records with discussions & community context
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { seedProblems } = require('../src/seedData');

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SolveMe database with realistic civic problem reports...");

  // Clear existing records if any
  try {
    await prisma.problemInfo.deleteMany({});
    await prisma.discussion.deleteMany({});
    await prisma.problem.deleteMany({});
  } catch (err) {
    console.log("Note: Database was clean or tables not yet populated.");
  }

  for (const item of seedProblems) {
    const { discussions, problemInfos, ...problemData } = item;
    
    await prisma.problem.create({
      data: {
        ...problemData,
        discussions: {
          create: (discussions || []).map(d => ({
            content: d.content,
            createdAt: new Date(d.createdAt)
          }))
        },
        problemInfos: {
          create: (problemInfos || []).map(i => ({
            content: i.content,
            createdAt: new Date(i.createdAt)
          }))
        }
      }
    });
  }

  console.log(`✅ Successfully seeded ${seedProblems.length} civic problems into database.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
