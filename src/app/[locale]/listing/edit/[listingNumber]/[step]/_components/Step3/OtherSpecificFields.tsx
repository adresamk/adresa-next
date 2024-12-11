import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";

interface OtherSpecificFieldsProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function OtherSpecificFields({
  listing: basicTypedListing,
  allCategoryFeatures,
}: OtherSpecificFieldsProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    other: lwr.other!,
  };

  const accessFromOptionsTranslated = [
    { label: "Paved", value: "paved" },
    { label: "Asphalt", value: "asphalt" },
    { label: "Pedestrian", value: "pedestrian" },
    { label: "Dirt Road", value: "dirt_road" },
    { label: "Sea", value: "sea" },
    { label: "Other", value: "other" },
    { label: "No Road Access", value: "no_road_access" },
  ];

  return (
    <>
      <input
        type="string"
        className="hidden"
        defaultValue={listing.other.id}
        name="otherId"
      />
      {/* Access From */}
      <div className="flex flex-col gap-3">
        <Label>Access From</Label>

        <SelectSelfContained
          name="accessFrom"
          id="heatingMedium"
          value={listing.other.accessFrom}
          placeholder="Select Access From"
          options={accessFromOptionsTranslated}
        />
      </div>

      {/* Total Property Area */}
      <div className="flex flex-col gap-3">
        <Label>Total Property Area</Label>
        <Input
          min={1}
          max={10000}
          type="number"
          name="totalPropertyArea"
          id="totalPropertyArea"
          placeholder="Total property area in square meters"
          value={listing.other.totalPropertyArea || undefined}
        />
      </div>
    </>
  );
}
