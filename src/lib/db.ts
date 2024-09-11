import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}
const prismadb = prisma;
export default prismadb;

// const client = new PrismaClient({
//   log:
//     process.env.NODE_ENV === "development"
//       ? ["error", "warn"]
//       : ["error"],
// });

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prismadb = globalForPrisma.prisma ?? client;

// if (process.env.NODE_ENV === "production") {
//   globalForPrisma.prisma = client;
// }
