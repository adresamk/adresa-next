import "@/content/metadata.css";
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  const { default: Contact } = await import(`@/content/contact/${locale}.mdx`);

  return (
    <article className="mx-auto max-w-4xl px-8 py-6">
      <Contact />
    </article>
  );
}

export function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}

export const dynamicParams = false;
