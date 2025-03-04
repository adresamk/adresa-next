import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";
import { Agency } from "@prisma/client";
import { BrandingType } from "@/global/types";
import { UploadedImageData } from "@/types/listing.types";
import { getTranslations } from "next-intl/server";
export default async function AgencyBanner({ agency }: { agency?: Agency }) {
  const branding: BrandingType | null = agency?.branding
    ? JSON.parse(agency.branding)
    : null;

  const primaryBgColor = branding
    ? `bg-[${branding.primary}]`
    : "bg-brand-darker-blue";
  const logoUrl =
    (agency?.logo as UploadedImageData)?.url || "/assets/missing-image2.jpg";
  const t = await getTranslations();
  return (
    <aside
      className={`z-40 flex h-[80px] items-center justify-between px-5 py-1 text-white ${primaryBgColor}`}
    >
      <div className="flex gap-2">
        <div className="flex h-[60px] w-[100px] items-center justify-center rounded bg-white px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Agency logo" width={55} height={42} />
        </div>
        <div>
          <p className="text-white/60">{t("agency.realEstateAgency")}</p>
          <p className="text-2xl font-bold">{agency?.name}</p>
        </div>
      </div>
      <Link href={`/agency/${agency?.slug}`}>
        <Button variant={"outline"} className={`${primaryBgColor}`}>
          {t("common.actions.contact")}
        </Button>
      </Link>
    </aside>
  );
}
