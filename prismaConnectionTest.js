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

// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();

// async function createUser() {
//   const newUser = await prisma.user.create({
//     data: {
//       email: "john.doe@example.com",
//       name: "John Doe",
//       hashedPassword: "hashed_password",
//     },
//   });

//   console.log("New user created:", newUser);
// }

// createUser();
