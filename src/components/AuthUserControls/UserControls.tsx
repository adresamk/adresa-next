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
import {
  BookmarkIcon,
  ContactIcon,
  HeartIcon,
  HousePlusIcon,
  UserCircle2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function UserControls({ user }: { user: User }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    console.log("staging only");
  }, [pathname]);

  const avatarImg = user
    ? user.pictureUrl
      ? user.pictureUrl
      : user.firstName && user.lastName
        ? userProfileBg.src
        : undefined
    : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={avatarImg} />
          <AvatarFallback>
            {user && user.firstName && user.lastName ? (
              <span>
                {user.firstName![0].toUpperCase()}
                {user.lastName![0].toUpperCase()}
              </span>
            ) : null}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="z-[220] p-3">
        <ul className="flex flex-col gap-2">
          <Link href={`/profile/info`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <UserCircle2Icon className="h-5 w-5" />{" "}
              {t("user.profile.menu.profile")}
            </li>
          </Link>

          <Link href={`/profile/contact`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <ContactIcon className="h-5 w-5" />{" "}
              {t("user.profile.menu.contactInfo")}
            </li>
          </Link>

          <Link href={`/profile/listings`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <HousePlusIcon className="h-5 w-5" />{" "}
              {t("user.profile.menu.myListings")}
            </li>
          </Link>

          <Link href={`/profile/searches`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <BookmarkIcon className="h-5 w-5" />{" "}
              {t("user.profile.menu.savedSearches")}
            </li>
          </Link>
          <Link href={`/profile/liked`} prefetch>
            <li className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2 py-1 text-center hover:bg-gray-100 md:h-10">
              <HeartIcon className="h-5 w-5" />{" "}
              {t("user.profile.menu.likedListings")}
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
