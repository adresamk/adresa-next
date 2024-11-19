import { SerializedListing } from "@/lib/types";
import {
  displayArea,
  displayDate,
  displayPrice,
  displayPricePerSquare,
} from "@/lib/utils";

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
            {displayPrice(listing.price)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Price per m2
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayPricePerSquare(listing.price, listing.area)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Area
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayArea(listing.area)}
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
            {displayDate(listing.publishedAt)}
          </td>
        </tr>
        <tr>
          <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
            Last Modified
          </td>
          <td className="border border-slate-600 px-2 font-semibold text-black">
            {displayDate(listing.updatedAt)}
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
