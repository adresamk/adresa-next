import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { getTranslations } from "next-intl/server";
export default async function AuthOptionsPopup() {
  const t = await getTranslations();
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
            <ul className="gap1 flex justify-between">
              <li>
                <Link href="/signin">
                  <Button size={"sm"}> {t("auth.signIn.button")} </Button>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <Button size={"sm"}> {t("auth.signUp.button")} </Button>
                </Link>
              </li>
            </ul>
            <Separator className="my-2" />
            <div>
              <Link href="/signup-agency">
                <Button
                  variant={"ghost"}
                  className="text-sm text-brand-light-blue hover:bg-slate-50 hover:text-brand-dark-blue"
                >
                  {t("auth.signUp.agencySignUp")}
                </Button>
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
