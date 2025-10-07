const prisma = require("../../prisma/client");

async function normalizePhone(phone) {
  if (!phone) return phone;
  let cleaned = phone.toString().replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "+27" + cleaned.substring(1);
  else if (!cleaned.startsWith("27") && !cleaned.startsWith("+27")) cleaned = "+27" + cleaned;
  else if (cleaned.startsWith("27")) cleaned = "+" + cleaned;
  return cleaned;
}

async function main() {
  const all = await prisma.registration.findMany();
  console.log(`🔍 Found ${all.length} registrations`);

  for (const reg of all) {
    const newPhone = await normalizePhone(reg.phone);
    if (newPhone !== reg.phone) {
      try {
        await prisma.registration.update({
          where: { id: reg.id },
          data: { phone: newPhone },
        });
        console.log(`✅ Updated ${reg.fullName} → ${newPhone}`);
      } catch (e) {
        console.error(`⚠️  Could not update ${reg.id}:`, e.message);
      }
    }
  }

  console.log("🎯 All phone numbers normalized to +27 format");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
