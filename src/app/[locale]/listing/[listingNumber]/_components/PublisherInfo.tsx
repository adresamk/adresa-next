import RevealButton from "@/components/shared/RevealButton";
import { Link } from "@/i18n/routing";
import { UploadedImageData } from "@/types/listing.types";
import { Agency, User } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface PublisherInfoProps {
  agency: Agency | null;
  user: User | null;
}
export default async function PublisherInfo({
  agency,
  user,
}: PublisherInfoProps) {
  const t = await getTranslations("");
  if (agency) {
    const logoUrl = (agency.logo as UploadedImageData)?.url || "";
    return (
      <>
        <div className="flex-col justify-end gap-4 sm:flex sm:flex-row-reverse">
          {logoUrl && (
            <Link href={`/agency/${agency.slug}`}>
              <div className="flex max-h-[130px] max-w-[200px] items-center justify-center rounded-xl px-8 py-4">
                <Image
                  src={logoUrl}
                  alt={`${agency.name || ""} logo`}
                  width={200}
                  height={130}
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          )}
          <div className="">
            <div>
              <h4 className="text-sm font-medium">
                {t("common.property.publisherDetails.agency")}
              </h4>
              <Link href={`/agency/${agency.slug}`}>
                <p className="my-2 mb-1.5 text-lg font-semibold leading-4 hover:underline">
                  {agency.name}
                </p>
              </Link>
              <p className="mb-1.5 leading-4">{agency.address}</p>
            </div>
            <div className="mt-10">
              <p className="text-sm text-slate-600">
                {t("common.property.publisherDetails.workHours")}
              </p>
              <p className="mb-3 whitespace-pre-line text-sm">
                {agency.workHours}
              </p>
              <p className="text-sm text-slate-600">
                {t("common.property.publisherDetails.preferredContactMethod")}
              </p>
              <p className="text-sm">
                {t(
                  `agency.profile.details.${agency.preferredContactMethod || "both"}`,
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RevealButton
            usecase="phone"
            value={agency.contactPersonPhone}
            variant="outline"
          />{" "}
          <RevealButton
            usecase="website"
            value={agency.website}
            variant="outline"
          />
        </div>
      </>
    );
  }
  if (user) {
    return (
      <>
        <div className="flex gap-2">
          <div className="flex-1">
            <div>
              <h4 className="text-lg font-medium">
                {t("common.property.publisherDetails.title")}
              </h4>
              <p className="mb-1.5 leading-4">{user.contactName}</p>
            </div>
            <div className="mt-10">
              <p>{t("common.property.publisherDetails.contactHoursUser")}</p>
              <p>{user.contactHours}</p>
              <p>
                {t("common.property.publisherDetails.preferredContactMethod")}
              </p>
              <p className="text-sm">
                {t(
                  `agency.profile.details.${user.preferredContactMethod || "both"}`,
                )}
              </p>
            </div>
          </div>
        </div>
        <div>
          <RevealButton
            usecase="phone"
            value={user.contactPhone}
            variant="outline"
          />
        </div>
      </>
    );
  }

  return <div>No publisher found</div>;
}
