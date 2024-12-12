// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

import { generateAgencyAccounts } from "./helpers";
import { generateUserAccounts } from "./helpers";

const prisma = new PrismaClient();

async function main() {
  await generateUserAccounts();
  await generateAgencyAccounts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
