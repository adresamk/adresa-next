"use client";

import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Listing } from "@prisma/client";

import { displayPrice } from "@/lib/utils";
import {
  Bath,
  Bed,
  Building,
  ChefHat,
  DoorClosed,
  Euro,
  Fence,
  ParkingSquare,
  ShowerHead,
  Sofa,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { orientationOptions } from "@/global/data";

const featuresSelectionOptions = [
  { label: "yes", value: true },
  { label: "no", value: false },
  { label: "idk", value: null },
];

const extraFeaturesValues = ["yes", "no", "idk"];
function featuresValues(value: boolean | null) {
  if (value === true) return "yes";
  if (value === false) return "no";
  return "idk";
}
export default function Step3({ listing }: { listing: Listing }) {
  const [propertyPrice, setPropertyPrice] = useState(
    displayPrice(listing.price),
  );
  const [propertyArea, setPropertyArea] = useState(listing.area?.toString());
  const [floor, setFloor] = useState(listing.floorNumber?.toString());
  const [orientation, setOrientation] = useState(listing.orientation || "");
  const [rooms, setRooms] = useState({
    bedroom: listing.bedrooms || 1,
    living: listing.livingRooms || 1,
    wcs: listing.wcs || 1,
    kitchen: listing.kitchens || 1,
    bathroom: listing.bathrooms || 1,
  });

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="3" name="step" />
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />

      {/* Price */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="price">
          Property Price <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <div className="mr-2 w-5">
            <Euro size={18} />
          </div>
          <Input
            required
            name="price"
            id="price"
            placeholder="Enter price in euros"
            value={propertyPrice || ""}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              const formattedValue = displayPrice(Number(newValue));
              setPropertyPrice(formattedValue);
            }}
          />
        </div>
      </div>
      {/* Area */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="area">
          Property Area <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <div className="mr-2 w-5">
            m<sup>2</sup>
          </div>
          <Input
            required
            type="number"
            name="area"
            id="area"
            min={1}
            max={3000}
            placeholder="Enter area in m2"
            value={propertyArea || 1}
            onChange={(e) => {
              let newValue = e.target.value.replace(/[^0-9]/g, "");
              if (Number(newValue) > 3000) {
                newValue = "3000";
              }
              setPropertyArea(newValue);
            }}
          />
        </div>
      </div>
      {/* Floor Number */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="floorNumber">Floor</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <Input
            type="number"
            name="floorNumber"
            id="floorNumber"
            min={0}
            max={30}
            placeholder="Put what floor is the property on"
            value={floor}
            onChange={(e) => {
              let newValue = e.target.value.replace(/[^0-9]/g, "");
              if (Number(newValue) > 30) {
                newValue = "30";
              }
              setFloor(newValue);
            }}
          />
        </div>
      </div>

      {/* Orientation */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="orientation">Orientation</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <SelectDemo
            name="orientation"
            onClick={(value) => setOrientation(value)}
            placeholder="Select orientation"
            value={orientation}
            options={orientationOptions}
          />
        </div>
      </div>
      {/* Rooms */}
      <div className="flex flex-col gap-3">
        <Label>Rooms</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] flex-col">
          {/* Bedrooms */}
          <div className="flex items-center gap-3">
            <Bed size={50} />
            <Input
              required
              type="number"
              name="bedrooms"
              id="bedrooms"
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.bedroom}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  bedroom: Number(e.target.value),
                }));
              }}
            />
            <span>bedroom </span>
          </div>
          {/* Bathrooms */}
          <div className="flex items-center gap-3">
            <ShowerHead size={50} />
            <Input
              required
              type="number"
              name="bathrooms"
              id="bathrooms"
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.bathroom}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  bathroom: Number(e.target.value),
                }));
              }}
            />
            <span>bathroom </span>
          </div>
          {/* WCS */}
          <div className="flex items-center gap-3">
            <Bath size={50} />
            <Input
              required
              type="number"
              name="wcs"
              id="wcs"
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.wcs}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  wcs: Number(e.target.value),
                }));
              }}
            />
            <span>wcs </span>
          </div>
          {/* Kitchens */}
          <div className="flex items-center gap-3">
            <ChefHat size={50} />
            <Input
              required
              type="number"
              name="kitchens"
              id="kitchens"
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.kitchen}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  kitchen: Number(e.target.value),
                }));
              }}
            />
            <span>kitchen </span>
          </div>

          {/* Living Rooms */}
          <div className="flex items-center gap-3">
            <Sofa size={50} />
            <Input
              required
              type="number"
              name="livingRooms"
              id="livingRooms"
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.living}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  living: Number(e.target.value),
                }));
              }}
            />
            <span>livingroom</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Other characteristics</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] flex-col">
          {/* Parking */}
          <div className="flex items-center">
            <ParkingSquare />
            <RadioGroupDemo
              name="parking"
              direction="horisontal"
              defaultValue={featuresValues(listing.parking)}
              title="Parking"
              values={extraFeaturesValues}
            />
          </div>
          {/* Elevator */}
          <div className="flex items-center">
            <DoorClosed />
            <RadioGroupDemo
              name="elevator"
              direction="horisontal"
              title="Elevator"
              values={extraFeaturesValues}
              defaultValue={featuresValues(listing.elevator)}
            />
          </div>
          {/* Balcony */}
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              name="balcony"
              direction="horisontal"
              title="Balcony"
              values={extraFeaturesValues}
              defaultValue={featuresValues(listing.balcony)}
            />
          </div>
          {/* Yard */}
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              direction="horisontal"
              name="yard"
              title="Yard"
              values={extraFeaturesValues}
              defaultValue={featuresValues(listing.yard)}
            />
          </div>
          {/* Basement */}
          <div className="flex items-center">
            <Building />
            <RadioGroupDemo
              direction="horisontal"
              name="basement"
              title="Basement"
              values={extraFeaturesValues}
              defaultValue={featuresValues(listing.basement)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
