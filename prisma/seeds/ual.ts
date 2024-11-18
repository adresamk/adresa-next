// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

import { agencyListings, regularListings } from "./generatedData";
import { a, aUsers, nUsers } from "./staticData";

const prisma = new PrismaClient();

async function main() {
  // Create some users

  // REGULAR USERS
  const normalUsers = nUsers;
  async function hashPasswords() {
    const argon2id = new Argon2id();
    for (const user of normalUsers) {
      user.hashedPassword = await argon2id.hash(user.hashedPassword!);
    }
  }
  await hashPasswords();
  const normalUserPromises = nUsers.map(async (user) => {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  });
  await Promise.all(normalUserPromises);

  // AGENCIES
  const agencies = a;
  const agenciesPromises = agencies.map(async (agency) => {
    await prisma.agency.upsert({
      where: { id: agency.id },
      update: {},
      create: agency,
    });
  });
  await Promise.all(agenciesPromises);

  // AGENCY USERS (OWNERS)
  const agencyUsers = aUsers;
  async function hashAPasswords() {
    const argon2id = new Argon2id();
    for (const user of agencyUsers) {
      user.hashedPassword = await argon2id.hash(user.hashedPassword!);
    }
  }
  await hashAPasswords();
  const agenciyUsersPromises = agencyUsers.map(async (user) => {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
    console.log("added user", user.id);
  });
  await Promise.all(agenciyUsersPromises);

  // LISTINGS FOR REGULAR USERS
  const regularListingsPromises = regularListings.map(async (listing) => {
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: {},
      create: {
        ...listing,
        priceHistory: {
          prices: [100, 120, 130], // Example JSON
          dates: ["2021-01-01", "2021-02-01"],
        },
      },
    });
    console.log("added u listing", listing.id);
  });

  await Promise.all(regularListingsPromises);

  // LISTINGS FOR AGENCY USERS

  const agencyListingsPromises = agencyListings.map(async (listing) => {
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: {},
      create: {
        ...listing,
        priceHistory: {
          prices: [100, 120, 130], // Example JSON
          dates: ["2021-01-01", "2021-02-01"],
        },
      },
    });
    console.log("added a listing", listing.id);
  });

  await Promise.all(agencyListingsPromises);
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
