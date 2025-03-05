"use client";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { User, Agency } from "@prisma/client";
import userProfileBg from "@/assets/user-profile-bg.svg";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LogoutButton from "./LogoutButton";
import { Separator } from "../ui/separator";
import { UploadedImageData } from "@/types/listing.types";
import {
  HousePlusIcon,
  LayoutDashboardIcon,
  UserCircle2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AgencyControls({ agency }: { agency: Agency }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const avatarImg = (agency.logo as UploadedImageData)?.url
    ? (agency.logo as UploadedImageData).url
    : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={avatarImg} />
          <AvatarFallback>
            {agency.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="z-[220] p-3">
        <ul className="flex flex-col gap-2">
          <Link href={`/agency/profile/info`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <UserCircle2Icon className="h-5 w-5" />{" "}
              {t("agency.profile.menu.info")}
            </li>
          </Link>

          <Link href={`/agency/profile/details`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <LayoutDashboardIcon className="h-5 w-5" />{" "}
              {t("agency.profile.menu.details")}
            </li>
          </Link>

          <Link href={`/agency/profile/listings`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <HousePlusIcon className="h-5 w-5" />{" "}
              {t("agency.profile.menu.listings")}
            </li>
          </Link>

          {/* <li>
              <Link href="/profile/settings">Settings</Link>
            </li> */}
          <Separator />
          <li>
            <LogoutButton></LogoutButton>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
