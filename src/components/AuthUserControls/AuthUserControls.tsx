import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import userProfileBg from "@/assets/user-profile-bg.svg";
import { getUser } from "@/lib/auth";
import UserControls from "./UserControls";

export default async function AuthUserControls() {
  const user = await getUser();

  if (user) {
    return <UserControls user={user} />;
  }

  return (
    <div>
      <ul>
        <li>
          <Link href="/signin"> Login </Link>
        </li>
        <li>
          <Link href="/signup"> Sign up </Link>
        </li>
      </ul>
    </div>
  );
}
