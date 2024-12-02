import { Link } from "@/i18n/routing";

interface FooterColumnProps {
  title: string;
  items: string[];
}
const footerColumns: FooterColumnProps[] = [
  {
    title: "Продажба",
    items: [
      "Категории стан",
      "Категории",
      "Категории",
      "Категории",
      "Категории",
    ],
  },
  {
    title: "Изнајмување",
    items: ["Категории", "Категории", "Категории", "Категории", "Категории"],
  },
  {
    title: "Услови",
    items: ["Услови за користење", "Политики"],
  },
  {
    title: "Контакт",
    items: ["За нас", "Контакт"],
  },
];
export default function Footer() {
  return (
    <footer className="max-md:px-5 flex w-full flex-col items-center overflow-x-auto bg-white px-20 pb-3.5 pt-11">
      {/* Footer top part */}
      <div className="flex max-w-[900px] flex-col">
        <div className="max-w-[900px]">
          <div className="max-md:flex-col flex gap-5">
            <div className="max-md:ml-0 max-md:w-full flex flex-col">
              <div className="max-md:mt-10 max-md:max-w-full grow">
                <div className="max-md:flex-col flex gap-5">
                  <div className="max-md:ml-0 max-md:w-full flex min-w-[220px] flex-col">
                    <div className="max-md:mt-10 flex w-full flex-col">
                      <div className="max-md:mr-1.5 flex gap-5 whitespace-nowrap rounded-none text-4xl font-semibold tracking-wide text-violet-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          loading="lazy"
                          src="/assets/adresa-logo.png"
                          className="rounded-xl"
                          alt="адреса.мк logo"
                        />
                      </div>
                      <div className="mt-2.5 text-sm font-medium text-neutral-600">
                        Пронајди ја твојата следна адреса
                      </div>
                      <div className="mt-5 flex justify-between gap-5 self-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/101ee53f6f2c18b8f6fd4cf06abe54387cf8d621e1fae0aa57e727be154e9306?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                          className="aspect-square w-[31px] shrink-0 object-contain"
                          alt=""
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f4e557e01e42d2b227883f505fbf1cadc6a9f8d2593de2cee98855e5244abd21?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                          className="aspect-square w-[31px] shrink-0 object-contain"
                          alt=""
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c22a3aca649c1e93c52393a90df170acb02d2596515fcc5a3cd46247a504a1e?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                          className="aspect-square w-[31px] shrink-0 object-contain"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  {footerColumns.map((column, index) => (
                    <div
                      key={column.title}
                      className="max-md:ml-0 max-md:w-full ml-5 flex w-3/12 flex-col"
                    >
                      <div className="max-md:mt-10 mt-4 flex grow flex-col items-start rounded-none text-xl font-light text-violet-950">
                        <div className="text-2xl font-semibold">
                          {column.title}
                        </div>
                        {column.items.map((item, index) => (
                          <div
                            key={index}
                            className={
                              index === 0 ? "mt-2 self-stretch" : "mt-1"
                            }
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="max-md:mt-10 mt-14 h-px w-full shrink-0" />
        <div className="mt-4 self-center text-lg font-medium text-neutral-600">
          © 2024, Adresa.mk
        </div>
      </div>

      {/* Footer bottom part */}
      <div>
        <div className="mx-auto w-full max-w-7xl px-5">
          <div className="flex justify-between">
            {/* Copyright */}
            <div></div>
            {/* TOS PP CP */}
            <div>
              <nav>
                <ul>
                  <li>
                    <Link target="_blank" href="/page/legalTerms">
                      Услови за користење
                    </Link>
                  </li>
                  <li>
                    <Link target="_blank" href="/privacyPolicy">
                      Политика за приватност
                    </Link>
                  </li>
                  <li>
                    {/* onclick should open dialog for setting up cookies and letting them know how they are used */}
                    <button>Услови за користење</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
