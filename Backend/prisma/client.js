const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Attach middleware
const formatPhone = require("./middleware/formatPhone");
await prisma.$extends(formatPhone);

module.exports = prisma;