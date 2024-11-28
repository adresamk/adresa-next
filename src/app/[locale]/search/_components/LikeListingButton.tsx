"use client";
import {
  addListingAsFavorite,
  getFavoriteStatus,
  removeListingAsFavorite,
} from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { cn, isLoggedInClient } from "@/lib/utils";
import { Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function LikeListingButton({
  listingId,
  className,
}: {
  listingId: string;
  className?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
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
    // checkFavoriteStatus();
  }, [listingId]);
  return (
    <>
      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('listing.like.loginNeeded')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('listing.like.loginMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              <Link href="/signin">{t('common.signIn')}</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        disabled={isLoading}
        type="button"
        onClick={async (e) => {
          e.preventDefault();
          const isLoggedIn = isLoggedInClient();
          if (!isLoggedIn) {
            setIsAlertOpen(true);
            return;
          }
          if (!isFavorite) {
            const resp = await addListingAsFavorite(listingId);
            if (resp.success) {
              setIsFavorite(true);
            }
          }
          if (isFavorite) {
            const resp = await removeListingAsFavorite(listingId);
            if (resp.success) {
              setIsFavorite(false);
            }
          }
        }}
        variant="ghost"
        className={cn(
          "h-10 w-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue",
          className,
        )}
        title={t('listing.like.toggleFavorite')}
      >
        <Heart fill={isFavorite ? "blue" : "none"} />
      </Button>
    </>
  );
}
