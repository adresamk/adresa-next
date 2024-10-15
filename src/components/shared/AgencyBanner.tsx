import Link from "next/link";
import { Button } from "../ui/button";
import { Agency } from "@prisma/client";
import { BrandingType } from "@/global/types";
export default function AgencyBanner({
  agency,
}: {
  agency?: Agency;
}) {
  const branding: BrandingType | null = agency?.branding
    ? JSON.parse(agency.branding)
    : null;

  const primaryBgColor = branding
    ? `bg-[${branding.primary}]`
    : "bg-brand-dark-blue";
  return (
    <aside
      className={`flex justify-between items-center px-5 py-1 z-40 h-[80px]  text-white  ${primaryBgColor}`}
    >
      <div className="flex gap-2 ">
        <div className="px-3 py-2 bg-white w-[100px] h-[60px] flex items-center justify-center rounded">
          <img
            src={agency?.logoUrl || ""}
            alt="Agency logo"
            width={55}
            height={42}
          />
        </div>
        <div>
          <p className="text-white/60">{agency?.shortDescription}</p>
          <p className="text-2xl font-bold">{agency?.name}</p>
        </div>
      </div>
      <Link href={`/agency/${agency?.slug}`}>
        <Button variant={"outline"} className={`${primaryBgColor}`}>
          Contact
        </Button>
      </Link>
    </aside>
  );
}
