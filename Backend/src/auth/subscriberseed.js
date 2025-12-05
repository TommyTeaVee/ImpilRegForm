// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { notifySubscriber } = require("../utils/notifications");

async function seedSubs() {
  const subscribers = [
    { email: "fihlatv@gmail.com", fullname: "Tommy" },
    { email: "impilomag@gmail.com", fullname: "Impilo Magazine" },
  ];

  console.log("🌱 Seeding subscribers...");

  for (const sub of subscribers) {
    // FIXED UPSERT (must use a UNIQUE field only)
    const saved = await prisma.subscriber.upsert({
      where: { email: sub.email }, // FIXED
      update: {},

      create: {
        email: sub.email,
        fullname: sub.fullname,
      },
    });

    console.log("✓ Added subscriber:", saved.email);

    // SEND WELCOME EMAIL
    await notifySubscriber(
      saved.email,
      null,                 // no phone
      saved.fullname || ""  // use actual name
    );
  }

  console.log("🌱 Seed completed.");
}

seedSubs()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = seedSubs;
