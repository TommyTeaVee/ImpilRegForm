const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Safely create a new record in any Prisma model.
 * It checks if the item exists using a unique field,
 * and only creates it if it does not exist.
 *
 * @param {string} model - Prisma model name (e.g., "registration")
 * @param {object} where - Unique identifier (e.g., { email: "x@x.com" })
 * @param {object} data - Data to create
 * @returns {Promise<object>} - The existing or new record
 */
async function safeCreate(model, where, data) {
  if (!prisma[model]) {
    throw new Error(`Model "${model}" does not exist in Prisma schema.`);
  }

  // Does it exist?
  const exists = await prisma[model].findUnique({ where });

  if (exists) {
    console.log(`⚠ ${model} already exists:`, Object.values(where)[0]);
    return exists;
  }

  // Create new
  const created = await prisma[model].create({ data });

  console.log(`✓ Created new ${model}:`, Object.values(where)[0]);
  return created;
}

module.exports = { safeCreate };
