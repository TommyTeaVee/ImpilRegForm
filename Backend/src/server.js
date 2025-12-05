require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("./app");
import path from "path";
import { fileURLToPath } from "url";
//const seedAdmin = require("./auth/seedAdmin");
//const seedModel = require("./auth/modelSeed")
//const seedSubs = require('./auth/subscriberseed')
//const dbS3Seed = require("./auth/dbS3Seeds")

const PORT = process.env.PORT || 5050;

/* async function start() {

    await prisma.$connect;
    await seedAdmin(),
    await seedModel(),
    await seedSubs();
   await dbS3Seed()} */
  try {
      seedAdmin()
    app.listen(PORT, () => console.log(`🚀 Backend on http://localhost:${PORT}`)); } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
    }