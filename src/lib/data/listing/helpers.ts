import { ListingWithUserAndAgency } from "@/lib/types";
import { Agency, Listing } from "@prisma/client";

import { User } from "@prisma/client";

export function getContactData(listing: ListingWithUserAndAgency) {
  const agency = listing.agency;
  const user = listing.user;

  if (!agency && !user) {
    return {
      name: "",
      phone: "",
      email: "",
    };
  }

  const dataObj = {
    name: agency?.contactPersonFullName || user?.contactName || "",
    phone: agency?.contactPersonPhone || user?.contactPhone || "",
    email: agency?.contactPersonEmail || user?.contactEmail || "",
  };

  return dataObj;
}
