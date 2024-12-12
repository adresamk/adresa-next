// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

import { agencyListings, regularListings } from "./generatedData";
import { generateListings } from "./helpers";
import { generateAgencyAccounts } from "./helpers";
import { generateUserAccounts } from "./helpers";
// import { a, aUsers, nUsers } from "./staticData";

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
