import { Listing } from ".prisma/client";
import {
  displayArea,
  displayDate,
  displayPrice,
  displayPricePerSquare,
} from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function FeaturesTable({ listing }: { listing: Listing }) {
  const t = useTranslations();

  return (
    <table className="w-full">
      <tbody>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.price")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayPrice(listing.price)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.features.pricePerSquare")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayPricePerSquare(listing.price, listing.area)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.filters.surface.label")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayArea(listing.area)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.features.floor")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {/* {t("common.property.features.floorInfo", {
              floor: listing.floorNumber,
              total: 7,
            })} */}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.features.kitchen")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {/* {listing.kitchens}{" "}
            {listing.kitchens === 1
              ? t("common.property.features.kitchen")
              : t("common.property.features.kitchens")} */}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.features.bathroom")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {/* {listing.bathrooms}{" "}
            {listing.bathrooms === 1
              ? t("common.property.features.bathroom")
              : t("common.property.features.bathrooms")} */}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.features.parking")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {/* {listing.parking ? "1" : "0"}{" "} */}
            {t("common.property.features.parking")}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.features.yearBuilt")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            2023
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.metadata.posted")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayDate(listing.publishedAt)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            {t("common.property.metadata.lastModified")}
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayDate(listing.updatedAt)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
