import { Listing } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { ListingContactData } from "@/lib/types";
import {
  getMunicipalityPlaces,
  municipalitiesOptions,
} from "@/lib/data/macedonia/importantData";
import { aUsers, nUsers } from "./staticData";
import {
  listingCategoryOptions,
  listingTransactionTypeOptions,
  listingTypeOptions,
  locationPrecisionOptions,
  orientationOptions,
} from "@/lib/data/listing/importantData";
import { randomPropertyImagesCollection } from "@/lib/data/listing/exampleData";
function createSlug(text: string) {
  return text.replace(/\s+/g, "-").toLowerCase();
}
const municipalitiesIds = municipalitiesOptions.map((m) => m.id);
type Coordinate = {
  lng: number;
  lat: number;
};

function generateRandomCoordinates(
  center: Coordinate,
  radiusKm: number,
  count: number,
) {
  const newCoordinates: Coordinate[] = [];

  for (let i = 0; i < count; i++) {
    // Random angle in radians (uniform between 0 and 2 * Pi)
    const angle = Math.random() * 2 * Math.PI;

    // Random distance, taking the square root to ensure uniform distribution
    const distKm = Math.sqrt(Math.random()) * radiusKm;

    // Offset latitude
    const deltaLat = distKm / 110.574; // 1 degree of latitude is ~110.574 km
    const newLat = center.lat + deltaLat * Math.cos(angle);

    // Offset longitude
    const deltaLng = distKm / (111.32 * Math.cos(center.lat * (Math.PI / 180))); // 1 degree of longitude depends on latitude
    const newLng = center.lng + deltaLng * Math.sin(angle);

    newCoordinates.push({ lng: newLng, lat: newLat });
  }

  return newCoordinates;
}

const center: Coordinate = { lng: 21.432767, lat: 41.998129 };
const radiusKm = 12;
const count = 220;

const randomSkopjeCoordinates: Coordinate[] = generateRandomCoordinates(
  center,
  radiusKm,
  count,
);

const regularUserIds = [...nUsers].map((user) => user.id);

const rL: Listing[] = [];

for (let index = 1; index < 100; index++) {
  const userIndex: number = Math.floor(index / 20);
  const tType = faker.helpers.arrayElement(listingTransactionTypeOptions);
  const c = faker.helpers.arrayElement(listingCategoryOptions);
  const t = faker.helpers.arrayElement(listingTypeOptions[c]);
  if (!municipalitiesIds || municipalitiesIds.length === 0) {
    console.log("municipalitiesIds is empty or null");
  }
  const municipality = faker.helpers.arrayElement(municipalitiesIds);

  const populatedPlaces = getMunicipalityPlaces(municipality) || [{ id: "Z" }];
  if (!populatedPlaces || populatedPlaces.length === 0) {
    console.log("populatedPlaces is empty or null");
  }
  const populatedPlacesIds = populatedPlaces.map((p) => p.id);
  const place = faker.helpers.arrayElement(populatedPlacesIds);
  const district = faker.helpers.arrayElement(["bs"]);
  const address = faker.location.streetAddress(true);
  const fullAddress = `${address}, ${place}, ${municipality}`;
  const images = faker.helpers.arrayElements(randomPropertyImagesCollection, 6);

  const contactData: ListingContactData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    emailVerified: false,
    phone: faker.phone.number(),
    phoneVerified: false,
    contactHours: "9:00 AM - 5:00 PM",
  };
  rL.push({
    id: "u-listing" + index,
    externalRef: null,
    listingNumber: 122 + index,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
    availabilityDate: new Date(),
    userId: regularUserIds[userIndex],
    transactionType: tType,
    category: c,
    type: t,
    ///
    municipality: municipality,
    place: place,
    district: district,
    address: address,
    fullAddress: fullAddress,
    longitude: randomSkopjeCoordinates[index - 1].lng,
    latitude: randomSkopjeCoordinates[index - 1].lat,
    locationPrecision: faker.helpers.arrayElement(locationPrecisionOptions),
    ///
    title: faker.lorem.words(4),
    price: faker.number.int({ min: 50000, max: 300000 }),
    previousPrice: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 50000, max: 300000 }),
    ]),
    priceHistory: null,
    area: faker.number.int({ min: 25, max: 600 }),
    orientation: faker.helpers.arrayElement(
      orientationOptions.map((o) => o.value),
    ),
    floorNumber: faker.number.int({ min: 1, max: 15 }),
    ///
    bedrooms: faker.number.int({ min: 1, max: 5 }),
    bathrooms: faker.number.int({ min: 1, max: 5 }),
    wcs: faker.number.int({ min: 1, max: 5 }),
    kitchens: faker.number.int({ min: 1, max: 5 }),
    livingRooms: faker.number.int({ min: 1, max: 5 }),
    ///
    parking: faker.datatype.boolean(),
    elevator: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    yard: faker.datatype.boolean(),
    basement: faker.datatype.boolean(),
    ///
    description: faker.lorem.paragraph({
      min: 3,
      max: 6,
    }),
    mkdDescription:
      faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Macedonian",
    albDescription:
      faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Albanian",
    ///
    mainImage: images[0],
    images: images,
    videoLink: "https://www.youtube.com/watch?v=R8OejFuUYqo",
    ///
    isArchived: false,
    isVisible: true,
    isPublished: true,
    publishedAt: new Date(),
    publishEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    //
    tags: [],
    isPaidPromo: false,
    ///
    contactData: JSON.stringify(contactData as ListingContactData),
  });
}

