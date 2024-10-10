import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
export default function AuthOptionsPopup() {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="z-[220] p-4">
          <div>
            <ul className="flex gap1 justify-between">
              <li>
                <Link href="/signin">
                  <Button size={"sm"}> Sign in </Button>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <Button size={"sm"}> Sign up </Button>{" "}
                </Link>
              </li>
            </ul>
            <Separator className="my-2" />
            <div>
              <Link href="/signup-agency">
                <Button
                  variant={"ghost"}
                  className="text-sm text-brand-light-blue hover:text-brand-dark-blue hover:bg-slate-50"
                >
                  Register as a professional
                </Button>
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
