import { Listing } from "./types";

export const listings: Listing[] = [
  {
    id: "id1",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: 55000,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    agency: {
      logo: "/assets/agency-logo.png",
      slug: "slug",
    },
    features: {
      bathroom: 2,
      ac: 1,
      garage: 1,
    },
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: true,
    isPaidPromo: true,
  },
  {
    id: "id2",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: null,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    user: {
      logo: "/assets/agency-logo.png",
      id: "someid",
    },
    features: {},
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da sekoristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: false,
    isPaidPromo: false,
  },
  {
    id: "id3",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: 55000,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    agency: {
      logo: "/assets/agency-logo.png",
      slug: "slug",
    },
    features: {},
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: false,
    isPaidPromo: false,
  },
  // come up with 5 more listings
  {
    id: "id4",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: 55000,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    agency: {
      logo: "/assets/agency-logo.png",
      slug: "slug",
    },
    features: {},
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: false,
    isPaidPromo: false,
  },
  {
    id: "id5",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: 55000,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    agency: {
      logo: "/assets/agency-logo.png",
      slug: "slug",
    },
    features: {},
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: false,
    isPaidPromo: false,
  },
];

export const agencyExample = {
  name: "Agency Martin",
  logo: "/assets/agency-logo.png",
  slug: "agency-martin",
  location: "Скопје, ул. Партизански одреди бр.42 3/5",
  branding: {
    primary: "#1C2D45",
  },
  contactPerson: "Stole stolevski",
  workHours: "Пон - Петок 09:00 - 17:00",
  mapLocation: "",
  description:
    "Ние сме водечка агенција за недвижнини која нуди професионални услуги во купување, продавање и изнајмување на имоти. Со нашиот тим од искусни агенти, Ви обезбедуваме целосна поддршка и насоки низ целиот процес. Посветени сме на прецизно исполнување на Вашите желби и потреби, обезбедувајќи сигурни и транспарентни трансакции. Нашето портфолио вклучува широк спектар на резиденцијални и комерцијални објекти, прилагодени на секој буџет и стил. Дозволете ни да Ви помогнеме да го најдете идеалниот дом или инвестиција.",
  shortDescription: "agencija za nedviznosti",
  selling: [
    {
      type: "apartment",
    },
    {
      type: "business",
    },
  ],
  renting: [
    {
      type: "object-building",
    },
    {
      type: "object-key",
    },
  ],
  listings: [{}, {}],
  properties: [
    {
      id: 1,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "sale",
      tags: ["new", "featured"],
      location: "Skope, Centar",
      liked: true,
    },
    {
      id: 2,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "rent",
      tags: ["new"],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 3,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,

      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 4,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 1_000,
      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 5,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 6,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
  ],
};
