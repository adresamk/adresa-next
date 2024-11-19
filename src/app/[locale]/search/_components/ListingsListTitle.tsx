"use client";

import { parseAsString, useQueryState } from "nuqs";

export default function ListingsListTitle() {
  let [type, setType] = useQueryState(
    "type",
    parseAsString.withOptions({ shallow: false }).withDefault("Homes")
  );

  let [location, setLocation] = useQueryState(
    "location",
    parseAsString
      .withOptions({ shallow: false })
      .withDefault("Skopje")
  );

  const title = `${type}: ${location}`;
  return (
    <h3 className="text-2xl font-medium mt-2.5 mb-3.5">{title}</h3>
  );
}
