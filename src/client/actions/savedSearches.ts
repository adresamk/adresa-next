import { writeToLocalStorage, readFromLocalStorage } from "@/lib/utils";

const MAX_PROMO_SHOWS = 5;

export function markPromoDialogAsSeen() {
  console.log("promo is seen");
  const currentCount = readFromLocalStorage("savedSearchPromoDialogSeen") || 0;
  const newCount = Math.min(currentCount + 1, MAX_PROMO_SHOWS);
  writeToLocalStorage("savedSearchPromoDialogSeen", newCount);
}

export function shouldShowPromoDialog() {
  const seenCount = readFromLocalStorage("savedSearchPromoDialogSeen") || 0;
  return seenCount < MAX_PROMO_SHOWS;
}
