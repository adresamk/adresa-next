"use client";

import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogContent } from "../ui/dialog";
import { useRouter } from "next/navigation";

export function Modal2({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-black/70">
        <DialogContent className="overflow-y-hidden">
          <DialogTitle className="hidden"> </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
