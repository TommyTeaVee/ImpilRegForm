require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedAdmin = require("./auth/seedAdmin");
const seedModel = require("./auth/modelSeed");
const seedSubs = require("./auth/subscriberseed");
const dbS3Seed = require("./auth/dbS3Seeds");

async function runSeed() {
  try {
    await prisma.$connect();

    await seedAdmin();
    await seedModel();
    await seedSubs();
    await dbS3Seed();

    console.log("✅ Seeding complete");
  } catch (e) {
    console.error("❌ Seed failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();