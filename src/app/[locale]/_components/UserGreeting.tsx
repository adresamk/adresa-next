import { validateRequest } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

interface UserGreetingProps {}
export default async function UserGreeting({}: UserGreetingProps) {
  const { user } = await validateRequest();
  const t = await getTranslations();
  
  return (
    <div className="mx-auto mt-6 flex w-full max-w-7xl items-center justify-between rounded-lg border border-slate-300 p-4 md:p-5">
      <div className="flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border shadow">
          <Avatar>
            <AvatarFallback>
              {user?.firstName && user?.lastName ? (
                <span>
                  {user.firstName![0].toUpperCase()}
                  {user.lastName![0].toUpperCase()}
                </span>
              ) : (
                "RND"
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-3">
          <div className="font-semibold">
            {t('home.userGreeting.greeting')} {user?.firstName}
          </div>
          <div>
            <Link
              className="font-semibold text-brand-light-blue"
              href={"/profile/info"}
            >
              {t('common.navigation.myAccount')}
            </Link>
          </div>
        </div>
      </div>
      <div className="font-semibold">{t('home.userGreeting.dashboard')}</div>
    </div>
  );
}
