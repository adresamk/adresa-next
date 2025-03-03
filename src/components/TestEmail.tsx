import React from "react";
import ReactDOMServer from "react-dom/server";
import EmailTemplate from "../../emails/newListingsThatMatchesNotification";
import {
  Listing,
  ListingStatus,
  LocationPrecision,
  PropertyCategory,
  PropertyTransactionType,
  PropertyType,
  SavedSearch,
} from "@prisma/client";
import { UploadedImageData } from "@/types/listing.types";
const listingData = {
  id: "749",
  uuid: "b05ef98d-aad7-4c04-99d9-b348546e56b7",
  externalRef: null,
  listingNumber: "10749",
  createdAt: "2025-02-27 17:22:45.365",
  updatedAt: "2025-02-27 18:38:23.191",
  dateAvailable: "2025-02-27 17:22:45.365",
  isAvailable: true,
  userId: "28",
  agencyId: null,
  queryHash: "",
  transactionType: "sale",
  category: "residential",
  type: "apartment",
  municipality: "10016",
  place: "21601",
  address: "Ba",
  fullAddress: "10016, 21601, Ba",
  district: null,
  longitude: "21.434652",
  latitude: "41.991834",
  locationPrecision: "exact",
  enTitle: "",
  mkTitle: "Mojot oglas ",
  alTitle: "",
  enDescription: "",
  mkDescription: "Oglas na makedonski",
  alDescription: "",
  price: "550",
  previousPrice: null,
  priceHistory: null,
  area: "20",
  mainImage: {
    key: "RCUZyUk9CyhbUwqqdvGe2YmPGMV3K0SbfCIhiNcsklnTF4td",
    url: "https://utfs.io/f/RCUZyUk9CyhbUwqqdvGe2YmPGMV3K0SbfCIhiNcsklnTF4td",
    name: "IMG_5179.png",
    size: 1289985,
    type: "image/png",
    appUrl:
      "https://utfs.io/a/qn90x0r2nl/RCUZyUk9CyhbUwqqdvGe2YmPGMV3K0SbfCIhiNcsklnTF4td",
    customId: null,
    fileHash: "0ca4ab105277297a6b113dda3b635f55",
    lastModified: 1740616941000,
  },
  images: [
    {
      key: "RCUZyUk9CyhbUwqqdvGe2YmPGMV3K0SbfCIhiNcsklnTF4td",
      url: "https://utfs.io/f/RCUZyUk9CyhbUwqqdvGe2YmPGMV3K0SbfCIhiNcsklnTF4td",
      name: "IMG_5179.png",
      size: 1289985,
      type: "image/png",
      appUrl:
        "https://utfs.io/a/qn90x0r2nl/RCUZyUk9CyhbUwqqdvGe2YmPGMV3K0SbfCIhiNcsklnTF4td",
      customId: null,
      fileHash: "0ca4ab105277297a6b113dda3b635f55",
      lastModified: 1740616941000,
    },
    {
      key: "RCUZyUk9CyhbYXtpw2RUcXeHgwiAzyl6aIpLTEQmt27KhvO4",
      url: "https://utfs.io/f/RCUZyUk9CyhbYXtpw2RUcXeHgwiAzyl6aIpLTEQmt27KhvO4",
      name: "IMG_5101.jpeg",
      size: 2870544,
      type: "image/jpeg",
      appUrl:
        "https://utfs.io/a/qn90x0r2nl/RCUZyUk9CyhbYXtpw2RUcXeHgwiAzyl6aIpLTEQmt27KhvO4",
      customId: null,
      fileHash: "54351c3a638a1c33a7dbc2f97041471a",
      lastModified: 1740681448000,
    },
    {
      key: "RCUZyUk9CyhbRqO5H2k9CyhbMrXwV4dkTSiYsWfpQ370gRF5",
      url: "https://utfs.io/f/RCUZyUk9CyhbRqO5H2k9CyhbMrXwV4dkTSiYsWfpQ370gRF5",
      name: "IMG_5100.jpeg",
      size: 2298663,
      type: "image/jpeg",
      appUrl:
        "https://utfs.io/a/qn90x0r2nl/RCUZyUk9CyhbRqO5H2k9CyhbMrXwV4dkTSiYsWfpQ370gRF5",
      customId: null,
      fileHash: "939af688204d4d450ff10c74757d94d3",
      lastModified: 1740681448000,
    },
    {
      key: "RCUZyUk9CyhbGwjr646d39MHwYu1g5EPBcarRObS8VynzvTi",
      url: "https://utfs.io/f/RCUZyUk9CyhbGwjr646d39MHwYu1g5EPBcarRObS8VynzvTi",
      name: "A381AA38-AB17-461F-95D8-A71F637D24E8.jpeg",
      size: 946041,
      type: "image/jpeg",
      appUrl:
        "https://utfs.io/a/qn90x0r2nl/RCUZyUk9CyhbGwjr646d39MHwYu1g5EPBcarRObS8VynzvTi",
      customId: null,
      fileHash: "caab3db084d63e622b3b750bfc13180e",
      lastModified: 1740271390000,
    },
  ],
  videoLink: "",
  status: "DRAFT",
  isArchived: false,
  isPaidPromo: false,
  isPublished: false,
  publishedAt: null,
  publishEndDate: null,
  viewCountId: null,
  professionalPromotionId: null,
  substatus: null,
};
const savedSearchData: SavedSearch = {
  id: 23,
  userId: 23,
  name: "Nekogas",
  img: "/assets/region-map-preview.png",
  isNotificationOn: false,
  notificationInterval: "weekly",
  searchParams: "/search/tt-sale/l-10010/c-land/s-new",
  createdAt: new Date("2025-02-27 17:19:30.005"),
  updatedAt: new Date("2025-02-27 17:20:26.585"),
  lastOpenedAt: new Date("2025-02-27 17:19:30.005"),
};

