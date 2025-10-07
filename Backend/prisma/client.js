const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Attach middleware
const formatPhone = require("./middleware/formatPhone");
prisma.$use(formatPhone);

module.exports = prisma;