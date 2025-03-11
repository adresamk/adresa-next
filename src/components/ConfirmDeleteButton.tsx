"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { EllipsisVerticalIcon, Loader2Icon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDeleteButtonProps {
  onDelete: () => void;
  icon?: ReactNode;
  deleteText?: string;
  deletingText?: string;
  triggerIcon?: ReactNode;
  className?: string;
}

export function ConfirmDeleteButton({
  onDelete,
  icon,
  triggerIcon,
  deleteText = "",
  deletingText = "",
  className,
}: ConfirmDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultTriggerIcon = <EllipsisVerticalIcon className="h-4 w-4" />;
  const defaultDeleteIcon = <Trash className="h-4 w-4 text-red-500" />;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          {triggerIcon || defaultTriggerIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="w-44 rounded-md bg-white p-2 shadow-md"
        asChild
      >
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center justify-between gap-2 px-2",
            !deleteText && "w-full rounded-full",
            deleteText && "w-fit",
            className,
          )}
          onClick={() => {
            setIsDeleting(true);
            onDelete();
          }}
        >
          {icon || defaultDeleteIcon} {}{" "}
          {isDeleting ? (
            deletingText ? (
              deleteText
            ) : (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            )
          ) : (
            deleteText
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
