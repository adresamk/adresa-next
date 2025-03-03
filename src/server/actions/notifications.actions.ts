"use server";

import { Listing, SavedSearch, User } from "@prisma/client";
import prismadb from "@/lib/db";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import { render } from "@react-email/render";
import NewListingsThatMatchesNotification from "../../../emails/newListingsThatMatchesNotification";
import { ListingWithRelations } from "@/types/listing.types";
function isMatchingSearch(savedSearch: SavedSearch, listing: Listing) {
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
  try {
    const savedSearches = await prismadb.savedSearch.findMany({
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
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
    console.log("Found Saved Searches");
    console.log(savedSearches.slice(0, 2));
  } catch (error) {
    console.error(
      "Error fetching saved searches:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  return;

  //   // Check if the listing matches the saved search
  //   const matchingSearches = savedSearches.filter((ss) => {
  //     return isMatchingSearch(ss, listing);
  //   });

  //   // The matching saved searches group them by user.id
  //   const userSearchMap = new Map<
  //     string,
  //     { user: User; searches: SavedSearch[] }
  //   >();

  //   for (const search of matchingSearches) {
  //     if (!userSearchMap.has(search.userId)) {
  //       userSearchMap.set(search.userId, { user: search.user, searches: [] });
  //     }
  //     userSearchMap.get(search.userId)!.searches.push(search);
  //   }

  //   // Send emails in batches with a delay to avoid spam
  //   const users = Array.from(userSearchMap.values());
  //   for (let i = 0; i < users.length; i++) {
  //     const { user, searches } = users[i];

  //     const fromEmail =
  //       process.env.NEXT_PUBLIC_URL === "http://localhost:3000"
  //         ? "onboarding@resend.dev>"
  //         : "no-reply@adresa.mk";

  //     const toEmail =
  //       process.env.NEXT_PUBLIC_URL === "http://localhost:3000"
  //         ? "macesmajli@gmail.com"
  //         : user.email;

  //     const { data, error } = await resend.emails.send({
  //       from: `Adresa <${fromEmail}>`,
  //       to: [toEmail],
  //       subject: "New Listing Matches Your Saved Search",
  //       html: await render(NewListingsThatMatchesNotification({ listing })),
  //     });

  //     // Introduce delay (1000ms = 1s per email)
  //     if (i < users.length - 1) await wait(1000);
  //   }
}
