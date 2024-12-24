"use client";
import {
  addListingAsFavorite,
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
  isLiked = false,
}: {
  listingId: number;
  className?: string;
  isLiked?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { withAuthCheck, AuthDialog } = useAuthGuard();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isLiked);

  useEffect(() => {
    setIsFavorite(isLiked);
  }, [isLiked]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await withAuthCheck(async () => {
      setIsLoading(true);
      const resp = isFavorite
        ? await removeListingAsFavorite(listingId)
        : await addListingAsFavorite(listingId);
      if (resp.success) {
        setIsFavorite(!isFavorite);
      }
      setIsLoading(false);
    });
  };

  return (
    <>
      <AuthDialog />
      <Button
        disabled={isLoading}
        type="button"
        onClick={handleClick}
        variant="ghost"
        size="icon"
        className={cn("h-10 w-10", className)}
        title={t("listing.like.toggleFavorite")}
      >
        <Heart
          className={cn("h-5 w-5 text-blue-500")}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </Button>
    </>
  );
}
