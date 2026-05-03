const bcrypt = require("bcrypt");
const prisma = require("./Admin");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD;

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
