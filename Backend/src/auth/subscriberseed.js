// prisma/seed.js
//require("dotenv").config();
const prisma = require("../../prisma/client");
const { notifySubscriber } = require("../utils/notifications");


async function main() {
  const subscribers = [
    { email: "fihlatv@gmail.com" },
    { email: "impilomag@gmail.com" },
  ];

  console.log("🌱 Seeding subscribers...");

  for (const sub of subscribers) {
    const saved = await prisma.subscriber.upsert({
      where: { email: sub.email },
      update: {},
      create: { email: sub.email },
    });

    console.log("✓ Added subscriber:", saved.email);

    // === OPTIONAL SEND WELCOME EMAIL USING SES ===
    // Using your notifyModelApproved function
    // (fullName optional for now)
    await notifySubscriber(
      saved.email,
      null,              // no phone number
      "Subscriber"       // placeholder name
    );
  }

  console.log("🌱 Seed completed.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
