const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to database  successfully!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect after testing
  }
}

testConnection();
