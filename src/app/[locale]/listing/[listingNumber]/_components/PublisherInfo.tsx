import RevealButton from "@/components/shared/RevealButton";
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
      <div className="flex gap-2">
        {agency.logoUrl && (
          <div className="flex max-h-[130px] max-w-[200px] items-center justify-center rounded-xl border border-slate-400 bg-slate-100 px-8 py-4">
            <Image
              src={agency.logoUrl}
              alt={`${agency.name || ""} logo`}
              width={200}
              height={130}
              className="h-auto w-auto object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <div>
            <h4 className="text-lg font-medium">
              {t("common.property.publisherDetails.title")}
            </h4>
            <p className="mb-1.5 leading-4">{agency.name}</p>
            <p className="mb-1.5 leading-4">{agency.address}</p>
          </div>
          <div className="mt-10">
            <p>{t("common.property.publisherDetails.workHours")}</p>
            <p>{agency.workHours}</p>
            <RevealButton
              usecase="phone"
              value={agency.phone}
              variant="outline"
            />
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
            <p className="mb-1.5 leading-4">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="mt-10">
            <p>{t("common.property.publisherDetails.workHours")}</p>
            {/* <p>{user.workHours}</p> */}
            <RevealButton
              usecase="phone"
              value={user.phone}
              variant="outline"
            />
          </div>
        </div>
      </div>
    );
  }

  return <div>No publisher found</div>;
}
