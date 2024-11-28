"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from 'next-intl';

export default function ListingsListTitle() {
  const t = useTranslations();
  let [type, setType] = useQueryState(
    "type",
    parseAsString.withOptions({ shallow: false }).withDefault(t('common.search.defaultType'))
  );

  let [location, setLocation] = useQueryState(
    "location",
    parseAsString
      .withOptions({ shallow: false })
      .withDefault(t('common.search.defaultLocation'))
  );

  const title = t('common.search.titleFormat', { type: t(`common.property.type.${type}`), location });
  return (
    <h3 className="text-2xl font-medium mt-2.5 mb-3.5">{title}</h3>
  );
}
