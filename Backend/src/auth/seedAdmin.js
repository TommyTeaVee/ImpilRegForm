
require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("./Admin");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
 const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash
    }
  });

  console.log("Admin seeded");
}

module.exports = seedAdmin;
