import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CookiesConsent from "./CookiesConsent";
import { cn } from "@/lib/utils";
import AdresaLogo from "./AdresaLogo";

interface FooterColumnProps {
  title: string;
  items: { text: string; href: string }[];
}
const footerColumns: FooterColumnProps[] = [
  {
    title: "Sale",
    items: [
      {
        text: "stanovi-skopje",
        href: "search/tt-sale/l-00001/c-residential/t-apartment/s-new",
      },
      {
        text: "kukji-bitola",
        href: "search/tt-sale/l-10059/c-residential/t-house/s-new",
      },
      {
        text: "stanovi-ohrid",
        href: "search/tt-sale/l-10061/c-residential/t-house/s-new",
      },
      {
        text: "kancelariski-prostor-kumanovo",
        href: "search/tt-sale/l-10037/c-commercial/t-office/s-new",
      },
    ],
  },
  {
    title: "Rental",
    items: [
      {
        text: "skladovi-kavadarci",
        href: "search/tt-rent/l-10023/c-commercial/t-warehouse/s-new",
      },
      {
        text: "zemjista-berovo",
        href: "search/tt-rent/l-10035/c-land/t-agricultural/s-new",
      },
      {
        text: "garazi-skopje",
        href: "search/tt-sale/l-00001/c-other/t-garage/s-new",
      },
    ],
  },
  {
    title: "Terms",
    items: [
      { text: "Terms of Use", href: "terms-of-use" },
      { text: "Policies", href: "privacy-policy" },
      { text: "Terms for Listings", href: "terms-for-listings" },
      { text: "Cookies", href: "cookies-policy" },
    ],
  },
  {
    title: "Contact",
    items: [
      { text: "About Us", href: "about-us" },
      { text: "Contact", href: "contact" },
    ],
  },
];
export default async function Footer() {
  const t = await getTranslations("footer");
  const tHome = await getTranslations("home");
  return (
    <footer className="flex w-full flex-col items-center justify-center overflow-x-auto bg-white pb-7 pt-10 md:pb-3.5">
      {/* Footer top part */}
      <div className="flex w-full flex-col lg:max-w-7xl">
        <div className="">
          <div className="flex w-full flex-col">
            <div className="flex flex-col-reverse items-center gap-5 px-6 md:flex-row md:justify-between">
              {/* Logo and socials */}
              <div className="flex w-fit min-w-[220px] flex-col md:ml-0">
                <div className="flex w-full flex-col md:mt-10">
                  <div className="flex gap-5 whitespace-nowrap rounded-none text-4xl font-semibold tracking-wide text-violet-950 md:mr-1.5">
                    <AdresaLogo />
                  </div>
                  <div className="mt-2.5 text-sm font-medium text-neutral-600">
                    {tHome("title")}
                  </div>
                  <div className="mt-5 flex justify-between gap-5 self-start">
                    <Link
                      target="_blank"
                      href={"https://www.facebook.com/adresamacedonia"}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/101ee53f6f2c18b8f6fd4cf06abe54387cf8d621e1fae0aa57e727be154e9306?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                        className="aspect-square w-[31px] shrink-0 object-contain"
                        alt=""
                      />
                    </Link>
                    <Link
                      target="_blank"
                      href={"https://www.instagram.com/adresa.mk"}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f4e557e01e42d2b227883f505fbf1cadc6a9f8d2593de2cee98855e5244abd21?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                        className="aspect-square w-[31px] shrink-0 object-contain"
                        alt=""
                      />
                    </Link>
                    <Link
                      target="_blank"
                      href={"https://www.linkedin.com/company/adresa.mk/"}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c22a3aca649c1e93c52393a90df170acb02d2596515fcc5a3cd46247a504a1e?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                        className="aspect-square w-[31px] shrink-0 object-contain"
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden w-full flex-col flex-wrap justify-end gap-3 px-5 md:flex md:w-fit md:flex-row md:flex-nowrap">
                {footerColumns.map((column, index) => (
                  <div
                    key={column.title}
                    className="ml-5 flex w-3/12 min-w-[120px] flex-col md:ml-0 md:w-full"
                  >
                    <div className="mt-4 flex grow flex-col items-start rounded-none font-light text-violet-950 md:mt-10">
                      <h4 className="font-semibold">{t(column.title)}</h4>
                      {column.items.map((item, index) => (
                        <Link
                          key={index}
                          href={`/${item.href}`}
                          className={cn(
                            "mt-1 leading-5 underline",
                            index === 0 && "mt-2 self-stretch",
                          )}
                        >
                          {t(item.text)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Accordion Menu */}
              <div className="w-full max-w-72 md:hidden">
                <Accordion type="single" collapsible className="w-full">
                  {footerColumns.map((column, index) => (
                    <AccordionItem key={column.title} value={`item-${index}`}>
                      <AccordionTrigger className="py-3 text-left font-semibold">
                        {t(column.title)}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2">
                          {column.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={`${item.href}`}
                              className="text-sm"
                            >
                              {t(item.text)}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
        <hr className="mb-4 mt-14 h-px w-full shrink-0 md:mt-10" />
        {/* Footer bottom part */}

        <div className="text-xs">
          <div className="w-7xl mx-auto w-full px-5">
            <div className="flex w-full flex-col-reverse items-center justify-between gap-4 md:gap-2.5 lg:flex-row">
              {/* Copyright */}
              <div>Adresa.mk Copyright 2024-2024 {t("allRightsReserved")}</div>
              {/* TOS PP CP */}
              <div>
                <nav>
                  <ul className="flex gap-2">
                    <li className="text-center">
                      <Link
                        target="_blank"
                        className="text-brand-light-blue"
                        href="/terms-of-use"
                      >
                        {t("Terms of Use")}
                      </Link>
                    </li>
                    <li className="text-center">
                      <Link
                        target="_blank"
                        className="text-brand-light-blue"
                        href="/privacy-policy"
                      >
                        {t("Policies")}
                      </Link>
                    </li>
                    <li className="text-center">
                      {/* onclick should open dialog for setting up cookies and letting them know how they are used */}
                      <CookiesConsent />
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
