import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditListingWithoutStep({
  params,
}: {
  params: Promise<{ listingNumber: string }>;
}) {
  const { listingNumber } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;
  console.log("locale", locale);
  redirect(
    `/${locale || routing.defaultLocale}/listing/edit/${listingNumber}/category`,
  );
}
