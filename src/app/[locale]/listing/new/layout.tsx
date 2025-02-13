import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/sessions";
import { getLocale } from "next-intl/server";
import { Params } from "next/dist/server/request/params";
import ListingNewSideMenu from "./_components/ListingNewSideMenu";
import { initialSteps } from "../edit/[listingNumber]/[step]/types";

interface NewListingLayoutProps {}
export default async function NewListingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { account } = await getCurrentUser();
  if (!account) {
    redirect({
      href: "/signin?redirect=/listing/new",
      locale: locale,
    });
  }
  return (
    <div className="flex gap-2 p-2">
      <ListingNewSideMenu steps={initialSteps} />
      <div className="min-w-[460px]">{children}</div>
    </div>
  );
}
