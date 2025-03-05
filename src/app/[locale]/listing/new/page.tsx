import InitialStep from "./InitialStep";

import { createNewListing } from "@/server/actions/listing.actions";
import { getTranslations } from "next-intl/server";
import { SubmitButton } from "@/components/SubmitButton";
import { Metadata } from "next";
// export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
// we know that the form is static, so we don't need to revalidate it
export const revalidate = false;

export const metadata: Metadata = {
  title: {
    default: "Нов оглас | Adresa.mk",
    template: "%s | Adresa.mk",
  },
  description: "Креирање на нов оглас за Adresa.mk",
};

export default async function NewListingPage() {
  const t = await getTranslations();

  return (
    <div className="mt-2 rounded bg-white p-2 shadow-md">
      <form
        action={async (formData: FormData) => {
          "use server";
          const result = await createNewListing(formData);
          console.log(result);
          if (result && result.error) {
            // Handle error (e.g., show a notification)
          }
        }}
      >
        <InitialStep />
        <SubmitButton
          size={"sm"}
          className="my-2"
          defaultText={t("common.actions.start")}
          loadingText={t("common.actions.creating")}
        />
      </form>
    </div>
  );
}
