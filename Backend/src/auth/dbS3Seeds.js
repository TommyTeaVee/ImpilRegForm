// prisma/seed-cloudfront.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CLOUDFRONT_BASE = process.env.CLOUDFRONT_URL;

function toCloudFront(url) {
  if (!url) return null;
  if (url.startsWith(CLOUDFRONT_BASE)) return url;

  const match = url.match(/registrations\/(.+)$/);
  if (!match) {
    console.warn("URL does not contain 'registrations/':", url);
    return url;
  }

  const filename = match[1];
  return `${CLOUDFRONT_BASE}/registrations/${filename}`;
}

async function updateRegistration(reg) {
  return prisma.registration.update({
    where: { id: reg.id },
    data: {
      profileImage: toCloudFront(reg.profileImage),
      fullBodyImage: toCloudFront(reg.fullBodyImage),
      fullDress: toCloudFront(reg.fullDress),
      fullShorts: toCloudFront(reg.fullShorts),
      fullJeans: toCloudFront(reg.fullJeans),
      closeForward: toCloudFront(reg.closeForward),
      closeLeft: toCloudFront(reg.closeLeft),
      closeRight: toCloudFront(reg.closeRight),
      sportswear: toCloudFront(reg.sportswear),
      summerwear: toCloudFront(reg.summerwear),
      swimwear: toCloudFront(reg.swimwear),
      extraImages: reg.extraImages?.map(toCloudFront) || [],
    },
  });
}

async function dbS3Seed() {
  try {
    const allRegs = await prisma.registration.findMany();
    console.log(`Found ${allRegs.length} registrations.`);

    for (const reg of allRegs) {
      await updateRegistration(reg);
      console.log(`Updated registration ${reg.id}`);
    }

    console.log("✅ All registrations updated to CloudFront URLs.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding CloudFront URLs:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports=dbS3Seed;
