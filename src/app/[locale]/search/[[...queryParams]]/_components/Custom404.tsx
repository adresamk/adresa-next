import Container from "@/components/shared/Container";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

interface Custom404Props {}
export default async function Custom404({}: Custom404Props) {
  const t = await getTranslations("search.404");
  return (
    <Container>
      <div className="my-10 flex h-[205px] flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg">{t("description")}</p>

        <p className="mt-4 text-center text-sm text-gray-500">
          {t("messageP1")}
          <Link className="text-blue-400 underline" href="/">
            {t("homepage")}
          </Link>
          {t("messageP2")}
          <Link className="text-blue-400 underline" href="/contact">
            {t("contactUs")}
          </Link>
          {t("messageP3")}
        </p>
      </div>
    </Container>
  );
}
