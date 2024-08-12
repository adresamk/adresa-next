import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
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

const formatNumberWithDelimiter = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Replace with your desired delimiter
};

const orientationOptions: { label: string; value: string }[] = [
  { label: "North", value: "N" },
  { label: "South", value: "S" },
  { label: "East", value: "E" },
  { label: "West", value: "W" },
  { label: "North East", value: "NE" },
  { label: "North West", value: "NW" },
  { label: "South East", value: "SE" },
  { label: "South West", value: "SW" },
];

const featuresSelectionOptions = [
  { label: "yes", value: true },
  { label: "no", value: false },
  { label: "idk", value: null },
];
export default function Step3() {
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyArea, setPropertyArea] = useState("");
  const [floor, setFloor] = useState("");
  const [orientation, setOrientation] = useState("");
  const [rooms, setRooms] = useState({
    sleeping: 1,
    living: 1,
    dining: 1,
    kitchen: 1,
    bathroom: 1,
  });

  const [extraFeatures, setExtraFeatures] = useState<any>({
    parking: true,
    elevator: false,
    terace: false,
    yard: true,
    basement: null,
  });

  return (
    <div className="p-2">
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-3">
        <Label htmlFor="property-price">
          Property Price <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <div className="mr-2 w-5">
            <Euro size={18} />
          </div>
          <Input
            required
            name="property-price"
            placeholder="Enter price in euros"
            value={propertyPrice}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              const formattedValue =
                formatNumberWithDelimiter(newValue);
              setPropertyPrice(formattedValue);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label>
          Property Area <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <div className="mr-2 w-5">
            m<sup>2</sup>
          </div>
          <Input
            required
            type="number"
            name="property-area"
            min={1}
            max={3000}
            placeholder="Enter area in m2"
            value={propertyArea}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              setPropertyArea(newValue);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Floors</Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <Input
            required
            type="number"
            name="property-area"
            min={0}
            max={30}
            placeholder="Enter area in m2"
            value={floor}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              setFloor(newValue);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Orientation</Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <SelectDemo
            onClick={(value) => setOrientation(value)}
            placeholder="Select orientation"
            value={orientation}
            options={orientationOptions}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Rooms</Label>
        <div className="flex flex-col  w-1/2 min-w-[300px] mb-2">
          <div className="flex gap-3 items-center">
            <Bed size={50} />
            <Input
              required
              type="number"
              name="sleeping"
              defaultValue={1}
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.sleeping}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  sleeping: Number(e.target.value),
                }));
              }}
            />
            <span>sleeping </span>
          </div>

          <div className="flex gap-3 items-center">
            <ShowerHead size={50} />
            <Input
              required
              type="number"
              name="bathroom"
              defaultValue={1}
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

          <div className="flex gap-3 items-center">
            <ChefHat size={50} />
            <Input
              required
              type="number"
              name="kitchen"
              defaultValue={1}
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

          <div className="flex gap-3 items-center">
            <Sofa size={50} />
            <Input
              required
              type="number"
              name="living"
              defaultValue={1}
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
            <span>living </span>
          </div>

          <div className="flex gap-3 items-center">
            <Utensils size={50} />
            <Input
              required
              type="number"
              name="dining"
              defaultValue={1}
              min={0}
              max={10}
              placeholder="Enter area in m2"
              value={rooms.dining}
              onChange={(e) => {
                console.log(e.target.value);
                setRooms((prev) => ({
                  ...prev,
                  dining: Number(e.target.value),
                }));
              }}
            />
            <span>dining </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label>Other characteristics</Label>
        <div className="flex flex-col   w-1/2 min-w-[300px] mb-2">
          <div>
            <ParkingSquare />
            <RadioGroupDemo
              direction="horisontal"
              title="Parking"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  parking: value === "yes",
                }))
              }
            />
          </div>
          <div>
            <DoorClosed />
            <RadioGroupDemo
              direction="horisontal"
              title="elevator"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  elevator: value === "yes",
                }))
              }
            />
          </div>
          <div>
            <Fence />
            <RadioGroupDemo
              direction="horisontal"
              title="Terace"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  terace: value === "yes",
                }))
              }
            />
          </div>
          <div>
            <Fence />
            <RadioGroupDemo
              direction="horisontal"
              title="Yard"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  yard: value === "yes",
                }))
              }
            />
          </div>
          <div>
            <Building />
            <RadioGroupDemo
              direction="horisontal"
              title="Basement"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  basement: value === "yes",
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
