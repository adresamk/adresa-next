import Link from "next/link";
import { Button } from "../ui/button";

export default function AgencyBanner({ agency }: { agency?: any }) {
  return (
    <aside
      className={`flex justify-between items-center px-5 py-1 z-40 h-[80px]  text-white  bg-[${agency?.branding.primary}]`}
    >
      <div className="flex gap-2 ">
        <div className="px-3 py-2 bg-white w-[100px] h-[60px] flex items-center justify-center rounded">
          <img
            src="/assets/agency-logo.png"
            alt="Agencyt logo"
            width={55}
            height={42}
          />
        </div>
        <div>
          <p className="text-white/60">{agency.shortDescription}</p>
          <p className="text-2xl font-bold">{agency.name}</p>
        </div>
      </div>
      <Link href={`/agency/${agency.slug}`}>
        <Button
          variant={"outline"}
          className={`bg-[${agency?.branding.primary}}]`}
        >
          Contact
        </Button>
      </Link>
    </aside>
  );
}
