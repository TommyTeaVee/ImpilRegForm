require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("./app");
const seedAdmin = require("./auth/seedAdmin");
const seedModel = require("./auth/modelSeed")
//const dbS3Seed = require("./auth/dbS3Seeds")

const PORT = process.env.PORT || 5050;

async function start() {
  try {
    await prisma.$connect();
    await seedAdmin(),
    await seedModel(),
   //await dbS3Seed(),
    app.listen(PORT, () => console.log(`🚀 Backend on http://localhost:${PORT}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
}

start();
