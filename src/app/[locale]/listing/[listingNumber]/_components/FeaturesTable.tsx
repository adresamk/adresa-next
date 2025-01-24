import { Listing } from ".prisma/client";
import {
  capitalizeString,
  displayArea,
  displayDate,
  displayPrice,
  displayPriceMonthly,
  displayPricePerSquare,
} from "@/lib/utils";
import { ListingWithRelations } from "@/types/listing.types";
import { useTranslations } from "next-intl";

export default function FeaturesTable({ listing }: { listing: Listing }) {
  const t = useTranslations();
  const lwr = listing as ListingWithRelations;

  const features = {
    price:
      listing.transactionType === "sale"
        ? displayPrice(listing.price, "EUR")
        : displayPriceMonthly(
            listing.price,
            "EUR",
            t("mortgageCalculator.month"),
          ),
    pricePerSquare:
      listing.transactionType === "sale"
        ? displayPricePerSquare(listing.price, listing.area, "EUR")
        : null,
    area: displayArea(listing.area),
    ...(lwr.residential && {
      floor: lwr.residential.floor,
      totalFloors: lwr.residential.totalFloors,
      orientation: t(
        `listing.new.progress.steps.mainCharacteristics.orientation.orientationOptions.${lwr.residential.orientation}`,
      ),
      zone: t(
        `listing.new.progress.steps.mainCharacteristics.zone.zoneOptions.${lwr.residential.zone}`,
      ),
      kitchenCount: lwr.residential.kitchenCount,
      bathroomCount: lwr.residential.bathroomCount,
      bedroomCount: lwr.residential.bedroomCount,
      wcCount: lwr.residential.wcCount,
      constructionYear: lwr.residential.constructionYear,
      totalPropertyArea: lwr.residential.totalPropertyArea,
      isFurnished: lwr.residential.isFurnished
        ? t("common.words.yes")
        : t("common.words.no"),
      isForStudents: lwr.residential.isForStudents
        ? t("common.words.yes")
        : t("common.words.no"),
      isForHolidayHome: lwr.residential.isForHolidayHome
        ? t("common.words.yes")
        : t("common.words.no"),
      commonExpenses: displayPriceMonthly(
        lwr.residential.commonExpenses,
        "EUR",
        t("mortgageCalculator.month"),
      ),
      heatingType: t(
        `listing.new.progress.steps.mainCharacteristics.heatingType.heatingTypeOptions.${lwr.residential.heatingType}`,
      ),
      heatingMedium: t(
        `listing.new.progress.steps.mainCharacteristics.heatingMedium.heatingMediumOptions.${lwr.residential.heatingMedium}`,
      ),
    }),
    ...(lwr.commercial && {
      floor: lwr.commercial.floor,
      constructionYear: lwr.commercial.constructionYear,
      totalPropertyArea: lwr.commercial.totalPropertyArea,
      isCornerProperty: lwr.commercial.isCornerProperty,
      isOnTopFloor: lwr.commercial.isOnTopFloor,
      accessFrom: lwr.commercial.accessFrom,
      commonExpenses: lwr.commercial.commonExpenses,
      heatingType: t(
        `listing.new.progress.steps.mainCharacteristics.heatingType.heatingTypeOptions.${lwr.commercial.heatingType}`,
      ),
      heatingMedium: t(
        `listing.new.progress.steps.mainCharacteristics.heatingMedium.heatingMediumOptions.${lwr.commercial.heatingMedium}`,
      ),
      wcCount: lwr.commercial.wcCount,
    }),
    ...(lwr.land && {
      isCornerProperty: lwr.land.isCornerProperty,
      orientation: t(
        `listing.new.progress.steps.mainCharacteristics.orientation.orientationOptions.${lwr.land.orientation}`,
      ),
      zone: t(
        `listing.new.progress.steps.mainCharacteristics.zone.zoneOptions.${lwr.land.zone}`,
      ),
      accessFrom: t(
        `listing.new.progress.steps.mainCharacteristics.accessFrom.accessFromOptions.${lwr.land.accessFrom}`,
      ),
      slope: t(
        `listing.new.progress.steps.mainCharacteristics.slope.slopeOptions.${lwr.land.slope}`,
      ),
    }),
    ...(lwr.other && {
      accessFrom: t(
        `listing.new.progress.steps.mainCharacteristics.accessFrom.accessFromOptions.${lwr.other.accessFrom}`,
      ),
      totalPropertyArea: lwr.other.totalPropertyArea,
    }),
    updatedAt: displayDate(listing.updatedAt),
    publishedAt: displayDate(listing.publishedAt),
  };

  return (
    <table className="w-full border-collapse border-spacing-0 rounded-md border">
      <tbody className="rounded-md">
        {Object.entries(features).map(([key, value]) => {
          if (!value) return null;

          return (
            <tr key={key} className="first:rounded-t-md last:rounded-b-md">
              <td className="px- w-[150px] border border-slate-300 bg-slate-100 py-2 pl-4 text-left text-slate-900">
                {capitalizeString(t(`listing.fieldsKeys.${key}`))}
              </td>
              <td className="border border-slate-300 bg-white px-4 font-semibold text-black">
                {value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
