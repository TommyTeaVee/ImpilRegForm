const bcrypt = require("bcrypt");
const prisma = require("./Admin");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const plain = process.env.ADMIN_PASSWORD;
  if (!email || !plain) return;

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(plain, 10);
  await prisma.admin.upsert({ data: { email, passwordHash } });
  console.log("✅ Seeded admin:", email);
}

module.exports = seedAdmin;
