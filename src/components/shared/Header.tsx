import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguagePicker from "@/components/LanguagePicker";
import userProfileBg from "@/assets/user-profile-bg.svg";
import adresaLogo from "@/assets/adresa-logo.png";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">
          <img src={adresaLogo.src} alt="Adresa Homepage" />
        </Link>
        <Link href="/search"> Sale </Link>
        <Link href="/search"> Rent </Link>
      </nav>

      <nav>
        <Link href="/">
          <Button>Create Listing</Button>
        </Link>
        <LanguagePicker />
        <Link href="/profile">
          <img src={userProfileBg.src} alt="Profile" />
        </Link>
      </nav>
    </header>
  );
}
