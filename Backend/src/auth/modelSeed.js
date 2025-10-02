// prisma/modelSeed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function modelSeed() {
  // Delete existing data (optional, so seed is clean)
  //await prisma.registration.deleteMany();

  // Jane – InHouse Model
  
  await prisma.registration.create({
    data: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+27831234567",
      dob: new Date("1998-05-12"),
      gender: "Female",
      modelType: "InHouse",
      bio: "Passionate dancer and actor with experience in theatre productions.",
      allergiesOrSkin: "None",
      visualArts: ["Drama / Theatre", "Dance"], // Array OK
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
    },
  });

  // John Doe – Featured Model
  await prisma.registration.create({
    data: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+27839876543",
      dob: new Date("1995-08-22"),
      gender: "Male",
      modelType: "Featured",
      bio: null,
      allergiesOrSkin: null,
      visualArts: [],
      height: 185,
      weight: 75,
      bust: 100,
      waist: 80,
      hips: 95,
      shoe: "9",
      hairColor: "Black",
      eyeColor: "Brown",
      facebook: "https://facebook.com/johndoe",
      instagram: "https://instagram.com/johndoe",
      tiktok: "https://tiktok.com/@johndoe",
      portfolio: "https://www.behance.net/johndoe",
      agency: "Elite Models",
      profileImage: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      fullBodyImage: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
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
    },
  });

  console.log("Database seeded successfully!");
}

modelSeed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = modelSeed;