// console.log(savedSearchData);

// console.log(listingData);

const typedListingData: Listing = {
  ...listingData,
  id: parseInt(listingData.id),
  listingNumber: parseInt(listingData.listingNumber),
  userId: parseInt(listingData.userId),
  createdAt: new Date(listingData.createdAt),
  updatedAt: new Date(listingData.updatedAt),
  dateAvailable: new Date(listingData.dateAvailable),
  transactionType: listingData.transactionType as PropertyTransactionType,
  category: listingData.category as PropertyCategory,
  type: listingData.type as PropertyType,
  status: listingData.status as ListingStatus,
  longitude: parseFloat(listingData.longitude),
  latitude: parseFloat(listingData.latitude),
  locationPrecision: listingData.locationPrecision as LocationPrecision,
  price: parseInt(listingData.price),
  area: parseInt(listingData.area),
  mainImage: listingData.mainImage as UploadedImageData,
  images: listingData.images as UploadedImageData[],
  videoLink: listingData.videoLink as string,
  substatus: listingData.substatus || "",
  externalRef: listingData.externalRef || "",
  queryHash: listingData.queryHash || "",
  isArchived: listingData.isArchived || false,
  isPaidPromo: listingData.isPaidPromo || false,
  isPublished: listingData.isPublished as boolean,
  publishedAt: listingData.publishedAt as Date | null,
  publishEndDate: listingData.publishEndDate as Date | null,
  viewCountId: listingData.viewCountId as number | null,
  professionalPromotionId: listingData.professionalPromotionId as number | null,
};

// const emailHTML = ReactDOMServer.renderToStaticMarkup(
//   <EmailTemplate
//     listing={typedListingData}
//     matchedSearches={[savedSearchData]}
//     user={user}
//   />,
// );
const emailHTML = "";
export default function TestEmail() {
  return <div>{emailHTML}</div>;
}
// Output for preview (you can use this emailHTML in your email sending service or display it in the editor)
console.log(emailHTML);
