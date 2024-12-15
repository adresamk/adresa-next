import RevealButton from "@/components/shared/RevealButton";
import { Link } from "@/i18n/routing";
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
    return (
      <div className="flex flex-row-reverse justify-end gap-4">
        {agency.logoUrl && (
          <Link href={`/agency/${agency.slug}`}>
            <div className="flex max-h-[130px] max-w-[200px] items-center justify-center rounded-xl px-8 py-4">
              <Image
                src={agency.logoUrl}
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
                {agency.contactPersonFullName}
              </p>
            </Link>
            <p className="mb-1.5 leading-4">{agency.address}</p>
          </div>
          <div className="mt-10">
            <p className="text-sm">
              {t("common.property.publisherDetails.workHours")}
            </p>
            <p className="mb-3">{agency.workHours}</p>
            <p className="text-sm">
              {t("common.property.publisherDetails.preferredContactMethod")}
            </p>
            <p>{agency.preferredContactMethod}</p>
            <div>
              <RevealButton
                usecase="phone"
                value={agency.contactPersonPhone}
                variant="outline"
              />{" "}
              <br />
              <RevealButton
                usecase="website"
                value={agency.website}
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (user) {
    return (
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
            <p>{user.preferredContactMethod}</p>
            <RevealButton
              usecase="phone"
              value={user.contactPhone}
              variant="outline"
            />
          </div>
        </div>
      </div>
    );
  }

  return <div>No publisher found</div>;
}
