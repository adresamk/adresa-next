// ShareListingButton.tsx
"use client";

import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface ShareListingButtonProps {
  listing: Listing;
}

export default function ShareListingButton({
  listing,
}: ShareListingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("");

  const shareUrl = `https://adresa-next.vercel.app/listing/${listing.listingNumber}`;

  // Create sharing text with listing details
  const shareTitle = `${listing.title} - ${listing.price}€`;
  const shareDescription = `${listing.area}m² ${listing.transactionType} in ${listing.municipality}, ${listing.place}`;

  const shareOptions = [
    {
      name: "Facebook",
      icon: "/assets/facebook.svg",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: "/assets/twitter.svg",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle} - ${shareDescription}`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: "/assets/linkedin.svg",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`,
    },
    {
      name: "WhatsApp",
      icon: "/assets/whatsapp.svg",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${shareDescription}\n\n${shareUrl}`)}`,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <Button
        size="icon"
        title={t("listing.actions.share")}
        variant="outline"
        className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        onClick={() => setIsOpen(true)}
      >
        <Share2 />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <h2 className="mb-6 text-center text-2xl font-semibold">
              {t("listing.actions.share")}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className="flex h-14 items-center justify-center gap-2"
                  onClick={() => {
                    window.open(option.url, "_blank");
                    setIsOpen(false);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={option.icon}
                    alt={option.name}
                    className="h-6 w-6"
                  />
                  <span>{option.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
