import { ListingContactData, SerializedListing } from "@/lib/types";

export function extractPublisherData(listing: SerializedListing) {
  const contactData: ListingContactData = JSON.parse(
    listing?.contactData || "{}",
  );
  const publisherData = {
    imgUrl: "",
    name: "",
    address: "",
    shortDescription: "",
    phone: "",
    workHours: "",
  };
  if (listing.owner.agency) {
    publisherData.imgUrl = listing.owner.agency.logoUrl || "";
    publisherData.name = listing.owner.agency.name || "";
    publisherData.address = listing.owner.agency.address || "";
    publisherData.shortDescription =
      listing.owner.agency.shortDescription || "";
    publisherData.phone = listing.owner.agency.phone || "";
    publisherData.workHours = listing.owner.agency.workHours || "";
  } else {
    publisherData.imgUrl = "";
    publisherData.name = contactData.firstName + " " + contactData.lastName;
    publisherData.address = "";
    publisherData.shortDescription = "";
    publisherData.phone = contactData.phone || "";
    publisherData.workHours = contactData.contactHours || "";
  }

  return publisherData;
}
