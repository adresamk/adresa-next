import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import LogoutButton from "./LogoutButton";
export default async function AuthButNoProfilePopup() {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src={undefined} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="z-[220] p-4">
          <ul className="flex flex-col gap-2">
            <li>
              <LogoutButton></LogoutButton>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
