
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { safeCreate } = require("../utils/safeCreate");

async function modelSeed() {
  console.log("🌱 Seeding models...");

  //await prisma.registration.deleteMany();

  await safeCreate(
    "registration",
    { email: "jane.doe@impilomag.com" },
    {
      fullName: "Jane Doe",
      email: "jane.doe@impilomag.com",
      phone: "+27831234567",
      dob: new Date("1998-05-12"),
      gender: "Female",
      modelType: "InHouse",
      bio: "Passionate dancer...",
      allergiesOrSkin: "None",
      visualArts: ["Drama / Theatre", "Dance"],
      height: 170,
      weight: 60,
      bust: 88,
      waist: 65,
      hips: 90,
      shoe: "7",
      hairColor: "Brown",
      eyeColor: "Green",
      facebook: "https://facebook.com/janedoe",
      instagram: "https://instagram.com/janedoe",
      tiktok: "https://tiktok.com/@janedoe",
      portfolio: null,
      agency: null,
      profileImage: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      fullBodyImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      fullDress: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
      fullShorts: null,
      fullJeans: null,
      closeForward: null,
      closeLeft: null,
      closeRight: null,
      sportswear: null,
      summerwear: null,
      swimwear: null,
      extraImages: [],
      status: "pending",
    }
  );

  await safeCreate(
    "registration",
    { email: "john.doe@impilomag.com" },
    {
      fullName: "John Doe",
      email: "john.doe@impilomag.com",
      phone: "+27839876543",
      dob: new Date("1995-08-22"),
      gender: "Male",
      modelType: "Featured",
      visualArts: [],
      height: 185,
      weight: 75,
      bust: 100,
      waist: 80,
      hips: 95,
      shoe: "9",
      hairColor: "Black",
      eyeColor: "Brown",
      instagram: "https://instagram.com/johndoe",
      status: "pending",
    }
  );

  console.log("🎉 Seeding completed!");
}

modelSeed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
module.exports=modelSeed