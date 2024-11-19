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
export default function LikeListingButton({
  listingId,
  className,
}: {
  listingId: string;
  className?: string;
}) {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      <AlertDialog open={isAlertOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login needed</AlertDialogTitle>
            <AlertDialogDescription>
              This action requires you to be logged in first
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              <Link href="/signin">Sign in</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        disabled={isLoading}
        onClick={async (e) => {
          const isLoggedIn = isLoggedInClient();
          if (!isLoggedIn) {
            setIsAlertOpen(true);
            return;
          }
          // probably show toast with error maybe?
          if (!isFavorite) {
            const resp = await addListingAsFavorite(listingId);
            router.refresh();
            if (resp.success) {
              setIsFavorite(true);
            }
          }
          if (isFavorite) {
            const resp = await removeListingAsFavorite(listingId);
            if (resp.success) {
              setIsFavorite(false);
              // router.refresh();
            }
          }
          // we need to call this so that it can update in all places for the liked version
          // this is costly so becareful with this
        }}
        variant="ghost"
        className={cn(
          "h-10 w-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue",
          className,
        )}
      >
        <Heart fill={isFavorite ? "blue" : "none"} />
      </Button>
    </>
  );
}
