import { SerializedListing } from "@/lib/types";
import { formatNumberWithDelimiter } from "@/lib/utils";
import { Listing } from "@prisma/client";

export default function FeaturesTable({
  listing,
}: {
  listing: SerializedListing;
}) {
  return (
    <table className="w-full">
      <tbody>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Price
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {formatNumberWithDelimiter(
              listing.price ? listing.price.toString() : "",
            )}
            $
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Price per m2
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.price &&
              listing.area &&
              formatNumberWithDelimiter(
                Math.round(listing.price / listing.area).toString(),
              )}
            $
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Area
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.area} m2
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Floors
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.floorNumber}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Kat
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.floorNumber} (од вкупно 7)
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Kitchen
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.kitchens}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Bathroom
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.bathrooms}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Garage/Parking
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.parking} Parking
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Year Made
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {"Year Made 2023"}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Posted Date
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.publishedAt}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Last Modified
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.updatedAt}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Post Number
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {listing.listingNumber}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
