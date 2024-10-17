"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.agencyListings =
  exports.regularListings =
  exports.nUsers =
  exports.aUsers =
  exports.a =
    void 0;
var faker_1 = require("@faker-js/faker");
var data_1 = require("../../../src/global/data.js");
function generateRandomCoordinates(center, radiusKm, count) {
  var newCoordinates = [];
  for (var i = 0; i < count; i++) {
    // Random distance in km from the center
    var distKm = Math.random() * radiusKm;
    // Random angle in radians
    var angle = Math.random() * 2 * Math.PI;
    // Offset latitude
    var deltaLat = distKm / 110.574; // 1 degree of latitude is ~110.574 km
    var newLat =
      center.lat + (Math.random() < 0.5 ? -1 : 1) * deltaLat;
    // Offset longitude
    var deltaLng =
      distKm / (111.32 * Math.cos(newLat * (Math.PI / 180))); // 1 degree of longitude depends on latitude
    var newLng =
      center.lng + (Math.random() < 0.5 ? -1 : 1) * deltaLng;
    newCoordinates.push({ lng: newLng, lat: newLat });
  }
  return newCoordinates;
}
var center = { lng: 21.432767, lat: 41.998129 };
var radiusKm = 12;
var count = 220;
var randomSkopjeCoordinates = generateRandomCoordinates(
  center,
  radiusKm,
  count
);
exports.a = [
  {
    id: "agency1",
    name: "Agency 1",
    slug: "agency-1",
    address: "123 Main Street, Anytown, USA",
    website: "https://www.agency1.com",
    phone: "+1234567890",
    logoUrl: "https://m1.spitogatos.gr/94825956_100x50.jpg",
    contactPersonFullName: "John Doe",
    contactPersonEmail: "johndoe@example.com",
    contactPersonPhone: "+1234567890",
    workHours: "9:00 AM - 5:00 PM",
    gpsLocation: "40.7128, -74.0060",
    description:
      "BINSWANGER BINIARIS Company represents exclusively in Greece the International Group BINSWANGER AMERICA LLC (www.binswanger.com), leader in the international real estate market, with clients 2/3 of the companies of FORTUNE 500, providing complete solutions to multinational companies related to their needs in the real estate sector.\n    Our Company, in addition to the activity of its residential sector, with the support of the specialized in-house departments of our engineering and legal consultants, provides additional integrated solutions in special real estate issues, such as the relocation of multinational companies, the renegotiation of rents, the appraisal of the property, the preparation of studies, the full consulting coverage of our clients, etc.",
    shortDescription: "A brief description of Agency 1.",
    branding: "",
  },
  {
    id: "agency2",
    name: "Agency 2",
    slug: "agency-2",
    address: "123 Main Street, Anytown, USA",
    website: "https://www.agency2.com",
    phone: "+1234567890",
    logoUrl: "https://m1.spitogatos.gr/256486380_100x50.jpg",
    contactPersonFullName: "Sasko Saskovski",
    contactPersonEmail: "sasko@example.com",
    contactPersonPhone: "+1234567890",
    workHours: "9:00 AM - 5:00 PM",
    gpsLocation: "40.7128, -74.0060",
    description:
      "Who we are\n    At Real Estate One, we provide high quality services in the field of Property Management through many years of professional knowledge and expertise.\n    \n    At our offices, our specialized Consultants, with integrity and professionalism will help you find the property you really want through our portfolio of more than 30,000 properties.\n    \n    Our Knowledge & Expertise are always at your service!\n    ",
    shortDescription: "A brief description of Agency 2.",
    branding: "",
  },
  {
    id: "agency3",
    name: "Agency 3",
    slug: "agency-3",
    address: "123 Main Street, Anytown, USA",
    website: "https://www.agency3.com",
    phone: "+1234567890",
    logoUrl: "https://m1.spitogatos.gr/242517570_100x50.jpg",
    contactPersonFullName: "Petko Petkovski",
    contactPersonEmail: "petko@example.com",
    contactPersonPhone: "+1234567890",
    workHours: "9:00 AM - 5:00 PM",
    gpsLocation: "40.7128, -74.0060",
    description:
      "The real estate agency Keller Williams Athens Riviera operates in Attica, especially in the area of the southern suburbs of Athens. Our experience in the real estate industry begins in 1977 as a construction company in Neo Kosmos.\n    \n    Our main concern is to be a quality choice in the provision of real estate services, offering vertically integrated services to the entire range of the real estate market. Our team consists of trained real estate consultants to Keller Williams standards and is complemented by an engineer, architect, decorator, mechanical engineer, REV/MRICS real estate appraiser, attorney and notary public\n    ",
    shortDescription: "A brief description of Agency 3.",
    branding: "",
  },
  {
    id: "agency4",
    name: "Agency 4",
    slug: "agency-4",
    address: "123 Main Street, Anytown, USA",
    website: "https://www.agency4.com",
    phone: "+1234567890",
    logoUrl: "https://m1.spitogatos.gr/1658724_100x50.jpg",
    contactPersonFullName: "Papp Pappev",
    contactPersonEmail: "papp@example.com",
    contactPersonPhone: "+1234567890",
    workHours: "9:00 AM - 5:00 PM",
    gpsLocation: "40.7128, -74.0060",
    description: "",
    shortDescription: "A brief description of Agency 4.",
    branding: "",
  },
  {
    id: "agency5",
    name: "Agency 5",
    slug: "agency-5",
    address: "123 Main Street, Anytown, USA",
    website: "https://www.agency5.com",
    phone: "+1234567890",
    logoUrl: "https://m1.spitogatos.gr/210921582_100x50.jpg",
    contactPersonFullName: "Boriz Borizov",
    contactPersonEmail: "boriz@example.com",
    contactPersonPhone: "+1234567890",
    workHours: "9:00 AM - 5:00 PM",
    gpsLocation: "40.7128, -74.0060",
    description:
      "The real estate market is one of its most demanding and competitive industries\n    economy, as it is directly linked to all productive sectors.\n    \n    BlueBrick and its partners, with responsibility, knowledge and reliability, making use of it\n    their many years of experience, excellent training, new technologies and modern developments\n    in the real estate industry, provides comprehensive and high-level consulting\n    services, in the field of research and information about the real estate market, the\n    investment opportunities in the industry as well as finding properties at very affordable prices",
    shortDescription: "A brief description of Agency 5.",
    branding: "",
  },
];
exports.aUsers = [
  {
    id: "agency-g112c3d4-e5f6-7890-abcd-ef12345678901",
    email: "agency1@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "AGENCY",
    firstName: "Agency1",
    lastName: "Owner1",
    hashedPassword: "password1",
    picture: "",
    agencyId: "agency1",
    emailVerified: new Date(),
    phone: "044 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "agency-g122c3d4-e5f6-7890-abcd-ef12345678901",
    email: "agency2@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "AGENCY",
    firstName: "Agency2",
    lastName: "Owner2",
    hashedPassword: "password2",
    picture: "",
    agencyId: "agency2",
    emailVerified: new Date(),
    phone: "044 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "agency-g132c3d4-e5f6-7890-abcd-ef12345678901",
    email: "agency3@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "AGENCY",
    firstName: "Agency3",
    lastName: "Owner3",
    hashedPassword: "password3",
    picture: "",
    agencyId: "agency3",
    emailVerified: new Date(),
    phone: "044 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "agency-g142c3d4-e5f6-7890-abcd-ef12345678901",
    email: "agency4@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "AGENCY",
    firstName: "Agency4",
    lastName: "Owner4",
    hashedPassword: "password4",
    picture: "",
    agencyId: "agency4",
    emailVerified: new Date(),
    phone: "044 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "agency-g152c3d4-e5f6-7890-abcd-ef12345678901",
    email: "agency5@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "AGENCY",
    firstName: "Agency5",
    lastName: "Owner5",
    hashedPassword: "password5",
    picture: "",
    agencyId: "agency5",
    emailVerified: new Date(),
    phone: "044 123 4567",
    phoneVerified: new Date(),
  },
];
exports.nUsers = [
  {
    id: "user-a112c3d4-e5f6-7890-abcd-ef12345678901",
    email: "user1@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "USER",
    firstName: "John",
    lastName: "Doe",
    hashedPassword: "password1",
    // hashedPassword: await new Argon2id().hash("user" + "1"),
    picture: "",
    agencyId: null,
    emailVerified: new Date(),
    phone: "022 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "user-a122c3d4-e5f6-7890-abcd-ef12345678901",
    email: "user2@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "USER",
    firstName: "Jane",
    lastName: "Smith",
    hashedPassword: "password2",
    picture: "",
    agencyId: null,
    emailVerified: new Date(),
    phone: "022 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "user-a132c3d4-e5f6-7890-abcd-ef12345678901",
    email: "user3@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "USER",
    firstName: "Michael",
    lastName: "Johnson",
    hashedPassword: "password3",
    picture: "",
    agencyId: null,
    emailVerified: new Date(),
    phone: "022 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "user-a142c3d4-e5f6-7890-abcd-ef12345678901",
    email: "user4@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "USER",
    firstName: "Emily",
    lastName: "Brown",
    hashedPassword: "password4",
    picture: "",
    agencyId: null,
    emailVerified: new Date(),
    phone: "022 123 4567",
    phoneVerified: new Date(),
  },
  {
    id: "user-a152c3d4-e5f6-7890-abcd-ef12345678901",
    email: "user5@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "USER",
    firstName: "David",
    lastName: "Wilson",
    hashedPassword: "password5",
    picture: "",
    agencyId: null,
    emailVerified: new Date(),
    phone: "022 123 4567",
    phoneVerified: new Date(),
  },
];
var regularUserIds = __spreadArray([], exports.nUsers, true).map(
  function (user) {
    return user.id;
  }
);
var rL = [];
for (var index = 1; index < 100; index++) {
  var userIndex = Math.floor(index / 20);
  var tType = faker_1.faker.helpers.arrayElement(
    data_1.listingTransactionTypeOptions
  );
  var c = faker_1.faker.helpers.arrayElement(
    data_1.listingCategoryOptions
  );
  var t = faker_1.faker.helpers.arrayElement(
    data_1.listingTypeOptions[c]
  );
  var manucipality = faker_1.faker.helpers.arrayElement(
    data_1.manucipalities
  );
  var place = faker_1.faker.helpers.arrayElement(
    data_1.populatedPlaces
  );
  var district = faker_1.faker.helpers.arrayElement(data_1.districts);
  var address = faker_1.faker.location.streetAddress(true);
  var fullAddress = ""
    .concat(address, ", ")
    .concat(place, ", ")
    .concat(manucipality);
  var images = faker_1.faker.helpers.arrayElements(
    data_1.randomPropertyImagesCollection,
    6
  );
  var contactData = {
    firstName: faker_1.faker.person.firstName(),
    lastName: faker_1.faker.person.lastName(),
    email: faker_1.faker.internet.email(),
    emailVerified: false,
    phone: faker_1.faker.phone.number(),
    phoneVerified: false,
    contactHours: "9:00 AM - 5:00 PM",
  };
  rL.push({
    id: "listing" + index,
    listingNumber: index,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
    availabilityDate: new Date(),
    userId: regularUserIds[userIndex],
    transactionType: tType,
    category: c,
    type: t,
    ///
    manucipality: manucipality,
    place: place,
    district: district,
    address: address,
    fullAddress: fullAddress,
    longitude: randomSkopjeCoordinates[index - 1].lng,
    latitude: randomSkopjeCoordinates[index - 1].lat,
    locationPrecision: faker_1.faker.helpers.arrayElement(
      data_1.locationPrecisionOptions
    ),
    ///
    price: faker_1.faker.number.int({ min: 50000, max: 300000 }),
    previousPrice: faker_1.faker.helpers.arrayElement([
      null,
      faker_1.faker.number.int({ min: 50000, max: 300000 }),
    ]),
    priceHistory: null,
    area: faker_1.faker.number.int({ min: 25, max: 600 }),
    orientation: faker_1.faker.helpers.arrayElement(
      data_1.orientationOptions.map(function (o) {
        return o.value;
      })
    ),
    floorNumber: faker_1.faker.number.int({ min: 1, max: 15 }),
    ///
    bedrooms: faker_1.faker.number.int({ min: 1, max: 5 }),
    bathrooms: faker_1.faker.number.int({ min: 1, max: 5 }),
    wcs: faker_1.faker.number.int({ min: 1, max: 5 }),
    kitchens: faker_1.faker.number.int({ min: 1, max: 5 }),
    livingRooms: faker_1.faker.number.int({ min: 1, max: 5 }),
    ///
    parking: faker_1.faker.datatype.boolean(),
    elevator: faker_1.faker.datatype.boolean(),
    balcony: faker_1.faker.datatype.boolean(),
    yard: faker_1.faker.datatype.boolean(),
    basement: faker_1.faker.datatype.boolean(),
    ///
    description: faker_1.faker.lorem.paragraph({
      min: 3,
      max: 6,
    }),
    mkdDescription:
      faker_1.faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Macedonian",
    albDescription:
      faker_1.faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Albanian",
    ///
    mainImage: images[0],
    images: images,
    videoLink: "https://www.youtube.com/watch?v=R8OejFuUYqo",
    ///
    isArchived: false,
    isPublished: true,
    publishedAt: new Date(),
    publishEndDate: new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    ),
    //
    tags: [],
    isPaidPromo: false,
    ///
    contactData: JSON.stringify(contactData),
  });
}
exports.regularListings = rL;
var agencyUserIds = __spreadArray([], exports.aUsers, true).map(
  function (user) {
    return user.id;
  }
);
var aL = [];
for (var index = 1; index < 100; index++) {
  var userIndex = Math.floor(index / 20);
  var tType = faker_1.faker.helpers.arrayElement(
    data_1.listingTransactionTypeOptions
  );
  var c = faker_1.faker.helpers.arrayElement(
    data_1.listingCategoryOptions
  );
  var t = faker_1.faker.helpers.arrayElement(
    data_1.listingTypeOptions[c]
  );
  var manucipality = faker_1.faker.helpers.arrayElement(
    data_1.manucipalities
  );
  var place = faker_1.faker.helpers.arrayElement(
    data_1.populatedPlaces
  );
  var district = faker_1.faker.helpers.arrayElement(data_1.districts);
  var address = faker_1.faker.location.streetAddress(true);
  var fullAddress = ""
    .concat(address, ", ")
    .concat(place, ", ")
    .concat(manucipality);
  var images = faker_1.faker.helpers.arrayElements(
    data_1.randomPropertyImagesCollection,
    6
  );
  var contactData = {
    firstName: faker_1.faker.person.firstName(),
    lastName: faker_1.faker.person.lastName(),
    email: faker_1.faker.internet.email(),
    emailVerified: false,
    phone: faker_1.faker.phone.number(),
    phoneVerified: false,
    contactHours: "9:00 AM - 5:00 PM",
  };
  aL.push({
    id: "listing" + index,
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
    manucipality: manucipality,
    place: place,
    district: district,
    address: address,
    fullAddress: fullAddress,
    longitude: randomSkopjeCoordinates[index + 101 - 1].lng,
    latitude: randomSkopjeCoordinates[index + 101 - 1].lat,
    locationPrecision: faker_1.faker.helpers.arrayElement(
      data_1.locationPrecisionOptions
    ),
    ///
    price: faker_1.faker.number.int({ min: 50000, max: 300000 }),
    previousPrice: faker_1.faker.helpers.arrayElement([
      null,
      faker_1.faker.number.int({ min: 50000, max: 300000 }),
    ]),
    priceHistory: null,
    area: faker_1.faker.number.int({ min: 25, max: 600 }),
    orientation: faker_1.faker.helpers.arrayElement(
      data_1.orientationOptions.map(function (o) {
        return o.value;
      })
    ),
    floorNumber: faker_1.faker.number.int({ min: 1, max: 15 }),
    ///
    bedrooms: faker_1.faker.number.int({ min: 1, max: 5 }),
    bathrooms: faker_1.faker.number.int({ min: 1, max: 5 }),
    wcs: faker_1.faker.number.int({ min: 1, max: 5 }),
    kitchens: faker_1.faker.number.int({ min: 1, max: 5 }),
    livingRooms: faker_1.faker.number.int({ min: 1, max: 5 }),
    ///
    parking: faker_1.faker.datatype.boolean(),
    elevator: faker_1.faker.datatype.boolean(),
    balcony: faker_1.faker.datatype.boolean(),
    yard: faker_1.faker.datatype.boolean(),
    basement: faker_1.faker.datatype.boolean(),
    ///
    description: faker_1.faker.lorem.paragraph({
      min: 3,
      max: 6,
    }),
    mkdDescription:
      faker_1.faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Macedonian",
    albDescription:
      faker_1.faker.lorem.paragraph({
        min: 3,
        max: 6,
      }) + " in Albanian",
    ///
    mainImage: images[0],
    images: images,
    videoLink: "https://www.youtube.com/watch?v=R8OejFuUYqo",
    ///
    isArchived: false,
    isPublished: true,
    publishedAt: new Date(),
    publishEndDate: new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    ),
    //
    tags: [],
    isPaidPromo: false,
    ///
    contactData: JSON.stringify(contactData),
  });
}
exports.agencyListings = aL;
