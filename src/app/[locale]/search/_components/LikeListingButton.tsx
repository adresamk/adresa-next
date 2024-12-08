"use client";
import {
  addListingAsFavorite,
  getFavoriteStatus,
  removeListingAsFavorite,
} from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LikeListingButton({
  listingId,
  className,
}: {
  listingId: number;
  className?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { withAuthCheck, AuthDialog } = useAuthGuard();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function checkFavoriteStatus() {
      setIsLoading(true);
      try {
        const isFavorited = await getFavoriteStatus(listingId);
        setIsFavorite(isFavorited);
      } catch (error) {
        console.error("Failed to check favorite status:", error);
        setIsFavorite(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkFavoriteStatus();
  }, [listingId]);

  return (
    <>
      <AuthDialog />
      <Button
        disabled={isLoading}
        type="button"
        onClick={async (e) => {
          e.preventDefault();
          await withAuthCheck(async () => {
            if (!isFavorite) {
              const resp = await addListingAsFavorite(listingId);
              if (resp.success) {
                setIsFavorite(true);
              }
            } else {
              const resp = await removeListingAsFavorite(listingId);
              if (resp.success) {
                setIsFavorite(false);
              }
            }
          });
        }}
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", className)}
        title={t("listing.like.toggleFavorite")}
      >
        <Heart
          className={cn("h-5 w-5", {
            "fill-blue": isFavorite,
          })}
        />
      </Button>
    </>
  );
}
