import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Heart } from "lucide-react";

type SearchCardType = {
  id: number;
  images: string[];
  results: number;
  newResults: number;
  filters: string[];
  location: string;
  isSaved: boolean;
};

export default function SearchedCard({ search }: { search: SearchCardType }) {
  return (
    <div>
      <Card className="max-w-[325px]">
        <CardHeader className="relative p-0">
          <img src={search?.images?.[0]} className="w-full" alt="" />
          <div className="absolute bottom-2 left-2 flex gap-1 text-[10px]">
            <span
              key={search.filters[0]}
              className="rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
            >
              {search.filters[0]}
            </span>
            <span
              key={search.filters[1]}
              className="rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
            >
              {search.filters[1]}
            </span>
            {search.filters.length === 3 && (
              <span
                key={search.filters[2]}
                className="rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
              >
                {search.filters[2]}
              </span>
            )}
            {search.filters.length > 3 && (
              <span
                key={search.filters[3]}
                className="rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
              >
                + {search.filters.length - 2} more
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-2">
          <p className="text-sm">{search.location}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 pb-3">
          <div>
            <p>{search.results} results</p>
            <p className="text-brand-light-blue">{search.newResults} new</p>
          </div>
          <span className="ml-auto flex flex-col items-center">
            <Bell fill={search.isSaved ? "blue" : "none"} />
            {search.isSaved ? "saved" : "save"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
