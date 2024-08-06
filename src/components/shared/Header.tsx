import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguagePicker from "@/components/LanguagePicker";
import userProfileBg from "@/assets/user-profile-bg.svg";
import { HousePlus } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-2 shadow-lg">
      <nav className="flex items-center gap-6 text-brand-dark-blue">
        <Link href="/">
          <img
            src={"/assets/adresa-logo.png"}
            width={240}
            height={50}
            alt="Adresa Homepage"
          />
        </Link>
        <Link href="/search"> Sale </Link>
        <Link href="/search"> Rent </Link>
      </nav>

      <nav className="flex items-center gap-2">
        <Link href="/">
          <Button size={"sm"} className="px-2.5">
            <HousePlus className="mr-3" />{" "}
            <span className="font-bold uppercase tracking-wide">
              Create Listing
            </span>
          </Button>
        </Link>
        <LanguagePicker />

        <Link href="/profile">
          <Avatar>
            <AvatarImage src={userProfileBg.src} />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </header>
  );
}
