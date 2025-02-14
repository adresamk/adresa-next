import { redirect } from "@/i18n/routing";
import ListingEditForm from "./ListingEditForm";
import { steps } from "./types";
import { ListingWithRelations } from "@/types/listing.types";
import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import {
  getListingWithRelations,
  getStaticCategoryFeatures,
} from "@/server/gets/everything";

type Params = Promise<{ listingNumber: string; step: string }>;
export const metadata: Metadata = {
  title: {
    default: "Уредување на оглас | Adresa.mk",
    template: "%s | Adresa.mk",
  },
  description: "Уредување на оглас за Adresa.mk",
};
export async function generateStaticParams() {
  const locales = ["mk", "al", "en"]; // Your supported locales

  return locales.flatMap((locale) =>
    steps.map((step) => ({
      locale,
      step: step.uniquePath,
      // Note: listingNumber remains dynamic and shouldn't be included here
    })),
  );
}
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export default async function EditListingPage({ params }: { params: Params }) {
  const { listingNumber, step: requestedStep } = await params;

  const locale = await getLocale();

  const listing: ListingWithRelations | null = await getListingWithRelations(
    Number(listingNumber),
  );

  if (!listing) {
    redirect({ href: "/404", locale });
    return;
  }

  const allCategoryFeatures = await getStaticCategoryFeatures(listing.category);
  return (
    <div className="flex gap-2 p-2">
      <ListingEditForm
        loadedListing={listing}
        requestedStep={requestedStep}
        allCategoryFeatures={allCategoryFeatures}
      />
    </div>
  );
}
