"use server";

import { Account, Listing, SavedSearch, User } from "@prisma/client";
import prismadb from "@/lib/db";
import {
  CreateEmailResponse,
  CreateEmailResponseSuccess,
  Resend,
} from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import { render } from "@react-email/render";
import NewListingsThatMatchesNotification from "../../../emails/newListingsThatMatchesNotification";
import { ListingWithRelations } from "@/types/listing.types";
import { wait } from "@/lib/utils";
import {
  unpackOriginalSavedSearchParams,
  unpackSavedSearchParams,
} from "../specific-utils/notifications.utils";
import { getRegionsMunicipalitiesIds } from "@/lib/data/macedonia/importantData";

// First, let's define the types for the saved search result
type SavedSearchWithUser = {
  id: number;
  userId: number;
  name: string;
  img: string | null;
  isNotificationOn: boolean;
  notificationInterval: string; // adjust intervals as needed
  searchParams: string;
  createdAt: Date;
  updatedAt: Date;
  lastOpenedAt: Date;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    account: {
      email: string;
    };
  };
};

function isMatchingSearch(savedSearch: SavedSearch, listing: Listing) {
  console.log({
    type: listing.type,
    category: listing.category,
    price: listing.price,
    area: listing.area,
    municipality: listing.municipality,
    place: listing.place,
    transactionType: listing.transactionType,
  });
  const unpackedSearch = unpackOriginalSavedSearchParams(
    savedSearch.searchParams,
  );
  const sp = unpackedSearch;

  if (sp.category !== listing.category) {
    // console.log("category not matching");
    return false;
  }
  if (sp.transactionType !== listing.transactionType) {
    // console.log("transactionType not matching");
    return false;
  }
  if (sp.type !== listing.type) {
    // console.log("type not matching");
    // console.log("sp.type", sp.type);
    // console.log("listing.type", listing.type);
    return false;
  }

  let regions: string[] = [];
  regions = sp.location.filter((l: string) => l.startsWith("0"));
  let regionMunicipalities: string[] = [];
  if (regions.length > 0) {
    regionMunicipalities =
      regions.length > 0
        ? regions
            .map((r) => {
              return getRegionsMunicipalitiesIds(r);
            })
            .flat()
        : [];
    // console.log("regionMunicipalities", regionMunicipalities);
  }
  //   console.log("regionMunicipalities", regionMunicipalities);
  //   console.log("listing.municipality", listing.municipality);
  //   console.log("listing.place", listing.place);
  //   console.log("sp.location", sp.location);

  const locationMatches = sp.location.some(
    (location: string) =>
      (listing.place && location.includes(listing.place)) ||
      (listing.municipality && location.includes(listing.municipality)) ||
      (listing.municipality &&
        regionMunicipalities.includes(listing.municipality)),
  );

  if (!locationMatches) {
    // console.log("location not matching");
    return false;
  }

  if (listing.price && sp.priceLow > listing.price) {
    // console.log("price not matching");
    return false;
  }
  if (listing.price && sp.priceHigh < listing.price) {
    // console.log("price not matching");
    return false;
  }
  if (listing.area && sp.areaLow > listing.area) {
    // console.log("area not matching");
    return false;
  }
  if (listing.area && sp.areaHigh < listing.area) {
    // console.log("area not matching");
    return false;
  }

  return true;
}

export async function notifyConcernedUsersAboutNewListing(
  listing: ListingWithRelations,
) {
  // Fetch listing details
  //   const listing = await prismadb.listing.findUnique({
  //     where: { id: listingId },
  //     include: {
  //       user: true,
  //       agency: true,
  //       land: true,
  //       residential: true,
  //       commercial: true,
  //       other: true,
  //       listingFeatures: true,
  //     }, // Fetch owner details if needed
  //   });

  console.log("listing for notifying", listing.id);

  if (!listing) return;

  // Fetch all saved searches
  let savedSearches: SavedSearchWithUser[] = [];
  try {
    savedSearches = await prismadb.savedSearch.findMany({
      where: {
        isNotificationOn: true,
        notificationInterval: "live",
        userId: listing.userId ? { not: listing.userId } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            account: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    console.log("Found Saved Searches");
    // console.log(savedSearches.slice(0, 2));
    // console.log(savedSearches.slice(0, 2).map((ss) => ss.user.account));
  } catch (error) {
    console.error(
      "Error fetching saved searches:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  //   return;

  // Check if the listing matches the saved search
  const matchingSearches = savedSearches.filter((ss) => {
    return isMatchingSearch(ss, listing);
  });

  // The matching saved searches group them by user.id
  const userSearchMap = new Map<
    string,
    { user: Partial<User>; searches: SavedSearchWithUser[] }
  >();

  for (const search of matchingSearches) {
    if (!userSearchMap.has(search.user.id.toString())) {
      userSearchMap.set(search.user.id.toString(), {
        user: search.user,
        searches: [],
      });
    }
    userSearchMap.get(search.user.id.toString())!.searches.push(search);
  }

  console.log("userSearchMap", userSearchMap);
  // Send emails in batches with a delay to avoid spam
  const users = Array.from(userSearchMap.values());
  for (let i = 0; i < users.length; i++) {
    const { user, searches } = users[i];
    console.log("user", user);
    const fromEmail =
      process.env.NEXT_PUBLIC_URL === "http://localhost:3000"
        ? "onboarding@resend.dev"
        : "no-reply@adresa.mk";

    const toEmail =
      process.env.NEXT_PUBLIC_URL === "http://localhost:3000"
        ? "macesmajli@gmail.com"
        : searches[0].user.account.email;

    console.log("fromEmail", fromEmail);
    console.log("toEmail", toEmail);

    try {
      const { data, error } = await resend.emails.send({
        from: `Adresa <${fromEmail}>`,
        to: [toEmail],
        subject: "New Listing Matches Your Saved Search",
        html: await render(
          NewListingsThatMatchesNotification({
            listing,
            matchedSearches: searches,
            user: user as Partial<User> & { account: Partial<Account> },
          }),
        ),
      });

      console.log("Data from resend", data);
      console.log("Error from resend", error);
      if (data as CreateEmailResponseSuccess) {
        console.log("Email sent successfully", data?.id);
      } else {
        console.error("Error sending email:", error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }

    // Introduce delay (1000ms = 1s per email)
    if (i < users.length - 1) await wait(1000);
  }
  return true;
}
