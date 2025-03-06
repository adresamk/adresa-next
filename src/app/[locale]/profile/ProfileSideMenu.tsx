"use client";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Contact,
  Heart,
  HousePlus,
  Info,
  UserIcon,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileSideMenu({ user }: { user: User | null }) {
  const pathname = usePathname();
  const t = useTranslations();

  const missingProfile = !user?.firstName || !user?.lastName;
  const missingContact =
    !user?.contactName || !user?.contactPhone || !user?.contactEmail;

  const profileNavigation = [
    {
      label: t("user.profile.menu.profile"),
      icon: <UserIcon className="h-4 w-4" />,
      path: "/profile/info",
      issues: missingProfile,
    },
    {
      label: t("user.profile.menu.contactInfo"),
      icon: <Contact className="h-4 w-4" />,
      path: "/profile/contact",
      issues: missingContact,
    },
    {
      label: t("user.profile.menu.myListings"),
      icon: <HousePlus className="h-4 w-4" />,
      path: "/profile/listings",
    },
    {
      label: t("user.profile.menu.savedSearches"),
      icon: <Bookmark className="h-4 w-4" />,
      path: "/profile/searches",
    },
    {
      label: t("user.profile.menu.likedListings"),
      icon: <Heart className="h-4 w-4" />,
      path: "/profile/liked",
    },
  ];

  return (
    <nav>
      {/* Mobile View */}
      <div className="sm:hidden">
        <ul>
          {/* Show current path item or first item */}
          {profileNavigation
            .filter(
              (nav) =>
                nav.path === pathname ||
                (!pathname.includes("/profile/") &&
                  nav === profileNavigation[0]),
            )
            .map((nav) => (
              <Link key={nav.path} href={nav.path} prefetch>
                <li
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-2 py-2.5 hover:bg-gray-50",
                    "border-l-2 border-brand-light-blue",
                  )}
                >
                  <div>{nav.icon}</div>
                  <span>{nav.label}</span>
                  {nav.issues && (
                    <span className="ml-auto text-red-500">
                      <Popover>
                        <PopoverTrigger>
                          <Info className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="p-2 text-xs text-red-700">
                            {t("agency.profile.menu.missingFields")}
                          </p>
                        </PopoverContent>
                      </Popover>
                    </span>
                  )}
                </li>
              </Link>
            ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 px-2 py-2.5 hover:bg-gray-50">
              <Menu className="h-4 w-4" />
              <span>{t("user.profile.menu.label")}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {profileNavigation
                .filter((nav) => nav.path !== pathname)
                .map((nav) => (
                  <DropdownMenuItem key={nav.path} asChild>
                    <Link
                      href={nav.path}
                      prefetch
                      className="flex w-[calc(100vw-24px)] cursor-pointer items-center gap-3 px-2 py-2.5 hover:bg-gray-50"
                    >
                      <div>{nav.icon}</div>
                      <span className="text-base">{nav.label}</span>
                      {nav.issues && (
                        <Info className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
      </div>
      {/* Desktop View */}
      <ul className="hidden sm:block">
        {profileNavigation.map((nav) => (
          <Link key={nav.path} href={nav.path} prefetch className="">
            <li
              key={nav.label}
              className={cn(
                "flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 sm:gap-3 sm:px-5 sm:py-3",
                pathname === nav.path && "border-l-2 border-brand-light-blue",
              )}
            >
              <div>{nav.icon}</div>
              <span>{nav.label}</span>
              {nav.issues && (
                <span className="ml-auto text-red-500">
                  <Popover defaultOpen={true}>
                    <PopoverTrigger>
                      <Info className="h-4 w-4" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <p className="p-2 text-xs text-red-700">
                        {t("user.profile.menu.missingFields")}
                      </p>
                    </PopoverContent>
                  </Popover>
                </span>
              )}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
