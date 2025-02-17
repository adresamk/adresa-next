"use client";
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
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { useParams } from "next/navigation";

export default function FeaturesTable({ listing }: { listing: Listing }) {
  // const t = await getTranslations();
  // const locale = await getLocale();
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  // console.log("locale from FT", locale);
  // console.log("params from FT", params);
  const lwr = listing as ListingWithRelations;

  const features = {
    price:
      listing.transactionType === "sale"
        ? displayPrice(listing.price, "EUR") || t("common.words.missingValue")
        : displayPriceMonthly(
            listing.price,
            "EUR",
            t("mortgageCalculator.month"),
          ) || t("common.words.missingValue"),
    pricePerSquare:
      listing.transactionType === "sale"
        ? displayPricePerSquare(listing.price, listing.area, "EUR") ||
          t("common.words.missingValue")
        : null,
    area: displayArea(listing.area) || t("common.words.missingValue"),
    ...(lwr.residential && {
      floor: lwr.residential.floor,
      totalFloors: lwr.residential.totalFloors,
      orientation:
        lwr.residential.orientation &&
        t(
          `listing.new.progress.steps.mainCharacteristics.orientation.orientationOptions.${lwr.residential.orientation}`,
        ),
      zone:
        lwr.residential.zone &&
        t(
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
      heatingType:
        lwr.residential.heatingType &&
        t(
          `listing.new.progress.steps.mainCharacteristics.heatingType.heatingTypeOptions.${lwr.residential.heatingType}`,
        ),
      heatingMedium:
        lwr.residential.heatingMedium &&
        t(
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
      heatingType:
        lwr.commercial.heatingType &&
        t(
          `listing.new.progress.steps.mainCharacteristics.heatingType.heatingTypeOptions.${lwr.commercial.heatingType}`,
        ),
      heatingMedium:
        lwr.commercial.heatingMedium &&
        t(
          `listing.new.progress.steps.mainCharacteristics.heatingMedium.heatingMediumOptions.${lwr.commercial.heatingMedium}`,
        ),
      wcCount: lwr.commercial.wcCount,
    }),
    ...(lwr.land && {
      isCornerProperty: lwr.land.isCornerProperty,
      orientation:
        lwr.land.orientation &&
        t(
          `listing.new.progress.steps.mainCharacteristics.orientation.orientationOptions.${lwr.land.orientation}`,
        ),
      zone:
        lwr.land.zone &&
        t(
          `listing.new.progress.steps.mainCharacteristics.zone.zoneOptions.${lwr.land.zone}`,
        ),
      accessFrom:
        lwr.land.accessFrom &&
        t(
          `listing.new.progress.steps.mainCharacteristics.accessFrom.accessFromOptions.${lwr.land.accessFrom}`,
        ),
      slope:
        lwr.land.slope &&
        t(
          `listing.new.progress.steps.mainCharacteristics.slope.slopeOptions.${lwr.land.slope}`,
        ),
    }),
    ...(lwr.other && {
      accessFrom:
        lwr.other.accessFrom &&
        t(
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
                {value === t("common.words.missingValue") ? (
                  <b className="text-red-500">{value}</b>
                ) : (
                  value
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
