import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatNumberWithDelimiter } from "@/lib/utils";
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

const orientationOptions: { label: string; value: string }[] = [
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" },
  { label: "North East", value: "north-east" },
  { label: "North West", value: "north-west" },
  { label: "South East", value: "south-east" },
  { label: "South West", value: "south-west" },
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
      <input type="string" className="hidden" value="3" name="step" />
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-3">
        <Label htmlFor="price">
          Property Price <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <div className="mr-2 w-5">
            <Euro size={18} />
          </div>
          <Input
            required
            name="price"
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
        <Label htmlFor="area">
          Property Area <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <div className="mr-2 w-5">
            m<sup>2</sup>
          </div>
          <Input
            required
            type="number"
            name="area"
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
        <Label htmlFor="floorNumber">Floor</Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <Input
            required
            type="number"
            name="floorNumber"
            min={0}
            max={30}
            placeholder="Put what floor is the property on"
            value={floor}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              setFloor(newValue);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="orientation">Orientation</Label>
        <div className="flex items-center w-1/2 min-w-[300px] mb-2">
          <SelectDemo
            name="orientation"
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
              name="bedrooms"
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
              name="bathrooms"
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
            <Bath size={50} />
            <Input
              required
              type="number"
              name="wc"
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
          <div className="flex gap-3 items-center">
            <ChefHat size={50} />
            <Input
              required
              type="number"
              name="kitchens"
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
              name="livingRooms"
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
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label>Other characteristics</Label>
        <div className="flex flex-col   w-1/2 min-w-[300px] mb-2">
          <div className="flex items-center">
            <ParkingSquare />
            <RadioGroupDemo
              name="parking"
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
          <div className="flex items-center">
            <DoorClosed />
            <RadioGroupDemo
              name="elevator"
              direction="horisontal"
              title="Elevator"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  elevator: value === "yes",
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              name="balcony"
              direction="horisontal"
              title="Balcony"
              values={["yes", "no", "idk"]}
              onChange={(value) =>
                setExtraFeatures((prev: any) => ({
                  ...prev,
                  terace: value === "yes",
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              direction="horisontal"
              name="yard"
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
          <div className="flex items-center">
            <Building />
            <RadioGroupDemo
              direction="horisontal"
              name="basement"
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
