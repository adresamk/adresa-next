import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import userProfileBg from "@/assets/user-profile-bg.svg";
import { logout } from "@/app/(auth)/action";

export default function UserControls({
  img,
}: {
  img: string | null;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={img || userProfileBg.src} />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="z-[220] p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/profile/info">Profile</Link>
          </li>
          {/* <li>
              <Link href="/profile/settings">Settings</Link>
            </li> */}
          <li>
            <form action={logout}>
              <button>Logout</button>
            </form>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
