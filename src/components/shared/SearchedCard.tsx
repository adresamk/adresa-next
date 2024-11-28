'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Bell, Heart } from "lucide-react";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();

  return (
    <div>
      <Card className="max-w-[325px]">
        <CardHeader className="relative p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
                + {search.filters.length - 2} {t('common.search.more')}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-2">
          <p className="text-sm">{search.location}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 pb-3">
          <div>
            <p>{search.results} {t('common.search.results')}</p>
            <p className="text-brand-light-blue">{search.newResults} {t('common.search.new')}</p>
          </div>
          <span className="ml-auto flex flex-col items-center">
            <Bell fill={search.isSaved ? "blue" : "none"} />
            {search.isSaved ? t('common.actions.saved') : t('common.actions.save')}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
