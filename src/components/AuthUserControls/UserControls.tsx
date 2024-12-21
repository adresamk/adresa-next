"use client";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { User, Agency } from "@prisma/client";
import userProfileBg from "@/assets/user-profile-bg.svg";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LogoutButton from "./LogoutButton";
export default function UserControls({
  user,
  agency,
}: {
  user?: User;
  agency?: Agency;
}) {
  const router = useRouter();
  const t = useTranslations();

  const avatarImg = user
    ? user.pictureUrl
      ? user.pictureUrl
      : user.firstName && user.lastName
        ? userProfileBg.src
        : undefined
    : undefined;

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={avatarImg} />
          <AvatarFallback>
            {agency && !user && "AG"}
            {!agency && user && user.firstName && user.lastName ? (
              user ? (
                <span>
                  {user.firstName![0].toUpperCase()}
                  {user.lastName![0].toUpperCase()}
                </span>
              ) : null
            ) : user ? (
              "RND"
            ) : null}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="z-[220] p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href={`/${agency ? "agency/profile" : "profile"}/info`}>
              {t("header.userControls.profile")}
            </Link>
          </li>
          {/* <li>
              <Link href="/profile/settings">Settings</Link>
            </li> */}
          <li>
            <LogoutButton></LogoutButton>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
