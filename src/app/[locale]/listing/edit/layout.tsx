import { redirect } from "@/i18n/routing";
import { getCurrentSession } from "@/lib/sessions";
import { steps } from "./[listingNumber]/[step]/types";
import { Metadata } from "next";

interface EditListingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: {
    default: "Уредување на оглас | Adresa.mk",
    template: "%s | Adresa.mk",
  },
  description: "Уредување на оглас за Adresa.mk",
};
export default async function EditListingLayout({
  children,
  params,
}: EditListingLayoutProps) {
  const { locale } = await params;

  const { session } = await getCurrentSession();
  if (!session) {
    redirect({ href: "/", locale });
  }

  return <div>{children}</div>;
}
