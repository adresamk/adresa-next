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
    <div className="flex flex-col gap-2 p-2 sm:flex-row">
      <ListingNewSideMenu steps={initialSteps} />
      <div className="p-2 sm:min-w-[460px] sm:p-0">{children}</div>
    </div>
  );
}
