import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  className?: string;
  children?: React.ReactNode;
  innerScroll?: boolean;
  footerJSX?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  className = "",
  children,
  footerJSX,
  innerScroll = false,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} modal onOpenChange={onChange}>
      <DialogContent
        className={cn(
          "overflow-y-auto max-h-[95dvh] transition-all duration-700",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div
          className={cn(
            "border-t border-b py-2  overflow-y-auto",
            innerScroll && "max-h-[calc(95dvh-150px)]"
          )}
        >
          {children}
        </div>
        {(onConfirm || footerJSX) && (
          <DialogFooter>
            {footerJSX ? (
              footerJSX
            ) : (
              <Button type="submit" onClick={onConfirm}>
                Save
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
