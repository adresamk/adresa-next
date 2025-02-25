import "@/content/metadata.css";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  console.log(locale);
  const { default: CookiesPolicy } = await import(
    `@/content/cookies-policy/${locale}.mdx`
  );

  return (
    <article className="mx-auto max-w-4xl px-8 py-6">
      <CookiesPolicy />
    </article>
  );
}

export function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}

export const dynamicParams = false;
