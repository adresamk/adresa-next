import { checkResetPasswordTokenValidity } from "@/server/actions/auth.actions";
import { Link } from "@/i18n/routing";
import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const { success, error } = await checkResetPasswordTokenValidity(
    params.token,
  );
  if (!success && error) {
    return (
      <div>
        <div>{error}</div>
        <Link href="/">Go back to homepage</Link>
      </div>
    );
  }
  return <ResetPasswordForm token={params.token} />;
}
