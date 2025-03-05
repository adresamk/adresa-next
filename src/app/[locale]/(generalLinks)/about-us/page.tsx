import "@/content/metadata.css";
export default async function AboutUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  console.log(locale);
  const { default: AboutUs } = await import(`@/content/about-us/${locale}.mdx`);

  return (
    <article className="mx-auto max-w-4xl px-8 py-6">
      <AboutUs />
    </article>
  );
}

export function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}

export const dynamicParams = false;
