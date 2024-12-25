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
            t("MortgageCalculator.month"),
          ),
    pricePerSquare:
      listing.transactionType === "sale"
        ? displayPricePerSquare(listing.price, listing.area, "EUR")
        : null,
    area: displayArea(listing.area),
    ...(lwr.residential && {
      floor: lwr.residential.floor,
      totalFloors: lwr.residential.totalFloors,
      orientation: lwr.residential.orientation,
      zone: lwr.residential.zone,
      kitchenCount: lwr.residential.kitchenCount,
      bathroomCount: lwr.residential.bathroomCount,
      bedroomCount: lwr.residential.bedroomCount,
      wcCount: lwr.residential.wcCount,
      constructionYear: lwr.residential.constructionYear,
      totalPropertyArea: lwr.residential.totalPropertyArea,
      isFurnished: lwr.residential.isFurnished
        ? t("common.buttons.yes")
        : t("common.buttons.no"),
      isForStudents: lwr.residential.isForStudents
        ? t("common.buttons.yes")
        : t("common.buttons.no"),
      isForHolidayHome: lwr.residential.isForHolidayHome
        ? t("common.buttons.yes")
        : t("common.buttons.no"),
      commonExpenses: displayPriceMonthly(
        lwr.residential.commonExpenses,
        "EUR",
        t("MortgageCalculator.month"),
      ),
      heatingType: lwr.residential.heatingType,
      heatingMedium: lwr.residential.heatingMedium,
    }),
    ...(lwr.commercial && {
      floor: lwr.commercial.floor,
      constructionYear: lwr.commercial.constructionYear,
      totalPropertyArea: lwr.commercial.totalPropertyArea,
      isCornerProperty: lwr.commercial.isCornerProperty,
      isOnTopFloor: lwr.commercial.isOnTopFloor,
      accessFrom: lwr.commercial.accessFrom,
      commonExpenses: lwr.commercial.commonExpenses,
      heatingType: lwr.commercial.heatingType,
      heatingMedium: lwr.commercial.heatingMedium,
      wcCount: lwr.commercial.wcCount,
    }),
    ...(lwr.land && {
      isCornerProperty: lwr.land.isCornerProperty,
      orientation: lwr.land.orientation,
      zone: lwr.land.zone,
      accessFrom: lwr.land.accessFrom,
      slope: lwr.land.slope,
    }),
    ...(lwr.other && {
      accessFrom: lwr.other.accessFrom,
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
