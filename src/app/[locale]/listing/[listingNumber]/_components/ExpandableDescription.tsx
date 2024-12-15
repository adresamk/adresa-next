"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useEffect } from "react";

interface ExpandableDescriptionProps {
  text: string;
  maxHeight: number;
  className?: string;
}

export function ExpandableDescription({
  text,
  maxHeight,
  className,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [height, setHeight] = useState<string>(`${maxHeight}px`);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const t = useTranslations("");

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setShowToggle(scrollHeight > maxHeight);
      setHeight(isExpanded ? `${scrollHeight}px` : `${maxHeight}px`);
    }
  }, [isExpanded, text, maxHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <p
        ref={contentRef}
        className={cn(
          "relative overflow-hidden transition-[height] duration-300 ease-in-out",
          className,
        )}
        style={{ height }}
      >
        {text}
        {!isExpanded && (
          <span className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent transition-all duration-300 ease-in-out"></span>
        )}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={toggleExpand}
          className="mt-2 h-5 text-sm font-semibold text-blue-500 hover:text-blue-700"
        >
          {isExpanded
            ? t("common.actions.showLess")
            : t("common.actions.showMore")}
        </button>
      )}
    </div>
  );
}
