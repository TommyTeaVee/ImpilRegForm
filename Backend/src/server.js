require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("./app");
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve Frontend
app.use(express.static(path.join(__dirname, "../../Frontend/build/index.htm")));

// Catch-all: send React's index.html for ANY route not starting with /api
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/build/index.html"));
});
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
     // seedAdmin()
    app.listen(PORT, () => console.log(`🚀 Backend on http://localhost:${PORT}`)); } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
    }