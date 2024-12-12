import { Argon2id } from "oslo/password";
import { agencyListings } from "./generatedData";
import { a, nUsers } from "./staticData";

import prismadb from "@/lib/db";
import {
  Account,
  AccountType,
  User,
  Agency,
  PropertyCategory,
  PropertyTransactionType,
  LocationPrecision,
  PropertyType,
  ListingStatus,
  Listing,
  Residential,
  ResidentalPropertyType,
  CommercialPropertyType,
  LandPropertyType,
  OtherPropertyType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import {
  contactHoursOptions,
  preferredContactMethodOptions,
} from "@/lib/data/user/importantData";
import { randomSkopjeCoordinates } from "@/lib/data/macedonia/exampleData";
import {
  accessFromOptions,
  heatingMediumOptions,
  heatingTypeOptions,
  listingTypeOptions,
  orientationOptions,
  slopeOptions,
  zoneOptions,
} from "@/lib/data/listing/importantData";
import {
  getMunicipalitiesOptions,
  getMunicipalityPlaces,
} from "@/lib/data/macedonia/importantData";
import { randomPropertyImagesCollection } from "@/lib/data/listing/exampleData";

const password = "test123";
async function generateAgencyAccount(idx: number) {
  const newAccountData = {
    email: `agency${idx}@test.com`,
    hashedPassword: await new Argon2id().hash(password),
    role: AccountType.AGENCY,
    emailVerified: new Date(),
  };
  const newAgencyAccount = await prismadb.account.upsert({
    where: {
      email: newAccountData.email,
    },
    create: newAccountData,
    update: newAccountData,
  });

  return newAgencyAccount;
}
async function generateUserAccount(idx: number) {
  const newAccountData = {
    email: `user${idx}@test.com`,
    hashedPassword: await new Argon2id().hash(password),
    role: AccountType.USER,
    emailVerified: new Date(),
  };
  const newUserAccount = await prismadb.account.upsert({
    where: {
      email: `user${idx}@test.com`,
    },
    create: newAccountData,
    update: newAccountData,
  });

  return newUserAccount;
}
async function generateUserProfile(account: Account) {
  const newUserData = {
    uuid: account.uuid,
    accountId: account.id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    phoneVerified: new Date(),
    pictureUrl: faker.image.avatar(),
    contactName: faker.person.fullName(),
    contactPhone: faker.phone.number(),
    contactPhoneVerified: new Date(),
    contactEmail: faker.internet.email(),
    contactEmailVerified: new Date(),
    contactHours: faker.helpers.arrayElement(contactHoursOptions),
    preferredContactMethod: faker.helpers.arrayElement(
      preferredContactMethodOptions,
    ),
  };
  console.log("Adding new user profile", newUserData);
  const user = await prismadb.user.upsert({
    where: {
      accountId: account.id,
    },
    create: newUserData,
    update: newUserData,
  });

  return user;
}
async function generateAgencyProfile(account: Account) {
  const gpsLocation = faker.helpers.arrayElement(randomSkopjeCoordinates);
  const newAgencyData = {
    uuid: account.uuid,
    accountId: account.id,

    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()),
    address: faker.location.streetAddress(),
    website: faker.internet.url(),
    phone: faker.phone.number(),
    phoneVerified: new Date(),
    logoUrl: faker.image.avatar(),
    workHours: faker.helpers.arrayElement([
      "9:00 AM - 5:00 PM",
      "10:00 AM - 6:00 PM",
      "11:00 AM - 7:00 PM",
    ]),
    gpsLocation: `${gpsLocation.lng},${gpsLocation.lat}`,
    description: faker.lorem.paragraph(),
    shortDescription: faker.lorem.sentence(),
    branding: faker.helpers.arrayElement([""]),

    ownerFirstName: faker.person.firstName(),
    ownerLastName: faker.person.lastName(),
    ownerEmail: faker.internet.email(),
    ownerPhone: faker.phone.number(),

    contactPersonFullName: faker.person.fullName(),
    contactPersonEmail: faker.internet.email(),
    contactPersonPhone: faker.phone.number(),
    preferredContactMethod: faker.helpers.arrayElement(
      preferredContactMethodOptions,
    ),
    contactHours: faker.helpers.arrayElement(contactHoursOptions),
  };
  console.log("Adding new agency profile", newAgencyData);

  const agency = await prismadb.agency.upsert({
    where: {
      accountId: account.id,
    },
    create: newAgencyData,
    update: newAgencyData,
  });

  return agency;
}
export async function generateListings(user: User | Agency, count: number) {
  let existingCounter = await prismadb.counter.findFirst({
    where: {
      name: "listing-number-counter",
    },
  });
  if (!existingCounter) {
    existingCounter = await prismadb.counter.create({
      data: {
        name: "listing-number-counter",
        value: 10000,
      },
    });
  }

  const randomNumber = faker.number.int({ min: 1, max: 4 });

  //   const residential =
  for (let i = 0; i < count; i++) {
    const transactionType = faker.helpers.arrayElement(
      Object.values(PropertyTransactionType),
    );
    const category = faker.helpers.arrayElement(
      Object.values(PropertyCategory),
    );
    const type = faker.helpers.arrayElement(listingTypeOptions[category]);
    const municipalityId = faker.helpers.arrayElement(
      getMunicipalitiesOptions(),
    );
    const placeId = faker.helpers.arrayElement(
      getMunicipalityPlaces(municipalityId).places,
    );
    const address = faker.location.streetAddress();
    const fullAddress = `${municipalityId} ${placeId} ${address}`;
    const rndSkopjeCoordinates = faker.helpers.arrayElement(
      randomSkopjeCoordinates,
    );
    const longitude = rndSkopjeCoordinates.lng;
    const latitude = rndSkopjeCoordinates.lat;
    const locationPrecision = faker.helpers.arrayElement(
      Object.values(LocationPrecision),
    );

    const title = faker.lorem.sentence();
    const mkdTitle = "MKD: " + title;
    const albTitle = "ALB: " + title;
    const description = faker.lorem.paragraph();
    const mkdDescription = "MKD: " + description;
    const albDescription = "ALB: " + description;

    const price = faker.number.int({ min: 5000, max: 300000 });
    const previousPrice = faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 50000, max: 300000 }),
    ]);
    const priceHistory = null;
    const area = faker.number.int({ min: 25, max: 600 });
    const images = faker.helpers.arrayElements(
      randomPropertyImagesCollection,
      faker.number.int({ min: 4, max: 8 }),
    );
    const mainImage = images[0];

    const videoLink = faker.helpers.arrayElement([
      null,
      "https://www.youtube.com/watch?v=R8OejFuUYqo",
    ]);
    const isPublished = faker.datatype.boolean({ probability: 0.8 });
    const status = isPublished ? ListingStatus.ACTIVE : ListingStatus.DRAFT;
    const publishedAt = isPublished ? new Date() : null;
    const publishEndDate = isPublished
      ? new Date(new Date().setMonth(new Date().getMonth() + 6))
      : null;
    const isVisible = faker.datatype.boolean({ probability: 0.8 });
    const isArchived = false;
    const isPaidPromo = faker.datatype.boolean({ probability: 0.12 });

    const newListingData = {
      listingNumber: i + 20000,
      uuid: faker.string.uuid(),
      externalRef: null,
      userId: user ? user.id : null,
      agencyId: user ? null : null,
      queryHash: "",
      transactionType: transactionType,
      category: category,
      type: type,
      municipality: municipalityId,
      place: placeId,
      address: address,
      fullAddress: fullAddress,
      district: null,
      latitude: latitude,
      longitude: longitude,
      locationPrecision: locationPrecision,
      title: title,
      mkdTitle: mkdTitle,
      albTitle: albTitle,
      description: description,
      mkdDescription: mkdDescription,
      albDescription: albDescription,
      price: price,
      previousPrice: previousPrice,
      priceHistory: { set: null },
      area: area,
      mainImage: mainImage,
      images: images,
      videoLink: videoLink,
      status: status,
      isArchived: isArchived,
      isVisible: isVisible,
      isPublished: isPublished,
      publishedAt: publishedAt,
      publishEndDate: publishEndDate,
      isPaidPromo: isPaidPromo,
    };
    console.log("Adding new listing", newListingData.uuid);

    const listing = await prismadb.listing.upsert({
      where: {
        id: i + 50,
      },
      create: newListingData,
      update: newListingData,
    });

    if (category === PropertyCategory.residential) {
      await createResidential(listing);
    } else if (category === PropertyCategory.commercial) {
      await createCommercial(listing);
    } else if (category === PropertyCategory.land) {
      await createLand(listing);
    } else if (category === PropertyCategory.other) {
      await createOther(listing);
    }
  }
}
async function createResidential(listing: Listing) {
  const floor = faker.number.int({ min: 1, max: 10 });
  const newResidentialData = {
    listingId: listing.id,
    propertyType: faker.helpers.arrayElement(
      Object.values(ResidentalPropertyType),
    ),
    floor: floor.toString(),
    totalFloors: faker.number.int({ min: 0, max: floor }),
    orientation: faker.helpers.arrayElement(Object.values(orientationOptions)),
    zone: faker.helpers.arrayElement(Object.values(zoneOptions)),
    constructionYear: faker.number.int({ min: 1800, max: 2024 }),
    totalPropertyArea: faker.number.int({ min: listing.area!, max: 600 }),

    isFurnished: faker.datatype.boolean({ probability: 0.18 }),
    isForStudents: faker.datatype.boolean({ probability: 0.2 }),
    isForHolidayHome: faker.datatype.boolean({ probability: 0.15 }),
    commonExpenses: faker.number.int({ min: 50, max: 1000 }),
    heatingType: faker.helpers.arrayElement(heatingTypeOptions),
    heatingMedium: faker.helpers.arrayElement(heatingMediumOptions),

    bedroomCount: faker.number.int({ min: 1, max: 5 }),
    bathroomCount: faker.number.int({ min: 1, max: 5 }),
    wcCount: faker.number.int({ min: 1, max: 5 }),
    kitchenCount: faker.number.int({ min: 1, max: 5 }),
    livingRoomCount: faker.number.int({ min: 1, max: 5 }),
  };
  const residential = await prismadb.residential.upsert({
    where: {
      id: listing.id + 1000,
    },
    create: newResidentialData,
    update: newResidentialData,
  });
}
async function createCommercial(listing: Listing) {
  const floor = faker.number.int({ min: 1, max: 10 });
  const newCommercialData = {
    listingId: listing.id,
    propertyType: faker.helpers.arrayElement(
      Object.values(CommercialPropertyType),
    ),
    constructionYear: faker.number.int({ min: 1800, max: 2024 }),
    totalPropertyArea: faker.number.int({ min: listing.area!, max: 600 }),
    floor: floor,

    isCornerProperty: faker.datatype.boolean({ probability: 0.1 }),
    isOnTopFloor: faker.datatype.boolean({ probability: 0.1 }),

    accessFrom: faker.helpers.arrayElement(Object.values(accessFromOptions)),

    commonExpenses: faker.number.int({ min: 50, max: 1000 }),
    heatingType: faker.helpers.arrayElement(heatingTypeOptions),
    heatingMedium: faker.helpers.arrayElement(heatingMediumOptions),

    wcCount: faker.number.int({ min: 1, max: 5 }),
  };
  const commercial = await prismadb.commercial.upsert({
    where: {
      id: listing.id + 1000,
    },
    create: newCommercialData,
    update: newCommercialData,
  });
}
async function createLand(listing: Listing) {
  const newLandData = {
    listingId: listing.id,
    propertyType: faker.helpers.arrayElement(Object.values(LandPropertyType)),
    isCornerProperty: faker.datatype.boolean({ probability: 0.1 }),
    orientation: faker.helpers.arrayElement(Object.values(orientationOptions)),
    zone: faker.helpers.arrayElement(Object.values(zoneOptions)),
    accessFrom: faker.helpers.arrayElement(Object.values(accessFromOptions)),
    slope: faker.helpers.arrayElement(Object.values(slopeOptions)),
  };
  const land = await prismadb.land.upsert({
    where: {
      id: listing.id + 1000,
    },
    create: newLandData,
    update: newLandData,
  });
}
async function createOther(listing: Listing) {
  const newOtherData = {
    listingId: listing.id + 99,
    propertyType: faker.helpers.arrayElement(Object.values(OtherPropertyType)),

    accessFrom: faker.helpers.arrayElement(Object.values(accessFromOptions)),
    totalPropertyArea: faker.number.int({ min: listing.area!, max: 600 }),
  };
  const other = await prismadb.other.upsert({
    where: {
      id: listing.id + 1000,
    },
    create: newOtherData,
    update: newOtherData,
  });
}
export async function generateUserAccounts() {
  for (let i = 0; i < 10; i++) {
    const userAccount = await generateUserAccount(i);
    const userProfile = await generateUserProfile(userAccount);
    await generateListings(userProfile, 15);
  }
}

export async function generateAgencyAccounts() {
  for (let i = 0; i < 10; i++) {
    const agencyAccount = await generateAgencyAccount(i);
    const agencyProfile = await generateAgencyProfile(agencyAccount);
    await generateListings(agencyProfile, 15);
  }
}
