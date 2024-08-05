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
    items: [
      "Категории",
      "Категории",
      "Категории",
      "Категории",
      "Категории",
    ],
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
    <footer className=" flex flex-col items-center px-20 pt-11 pb-3.5 bg-white max-md:px-5">
      <div className="flex flex-col  max-w-[900px]">
        <div className="max-w-[900px]">
          <div className="flex gap-5 max-md:flex-col ">
            <div className="flex flex-col  max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                  <div className="flex flex-col min-w-[220px] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col w-full max-md:mt-10">
                      <div className="flex gap-5 text-4xl font-semibold tracking-wide whitespace-nowrap rounded-none text-violet-950 max-md:mr-1.5">
                        <img
                          loading="lazy"
                          src="/assets/adresa-logo.png"
                          className=" rounded-xl "
                          alt="адреса.мк logo"
                        />
                      </div>
                      <div className="mt-2.5 text-sm font-medium text-neutral-600">
                        Пронајди ја твојата следна адреса
                      </div>
                      <div className="flex gap-5 justify-between self-start mt-5">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/101ee53f6f2c18b8f6fd4cf06abe54387cf8d621e1fae0aa57e727be154e9306?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                          className="object-contain shrink-0 aspect-square w-[31px]"
                          alt=""
                        />
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f4e557e01e42d2b227883f505fbf1cadc6a9f8d2593de2cee98855e5244abd21?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                          className="object-contain shrink-0 aspect-square w-[31px]"
                          alt=""
                        />
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c22a3aca649c1e93c52393a90df170acb02d2596515fcc5a3cd46247a504a1e?apiKey=a5dae22cf52e4d4cb9170c6381cc86b6&&apiKey=a5dae22cf52e4d4cb9170c6381cc86b6"
                          className="object-contain shrink-0 aspect-square w-[31px]"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  {footerColumns.map((column, index) => (
                    <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                      <div className="flex flex-col grow items-start mt-4 text-xl font-light rounded-none text-violet-950 max-md:mt-10">
                        <div className="text-2xl font-semibold">
                          {column.title}
                        </div>
                        {column.items.map((item, index) => (
                          <div
                            key={index}
                            className={
                              index === 0
                                ? "self-stretch mt-2"
                                : "mt-1"
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
        <hr className="shrink-0 mt-14 w-full h-px max-md:mt-10" />
        <div className="self-center mt-4 text-lg font-medium text-neutral-600">
          © 2024, Adresa.mk
        </div>
      </div>
    </footer>
  );
}
