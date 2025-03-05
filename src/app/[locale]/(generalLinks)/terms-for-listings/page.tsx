import "@/content/metadata.css";
export default async function TermsForListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  console.log(locale);
  const { default: TermsForListings } = await import(
    `@/content/terms-for-listings/${locale}.mdx`
  );

  // console.log(a);

  // return <div>{"ASD"}</div>;
  return (
    <article className="mx-auto max-w-4xl px-8 py-6">
      <TermsForListings />
    </article>
  );
}

export function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}

export const dynamicParams = false;
