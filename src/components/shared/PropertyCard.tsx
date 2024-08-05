import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

type PropertyCardType = {
  id: number;
  images: string[];
  type: string;
  area: string;
  price: number;
  mode: string;
  tags: string[];
  location: string;
  liked: boolean;
};

export default function PropertyCard({
  property,
}: {
  property: PropertyCardType;
}) {
  return (
    <div>
      <Card className="max-w-[325px]">
        <CardHeader className="relative p-0">
          <img
            src={property?.images?.[0]}
            className="w-full"
            alt=""
          />
          <div className="absolute flex bottom-2 left-2 gap-1 text-[10px]">
            {property?.tags?.map((tag: string) => (
              <span
                key={tag}
                className="bg-white text-brand-light-blue p-0.5 font-semibold px-1.5 uppercase rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent
          className="
        px-4 pt-2"
        >
          <p>
            {property.type}, {property.area}
          </p>
          <p className="text-sm">{property.location}</p>
        </CardContent>
        <CardFooter className="pb-3 px-4">
          <div className="flex justify-around">
            <span>{property.price}</span>
            <span className="ml-auto">
              <Heart fill={property.liked ? "blue" : "none"} />
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
