import { redirect } from "@/i18n/routing";
import { getCurrentSession } from "@/lib/sessions";
import { steps } from "./[step]/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Уредување на оглас | Adresa.mk",
    template: "%s | Adresa.mk",
  },
  description: "Уредување на оглас за Adresa.mk",
};

export default async function EditListingWithoutStep({
  params,
}: {
  params: Promise<{ listingNumber: string; locale: string }>;
}) {
  const { listingNumber, locale } = await params;

  if (isNaN(Number(listingNumber))) {
    redirect({ href: "/", locale });
  }

  const { session } = await getCurrentSession();
  if (!session) {
    redirect({ href: "/", locale });
  }

  redirect({
    href: `/listing/edit/${listingNumber}/${steps[0].uniquePath}`,
    locale,
  });
  // return null

  return <div>Edit Listing, btw you should not be here</div>;
}
