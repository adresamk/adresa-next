"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

export default function ListingsListTitle() {
  const t = useTranslations();
  let [propertyType, setPropertyType] = useQueryState(
    "propertyType",
    parseAsString
      .withOptions({ shallow: false })
      .withDefault(t("common.search.defaultType")),
  );

  let [location, setLocation] = useQueryState(
    "location",
    parseAsString
      .withOptions({ shallow: false })
      .withDefault(t("common.search.defaultLocation")),
  );

  const title = t("common.search.titleFormat", {
    type: t(`common.property.type.${propertyType}`),
    location,
  });
  return <h3 className="mb-3.5 mt-2.5 text-2xl font-medium">{title}</h3>;
}
