import "@/content/metadata.css";
export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  console.log(locale);
  const { default: PrivacyPolicy } = await import(
    `@/content/privacy-policy/${locale}.mdx`
  );

  // console.log(a);

  // return <div>{"ASD"}</div>;
  return (
    <article className="mx-auto max-w-4xl px-8 py-6">
      <PrivacyPolicy />
    </article>
  );
}

export function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}

export const dynamicParams = false;
