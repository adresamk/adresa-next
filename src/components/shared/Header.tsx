import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguagePicker from "@/components/LanguagePicker";
import { HousePlus } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import AuthUserControls from "../AuthUserControls/AuthUserControls";
import { createListing } from "@/actions/listings";

export default function Header() {
  return (
    <header className=" overflow-hidden h-[80px] bg-white flex items-center justify-between px-5 py-2 shadow-lg fixed top-0 left-0 right-0 z-[100]">
      <nav className="flex items-center gap-6 text-brand-dark-blue">
        <Link href="/">
          <img
            src={"/assets/adresa-logo.png"}
            width={240}
            height={50}
            alt="Adresa Homepage"
          />
        </Link>
      </nav>

      <nav className="flex items-center gap-2">
        {/* <Link href="/listing/new"> */}
        <form action={createListing}>
          <Button size={"sm"} className="px-2.5">
            <HousePlus className="mr-3" />{" "}
            <span className="font-bold uppercase tracking-wide">
              Create Listing
            </span>
          </Button>
        </form>
        {/* </Link> */}
        <LanguagePicker />

        <AuthUserControls />
      </nav>
    </header>
  );
}
