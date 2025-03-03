"use client";
import { useCallback, useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import Fuse from "fuse.js";
import { useDebounceValue } from "usehooks-ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilters } from "@/hooks/useFilters";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { useLocale, useTranslations } from "next-intl";
import {
  getAllLocationOptionsTranslated,
  getAllLocationOptionsTranslated2,
  getAllMunicipalitiesWithPlacesTranslated,
  getAllRegionsTranslated,
  TranslatedOption,
  TranslatedOptionMultipleLanguages,
  TranslatedOptionWithMaybePlaces,
} from "@/lib/data/macedonia/importantData";

type Tag = {
  label: {
    mk: string;
    en: string;
    al: string;
  };
  value: string;
};

function BigVariant({ isOpen }: { isOpen: boolean }) {
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const t = useTranslations();

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedFilterLocation] = useDebounceValue(
    "",
    400,
  );
  //effect description
  useEffect(() => {
    // updateFilters({ location: debouncedLocation });
    if (location && location.length > 2) {
      setDebouncedFilterLocation(location);
    }
  }, [location, setDebouncedFilterLocation]);

  const locale = useLocale();
  const getLocationDropdownOptions = useCallback(() => {
    const options: (TranslatedOptionMultipleLanguages & {
      fuseLabel: {
        mk: string;
        en: string;
        al: string;
      };
    })[] = getAllLocationOptionsTranslated2();

    // console.log("options", options);

    const regions = getAllRegionsTranslated();
    // console.log("options", options);
    // const optionsWithRegions = [...regions, ...options];
    const optionsWithRegions = options;

    // console.log("optionsWithRegions", optionsWithRegions);

    const priorityTerms = {
      Капиштец: 6,
      Kapishtec: 6,

      Скопје: 3,
      "Кисела Вода, Скопје": 3,
      "Аеродром, Скопје": 3,
      "Гази Баба, Скопје": 3,
      "Бутел, Скопје": 3,
      "Шуто Оризари, Скопје": 3,
      "Сарај, Скопје": 3,
      "Ѓорче Петров, Скопје": 3,
      "Карпош, Скопје": 3,
      "Центар, Скопје": 3,
      "Чаир, Скопје": 3,

      "Kisela Vodës, Shkupi": 3,
      "Aerodromit, Shkupi": 3,
      "Gazi Babës, Shkupi": 3,
      "Butelit, Shkupi": 3,
      "Shuto Orizarit, Shkupi": 3,
      "Sarajit, Shkupi": 3,
      "Gjorçe Petrovit, Shkupi": 3,
      "Karposhit, Shkupi": 3,
      "Qendrës, Shkupi": 3,
      "Çairit, Shkupi": 3,

      "Kisela Voda, Skopje": 4,
      "Aerodrom, Skopje": 4,
      "Gazi Baba, Skopje": 4,
      "Butel, Skopje": 4,
      "Shuto Orizari, Skopje": 4,
      "Saraj, Skopje": 4,
      "Gjorche Petrov, Skopje": 4,
      "Karposh, Skopje": 4,
      "Centar, Skopje": 4,
      "Chair, Skopje": 4,

      // Add more common locations with their priority weights
    };
    // console.log("optionsWithRegions", optionsWithRegions);
    const fuse = new Fuse(optionsWithRegions, {
      keys: [
        { name: `fuseLabel.${locale}`, weight: 2 }, // Current language gets higher priority
        {
          name: `fuseLabel.${locale}`,
          weight: 2,
          getFn: (obj) => {
            const label = obj.fuseLabel[locale as keyof typeof obj.fuseLabel];
            let prefix = "";

            // First check for exact match (case-insensitive)
            if (
              label &&
              debouncedLocation &&
              label.toLowerCase() === debouncedLocation.toLowerCase()
            ) {
              prefix = "!".repeat(20); // Much higher priority for exact matches
            }
            // Then check priority terms
            else if (
              label &&
              priorityTerms[label as keyof typeof priorityTerms]
            ) {
              prefix = "!".repeat(
                priorityTerms[label as keyof typeof priorityTerms],
              );
            }

            return `${prefix}${label}`;
          },
        },
        { name: "fuseLabel.en", weight: 1 },
        { name: "fuseLabel.mk", weight: 1 },
        { name: "fuseLabel.al", weight: 1 },
      ],
      threshold: 0.7,
      distance: 110,
      minMatchCharLength: 3,
      shouldSort: true,
      useExtendedSearch: true,
    });

    // console.log("debouncedLocation", debouncedLocation);
    const filteredOptions = fuse.search(debouncedLocation);
    // console.log("filteredOptions", filteredOptions);
    const existingLocations = filters.location
      ? filters.location.split(",")
      : [];

    const results = filteredOptions
      .filter((o) => !existingLocations.includes(o.item.value))
      .map((o) => o.item)
      .slice(0, 6);
    return {
      options: optionsWithRegions,
      translatedPlaces: optionsWithRegions,
      fuseResults: results,
    };
  }, [debouncedLocation, filters.location, locale]);

  const locationDropdown = getLocationDropdownOptions();
  // console.log("locationDropdown fuseResults", locationDropdown.fuseResults);
  // console.log("locationDropdown options", locationDropdown.options);
  // console.log(
  //   "locationDropdown translatedPlaces",
  //   locationDropdown.translatedPlaces,
  // );
  const [tags, setTags] = useState<Tag[]>(() => {
    // return filters.location
    //   ? filters.location.split(",").map((value) => ({
    //       value: value,
    //       label:
    //         getLocationDropdownOptions().options.find(
    //           (o) => o.value === value,
    //         )?.label?[locale] || "",
    //     }))
    //   : [];
    if (filters.location) {
      const mappedTags: Tag[] = [];

      filters.location.split(",").map((value) => {
        let option = getLocationDropdownOptions().options.find(
          (o) => o.value === value,
        );
        let label = option ? option.label : {};
        return {
          value: value,
          label: label,
        };
      });
      return mappedTags;
    }
    return [];
  });

  function handleUpdateTags(location: TranslatedOptionMultipleLanguages) {
    console.log("location", location);
    const newTags = [...tags, location];
    setTags(newTags);
  }
  function handleRemoveTag(value: string) {
    const newTags = tags.filter((t) => t.value !== value);
    setTags(newTags);
    updateFilters({
      location: newTags.map((t) => t.value).join(","),
    });
  }

  //focus field on selection of the space around it for location
  // useEffect(() => {
  //   if (focusedFilter === "location") {
  //     document.getElementById("location")?.focus();
  //   }
  // }, [focusedFilter]);

  useEffect(() => {
    // console.log("filters.location", filters.location);
    // console.log("options", getLocationDropdownOptions().options);
    if (filters.location && filters.location.length > 0) {
      const mappedTags = filters.location.split(",").map((value) => {
        let option = getLocationDropdownOptions().options.find(
          (o) => o.value === value,
        );
        console.log("value", option);
        let label = option ? option.label : { mk: "", en: "", al: "" };
        return {
          value: value,
          label: label,
        };
      });
      // console.log("mappedTags", mappedTags);
      setTags(mappedTags);
    }
    if (filters.location && filters.location.length === 0) {
      setTags([]);
    }
  }, [filters.location, getLocationDropdownOptions]);

  return (
    <div
      className={cn(
        "relative h-full min-h-[88px] w-full max-w-full rounded-xl border border-transparent bg-gray-100 pb-[6px] pl-[20px] pr-[19px] pt-[17px]",
        focusedFilter === "location" && "rounded-b-none",
        !focusedFilter && "",
      )}
      onClick={() => {
        setFocusedFilter("location");
        document.getElementById("location")?.focus();
      }}
    >
      <div
        className={cn(
          "flex h-[calc(100%_+2px)] flex-col gap-1.5 text-brand-dark-blue",
          focusedFilter === "location" && "rounded-b-none",
        )}
      >
        <label
          className="flex h-5 w-full items-center gap-2 font-medium"
          htmlFor={"location"}
        >
          {<MapPin className="h-4 w-4" />} {t("search.filters.location.label")}
          {/* <span className="text-sm">{filters.location}</span> */}
        </label>
        <div className="relative flex min-h-10 flex-wrap items-center text-sm">
          {tags.map((t) => {
            // console.log("t", t);
            return (
              <div
                className="relative mr-2.5 mt-1 inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-200 py-2 pl-2.5 pr-8 text-sm tracking-tight text-slate-900"
                key={t.value}
              >
                <span className="flex-grow overflow-hidden">
                  {t.label[locale as keyof typeof t.label]}
                </span>

                <div
                  onClick={() => handleRemoveTag(t.value)}
                  className="absolute right-0 top-0 inline-flex h-full w-8 cursor-pointer items-center justify-center"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            );
          })}
          {/* line-height: 1; border: 0; height: 40px; padding: 0;
      flex-grow: 1; letter-spacing: -.32px; */}
          <input
            autoComplete="off"
            // className="h-8 w-full flex-grow rounded border-none bg-gray-50 p-1 px-4 leading-tight text-black outline-none"
            className="h-[40px] flex-grow border-none bg-transparent p-0 leading-tight outline-none"
            style={{
              width: 0,
              flexBasis: 0,
            }}
            name="location"
            id="location"
            placeholder={
              focusedFilter === "location"
                ? t("search.filters.location.notActivePlaceholder")
                : t("search.filters.location.emptyPlaceholder")
            }
            value={location}
            onChange={(e) => {
              // setDebouncedFilterLocation(e.target.value);
              // setDebouncedFilterLocation({ location: e.target.value });
              setLocation(e.target.value);
            }}
          />
          {focusedFilter === "location" && isOpen && location.length > 2 && (
            <ul className="absolute left-0 top-full z-[100] -ml-[22px] mt-[5px] max-h-[280px] w-[calc(100%_+_41px)] overflow-auto rounded-b-xl bg-white shadow-lg">
              {locationDropdown.fuseResults.map(
                (location: TranslatedOptionMultipleLanguages) => (
                  <li
                    key={location.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded p-1 px-3 py-2 hover:bg-green-50",
                    )}
                    onClick={() => {
                      console.log(location.value);
                      setLocation(location.value);
                      updateFilters({
                        location: filters.location
                          ? `${filters.location},${location.value}`
                          : location.value,
                      });
                      handleUpdateTags(location);
                      setLocation("");
                      locationDropdown.fuseResults = [];
                    }}
                  >
                    <span>
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span>
                      {location.label[locale as keyof typeof location.label]}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

interface LocationFilterProps {
  variant: "homepage" | "search";
}
export default function LocationFilter({ variant }: LocationFilterProps) {
  const locationFilterDivRef = useRef(null);
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );
  const [isOpen, setisOpen] = useState(false);

  const handleClickOutside = () => {
    setisOpen(false);
    setFocusedFilter("");
  };
  useOnClickOutside(locationFilterDivRef, handleClickOutside);
  return (
    <div
      ref={locationFilterDivRef}
      onClick={() => {
        setisOpen(true);
      }}
      className={cn(
        // xl:w-auto xl:flex-1 xl:rounded-xl xl:border-b-0 xl:pr-0
        "location relative w-full flex-grow rounded-b-none border-b border-slate-200 sm:pr-[220px]",
      )}
    >
      {/* <div>{isOpen ? "is" : "|"}</div> */}
      <div
        className={cn(
          "filters-field relative h-full w-full max-w-full rounded-r-xl rounded-bl-none rounded-tl-xl border-r border-gray-200 xl:rounded-xl xl:border-b",
          focusedFilter === "location" &&
            "z-[20] rounded-b-none border-b-white bg-white",
        )}
      >
        <Popover
          open={isOpen}
          onOpenChange={(nextState) => {
            if (nextState === true) {
              setisOpen(true);
            }
          }}
        >
          <PopoverTrigger asChild>
            {variant === "homepage" ? (
              <BigVariant isOpen={isOpen} />
            ) : (
              <div>small</div>
            )}
          </PopoverTrigger>
          <PopoverContent asChild>
            {/* <ul className="test relative flex max-h-[280px] w-full min-w-[418px] flex-col overflow-y-auto rounded bg-white p-2 text-sm shadow-lg">
              {locationDropdownOptions.map((location) => (
                <li
                  key={location}
                  className={cn(
                    "flex cursor-pointer gap-2 rounded p-1 hover:bg-green-50",
                    filters.propertyType === location &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    updateFilters({ location });
                  }}
                >
                  <span>
                    <MapPin />
                  </span>
                  <span>{location}</span>
                </li>
              ))}
            </ul> */}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
