"use client";
import React from "react";
import { ScanSearch } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import LastSearchCard from "@/app/[locale]/_components/LastSearchCard";
import { useTranslations } from "next-intl";
import { RealEstateSearch } from "@/lib/types";

const searches: RealEstateSearch[] = [
  {
    searchCriteria: {
      listingType: "sale",
      category: "residential",
      priceLow: 20000,
      priceHigh: 130000,
      livingAreaHigh: 25,
      areaIDs: [104],
      sortBy: "rankingscore",
      sortOrder: "desc",
    },
    searchGeographies: [
      {
        geographyId: 104,
        slug: "",
        parent: 105103,
        parentSlug: "",
        name: "Athens - East",
        fullName: "Athens - East (Attica)",
        titleName: "Athens - East",
        metaName: "Athens - East (Attica)",
        level: 2,
        root_id: 1,
        ancestors: {
          id: [1, 105103],
        },
        latitude: 38.0430076925,
        longitude: 23.9311748162,
      },
      {
        geographyId: 104,
        slug: "",
        parent: 105103,
        parentSlug: "",
        name: "Athens - North",
        fullName: "Athens - North (Attica)",
        titleName: "Athens - North",
        metaName: "Athens - North (Attica)",
        level: 2,
        root_id: 1,
        ancestors: {
          id: [1, 105103],
        },
        latitude: 38.0430076925,
        longitude: 23.9311748162,
      },
    ],
    searchHash: "65a784cb63861bb136da82b6d4bf890d",
    savedSearchTitle: "Homes for sale in Athens - East +2 filters",
    addedToRecentDateTime: 1732836995449,
  },
  {
    searchCriteria: {
      listingType: "sale",
      category: "commercial",
      priceLow: 20000,
      priceHigh: 130000,
      livingAreaHigh: 55,
      areaIDs: [499209],
      sortBy: "rankingscore",
      sortOrder: "desc",
    },
    searchGeographies: [
      {
        geographyId: 499209,
        slug: "",
        parent: 2823,
        parentSlug: "",
        name: "Agia Kyriaki",
        fullName: "Agia Kyriaki (Charilaou)",
        titleName: "Agia Kyriaki",
        metaName: "Agia Kyriaki (Charilaou)",
        level: 5,
        root_id: 1,
        ancestors: {
          id: [1, 105101, 108, 2823],
        },
        latitude: 40.59686219,
        longitude: 22.97607161,
      },
    ],
    searchHash: "f6f7531ed7c275e5758524a11996e5e0",
    savedSearchTitle:
      "Commercial properties for sale in Agia Kyriaki +2 filters",
    addedToRecentDateTime: 1732906165348,
  },
];
export default function LastSearches() {
  const t = useTranslations();

  return (
    <ContentCarousel
      icon={<ScanSearch className="h-7 w-7" />}
      title={t("home.sections.lastSearches")}
      items={searches}
      renderItem={(search) => <LastSearchCard search={search} />}
      contentClasses="" // Example height
      carouselItemContainerClasses="h-[342px]"
      carouselItemClasses="h-full" // Example width
    />
  );
}
