"use client";
import {
  addListingAsFavorite,
  removeListingAsFavorite,
} from "@/actions/listings";
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
import Link from "next/link";
export default function LikeListingButton({
  listingId,
  isFavorite,
  className,
}: {
  listingId: string;
  isFavorite: boolean;
  className?: string;
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(isFavorite);
  //test
  useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);
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
        onClick={async (e) => {
          const isLoggedIn = isLoggedInClient();
          if (!isLoggedIn) {
            setIsAlertOpen(true);
            return;
          }
          console.log("is liked");
          // probably show toast with error maybe?
          if (!isLiked) {
            const resp = await addListingAsFavorite(listingId);
            if (resp.success) {
              setIsLiked(true);
            }
          }
          if (isLiked) {
            const resp = await removeListingAsFavorite(listingId);
            if (resp.success) {
              setIsLiked(false);
            }
          }
        }}
        variant="ghost"
        className={cn(
          "h-10 w-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue",
          className,
        )}
      >
        <Heart fill={isLiked ? "blue" : "none"} />
      </Button>
    </>
  );
}