export const regularListings: Listing[] = rL;

const agencyUserIds = [...aUsers].map((user) => user.id);

const aL: Listing[] = [];

for (let index = 1; index < 100; index++) {
  const userIndex = Math.floor(index / 20);
  const tType = faker.helpers.arrayElement(listingTransactionTypeOptions);
  const c = faker.helpers.arrayElement(listingCategoryOptions);
  const t = faker.helpers.arrayElement(listingTypeOptions[c]);

  const municipality = faker.helpers.arrayElement(municipalitiesIds);
  const populatedPlaces = getMunicipalityPlaces(municipality) || [{ id: "Z" }];
  if (!populatedPlaces || populatedPlaces.length === 0) {
    console.log("populatedPlaces is empty or null");
  }
  const populatedPlacesIds = populatedPlaces.map((p) => p.id);
  const place = faker.helpers.arrayElement(populatedPlacesIds);

  const district = faker.helpers.arrayElement(["bs"]);
  const address = faker.location.streetAddress(true);
  const fullAddress = `${address}, ${place}, ${municipality}`;
  const images = faker.helpers.arrayElements(randomPropertyImagesCollection, 6);

  const contactData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    emailVerified: false,
    phone: faker.phone.number(),
    phoneVerified: false,
    contactHours: "9:00 AM - 5:00 PM",
  };
  aL.push({
    id: "a-listing" + index,
    externalRef: null,
    listingNumber: index,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
    availabilityDate: new Date(),
    userId: agencyUserIds[userIndex],
    transactionType: tType,
    category: c,
    type: t,
    ///
    municipality: municipality,
    place: place,
    district: district,
    address: address,
    fullAddress: fullAddress,
    longitude: randomSkopjeCoordinates[index + 101 - 1].lng,
    latitude: randomSkopjeCoordinates[index + 101 - 1].lat,
    locationPrecision: faker.helpers.arrayElement(locationPrecisionOptions),
    ///
    title: faker.lorem.words(4),
    price: faker.number.int({ min: 50000, max: 300000 }),
    previousPrice: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 50000, max: 300000 }),
    ]),
    priceHistory: null,
    area: faker.number.int({ min: 25, max: 600 }),
    orientation: faker.helpers.arrayElement(
      orientationOptions.map((o) => o.value),
    ),
    floorNumber: faker.number.int({ min: 1, max: 15 }),
    ///
    bedrooms: faker.number.int({ min: 1, max: 5 }),
    bathrooms: faker.number.int({ min: 1, max: 5 }),
    wcs: faker.number.int({ min: 1, max: 5 }),
    kitchens: faker.number.int({ min: 1, max: 5 }),
    livingRooms: faker.number.int({ min: 1, max: 5 }),
    ///
    parking: faker.datatype.boolean(),
    elevator: faker.datatype.boolean(),
    balcony: faker.datatype.boolean(),
    yard: faker.datatype.boolean(),
    basement: faker.datatype.boolean(),
    ///
    description: faker.lorem.paragraph({
      min: 3,
      max: 6,
    }),
    mkdDescription:
      faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Macedonian",
    albDescription:
      faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Albanian",
    ///
    mainImage: images[0],
    images: images,
    videoLink: "https://www.youtube.com/watch?v=R8OejFuUYqo",
    ///
    isArchived: false,
    isVisible: true,
    isPublished: true,
    publishedAt: new Date(),
    publishEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    //
    tags: [],
    isPaidPromo: false,
    ///
    contactData: JSON.stringify(contactData as ListingContactData),
  });
}

export const agencyListings: Listing[] = aL;
