import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
const extendedPrisma = new PrismaClient().$extends({
  query: {
    listing: {
      async create({ args, query }) {
        const listing = await query(args);
        if (!listing.id) {
          throw new Error("Listing ID is undefined");
        }
        return await extendedPrisma.listing.update({
          where: { id: listing.id },
          data: { listingNumber: 10000 + listing.id },
        });
      },
    },
  },
}) as PrismaClient;
const prisma: PrismaClient = global.prisma || extendedPrisma;
if (process.env.NODE_ENV === "production") {
  if (!global.prisma) {
    global.prisma = extendedPrisma;
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
