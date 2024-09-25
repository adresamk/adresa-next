"use client";
import {
  addListingAsFavorite,
  removeListingAsFavorite,
} from "@/actions/listings";
import { Button } from "@/components/ui/button";
import { isLoggedInClient } from "@/lib/utils";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
export default function LikeListingButton({
  listingId,
  isFavorite,
}: {
  listingId: string;
  isFavorite: boolean;
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
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
            <AlertDialogAction>
              <Link href="/signin?redirect=/search">Sign in</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();

          const isLoggedIn = isLoggedInClient();
          if (!isLoggedIn) {
            setIsAlertOpen(true);
            return;
          }

          if (!isFavorite) {
            await addListingAsFavorite(listingId);
          }
          if (isFavorite) {
            await removeListingAsFavorite(listingId);
          }
        }}
        variant="ghost"
        className="w-10 h-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue"
      >
        <Heart fill={!isFavorite ? "blue" : "none"} />
      </Button>
    </>
  );
}
