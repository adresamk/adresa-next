import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import React from "react";

interface CustomFigureProps {
  baseImageName: string;
  overlayImageName: string;
  altText: string;
  tags: string[];
}

function CustomFigure({
  baseImageName,
  overlayImageName,
  altText,
  tags,
}: CustomFigureProps) {
  const t = useTranslations();
  return (
    <figure className="relative order-1 max-h-[194px] max-w-[318px] bg-slate-100">
      <picture>
        <source
          srcSet={`/assets/${baseImageName}.webp`}
          width={318}
          height={194}
          type="image/webp"
        />
        <img
          src={`/assets/${baseImageName}.png`}
          width={318}
          height={194}
          alt={altText}
          loading="lazy"
          className="max-h-[194px] object-cover"
        />
      </picture>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width={318}
        height={194}
        src={`/assets/${overlayImageName}.webp`}
        alt={altText}
        className="absolute inset-0 max-h-[194px] max-w-full object-cover"
      />
      <figcaption className="hidden">{altText}</figcaption>
      <div className="absolute bottom-1.5 left-1.5 flex gap-0.5">
        {tags[0] && (
          <span className="m-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm bg-white px-2 py-1 text-xs font-semibold text-[#6f7178] shadow-sm transition-all duration-200 ease-linear">
            {tags[0]}
          </span>
        )}

        {tags[1] && (
          <span className="m-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm bg-white px-2 py-1 text-xs font-semibold text-[#6f7178] shadow-sm transition-all duration-200 ease-linear">
            {tags[1]}
          </span>
        )}

        {tags.length <= 3 && tags[2] && (
          <span className="m-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm bg-white px-2 py-1 text-xs font-semibold text-[#6f7178] shadow-sm transition-all duration-200 ease-linear">
            {tags[2]}
          </span>
        )}

        {tags.length > 3 && (
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <span className="relative z-30 m-0.5 min-w-[1px] flex-shrink-0 cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm bg-white px-2 py-1 text-xs font-semibold text-[#6f7178] shadow-sm transition-all duration-200 ease-linear">
                + {tags.length - 2}{" "}
                {tags.length > 3
                  ? t("savedSearches.moreCriteria")
                  : t("savedSearches.criteria")}
              </span>
            </HoverCardTrigger>
            <HoverCardContent side="top" align="start" className="p-1.5">
              <div className="flex max-w-[220px] flex-wrap">
                {tags.slice(2).map((tag) => (
                  <span
                    className="m-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm border border-slate-100 bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-lg transition-all duration-200 ease-linear"
                    key={tag}
                  >
                    {/* Need to translate tags and add custom tags depending on search filter */}
                    {tag}
                  </span>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    </figure>
  );
}

export default CustomFigure;
