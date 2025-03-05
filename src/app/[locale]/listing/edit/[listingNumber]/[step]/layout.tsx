import { redirect } from "@/i18n/routing";
import { Step, steps } from "./types";
import { getCurrentUser } from "@/lib/sessions";
import NoAccessRedirectMessage from "./_components/NoAccessRedirectMessage";
import { ListingWithRelations } from "@/types/listing.types";
import prismadb from "@/lib/db";

interface EditListingLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    listingNumber: string;
    step: string;
    locale: string;
  }>;
}
export default async function EditListingLayout({
  children,
  params,
}: EditListingLayoutProps) {
  const { listingNumber, step, locale } = await params;

  if (isNaN(Number(listingNumber))) {
    redirect({ href: "/", locale });
  }
  const listing: ListingWithRelations | null =
    await prismadb.listing.findUnique({
      where: {
        listingNumber: Number(listingNumber),
      },
      include: {
        agency: true,
        user: true,
        commercial: true,
        residential: true,
        land: true,
        other: true,
        listingFeatures: {
          include: {
            feature: true,
          },
        },
        favoritedBy: true,
        professionalPromotion: true,
      },
    });

  if (!listing) {
    redirect({ href: "/404", locale: locale });
    return <div>Listing not found</div>;
  }
  const stepExists = steps.find((s: Step) => s.uniquePath === step);
  if (!stepExists) {
    redirect({
      href: `/listing/edit/${listingNumber}/${steps[0].uniquePath}`,
      locale: locale,
    });
  }
  const { user, agency } = await getCurrentUser();

  // Total mismatch
  if (listing?.agencyId && user) {
    return <NoAccessRedirectMessage />;
  }
  if (listing?.userId && agency) {
    return <NoAccessRedirectMessage />;
  }
  // Correct User Type but not his listing
  if (listing?.agencyId && agency?.id !== listing.agencyId) {
    return <NoAccessRedirectMessage />;
  }
  // Correct User Type but not his listing
  if (listing?.userId && user?.id !== listing.userId) {
    return <NoAccessRedirectMessage />;
  }
  //   redirect({
  //     href: `/listing/edit/${listingNumber}/${steps[0].uniquePath}`,
  //     locale,
  //   });

  return <>{children}</>;
}
