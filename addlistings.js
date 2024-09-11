const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const listings2 = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef12345678901",
    createdAt: "2024-09-10T12:00:00Z",
    updatedAt: "2024-09-10T12:00:00Z",
    publishedAt: "2024-09-10T12:00:00Z",
    title: "Spacious 3-Bedroom Apartment in City Center",
    content:
      "Modern apartment with stunning city views, fully furnished. Ideal for families or professionals.",
    published: true,
    userId: "2caf9f48-9747-461b-a05f-6546a1066591",
    mainImage: "/assets/demo-property-bg.png",
    type: "Apartment",
    area: 120,
    price: 800,
    mode: "rent",
    tags: ["city center", "furnished", "balcony"],
    address: "Street Address, City",
    gpsLocation: "42.0000, 21.0000",
    description:
      "Enjoy the vibrant city life from this comfortable apartment.",
    isLiked: false,
    internalFeatures: [
      "air conditioning",
      "heating",
      "dishwasher",
      "washing machine",
    ],
    externalFeatures: ["parking", "elevator"],
    isPaidPromo: false,
    images: [
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
    ],
  },
  {
    id: "b2c3d4e5-f678-9012-abcd-ef12345678902",
    createdAt: "2024-09-11T08:30:00Z",
    updatedAt: "2024-09-11T08:30:00Z",
    publishedAt: "2024-09-11T08:30:00Z",
    title: "Charming 2-Bedroom Cottage in Peaceful Village",
    content:
      "Cozy cottage with a garden and fireplace, perfect for a relaxing getaway.",
    published: true,
    userId: "2caf9f48-9747-461b-a05f-6546a1066591",
    mainImage: "/assets/demo-property-bg.png",
    type: "House",
    area: 80,
    price: 500,
    mode: "sale",
    tags: ["village", "garden", "fireplace"],
    address: "Street Address, Village",
    gpsLocation: "41.0000, 22.0000",
    description:
      "Escape the city and enjoy the tranquility of nature.",
    isLiked: false,
    internalFeatures: ["kitchen", "bathroom", "heating"],
    externalFeatures: ["garden", "parking"],
    isPaidPromo: false,
    images: [
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
    ],
  },
  {
    id: "c3d4e5f6-7890-1234-abcd-ef12345678903",
    createdAt: "2024-09-12T10:00:00Z",
    updatedAt: "2024-09-12T10:00:00Z",
    publishedAt: "2024-09-12T10:00:00Z",
    title: "Modern 1-Bedroom Apartment Near Beach",
    content:
      "Bright and airy apartment with beach views, perfect for singles or couples.",
    published: true,
    userId: "2caf9f48-9747-461b-a05f-6546a1066591",
    mainImage: "/assets/demo-property-bg.png",
    type: "Apartment",
    area: 60,
    price: 650,
    mode: "rent",
    tags: ["beach", "modern", "sea view"],
    address: "Beachside Road, Coastal Town",
    gpsLocation: "40.0000, 20.0000",
    description:
      "Live just steps away from the beach in this stylish apartment.",
    isLiked: true,
    internalFeatures: ["air conditioning", "wifi"],
    externalFeatures: ["sea view", "parking"],
    isPaidPromo: true,
    images: [
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
    ],
  },
  {
    id: "d4e5f678-9012-3456-abcd-ef12345678940",
    createdAt: "2024-09-13T15:45:00Z",
    updatedAt: "2024-09-13T15:45:00Z",
    publishedAt: "2024-09-13T15:45:00Z",
    title: "Luxury 4-Bedroom Villa with Private Pool",
    content:
      "Stunning villa with modern amenities, private pool, and large garden.",
    published: true,
    userId: "2caf9f48-9747-461b-a05f-6546a1066591",
    mainImage: "/assets/demo-property-bg.png",
    type: "Villa",
    area: 250,
    price: 1500,
    mode: "sale",
    tags: ["luxury", "private pool", "garden"],
    address: "Country Lane, Suburbia",
    gpsLocation: "39.0000, 23.0000",
    description:
      "Experience luxury living with this exquisite villa.",
    isLiked: true,
    internalFeatures: ["air conditioning", "home theater", "gym"],
    externalFeatures: ["private pool", "garden", "garage"],
    isPaidPromo: true,
    images: [
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
    ],
  },
  {
    id: "e5f67890-1234-56578-abcd-ef1234567890",
    createdAt: "2024-09-14T11:20:00Z",
    updatedAt: "2024-09-14T11:20:00Z",
    publishedAt: "2024-09-14T11:20:00Z",
    title: "Quaint 3-Bedroom Home with Fireplace",
    content:
      "Charming home with a cozy fireplace and lovely backyard.",
    published: true,
    userId: "2caf9f48-9747-461b-a05f-6546a1066591",
    mainImage: "/assets/demo-property-bg.png",
    type: "House",
    area: 100,
    price: 700,
    mode: "rent",
    tags: ["fireplace", "backyard", "quaint"],
    address: "Maple Street, Old Town",
    gpsLocation: "38.0000, 24.0000",
    description: "Enjoy comfort and charm in this beautiful home.",
    isLiked: false,
    internalFeatures: ["fireplace", "heating"],
    externalFeatures: ["backyard", "parking"],
    isPaidPromo: false,
    images: [
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
    ],
  },
  {
    id: "f67890612-3456-7890-abcd-ef1234567890",
    createdAt: "2024-09-15T09:00:00Z",
    updatedAt: "2024-09-15T09:00:00Z",
    publishedAt: "2024-09-15T09:00:00Z",
    title: "Stylish Studio Apartment in Downtown",
    content:
      "Compact and stylish studio apartment with modern amenities.",
    published: true,
    userId: "2caf9f48-9747-461b-a05f-6546a1066591",
    mainImage: "/assets/demo-property-bg.png",
    type: "Apartment",
    area: 40,
    price: 400,
    mode: "rent",
    tags: ["downtown", "modern", "compact"],
    address: "Main Street, Downtown",
    gpsLocation: "37.0000, 25.0000",
    description: "Perfect for city living with all the essentials.",
    isLiked: true,
    internalFeatures: ["wifi", "air conditioning"],
    externalFeatures: ["city view"],
    isPaidPromo: false,
    images: [
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
      "/assets/demo-property-bg.png",
    ],
  },
];
async function AddListings() {
  for (const listing of listings2) {
    await prisma.listing.create({
      data: listing,
    });
  }
}

AddListings()
  .catch((e) => {
    console.log(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
