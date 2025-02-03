import { featureIcons } from "@/lib/data/listing/importantDataReact";
import { Feature } from "@prisma/client";
import { useTranslations } from "next-intl";

interface FeatureShowcaseProps {
  feature: Feature;
}
export default function FeatureShowcase({ feature }: FeatureShowcaseProps) {
  const t = useTranslations();
  return (
    <div className="flex select-none items-center gap-2 rounded-sm border border-slate-500 px-2 py-1 text-slate-700">
      {featureIcons.hasOwnProperty(feature.key) &&
        featureIcons[feature.key as keyof typeof featureIcons]}
      {t(`common.property.feature.keys.${feature.key}`)}
    </div>
  );
}
