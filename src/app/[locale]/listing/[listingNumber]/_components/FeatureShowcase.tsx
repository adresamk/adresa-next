import { ListingFeatureWithFeature } from "@/types/listing.types";
import { Feature } from "@prisma/client";
import { CarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const featureIcons = {
  parking: <CarIcon className="mr-3 h-4 w-4 text-primary" />,
  //   elevator: <ElevatorIcon />,
  //   balcony: <BalconyIcon />,
  //   yard: <YardIcon />,
  //   basement: <BasementIcon />,
  //   internet: <InternetIcon />,
  //   cabel_tv: <CableTvIcon />,
  //   close_to_center: <CenterIcon />,
  //   quiet_neighbourhood: <QuietNeighbourhoodIcon />,
};

interface FeatureShowcaseProps {
  feature: Feature;
}
export default function FeatureShowcase({ feature }: FeatureShowcaseProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-2 rounded-sm border border-slate-500 px-2 py-1 text-slate-700">
      {featureIcons.hasOwnProperty(feature.key) &&
        featureIcons[feature.key as keyof typeof featureIcons]}
      {t(`listing.feature.keys.${feature.key}`)}
    </div>
  );
}
