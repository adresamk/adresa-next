"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
  defaultText: string;
}

export function SubmitButton({
  loadingText = "Submitting...",
  defaultText,
  disabled,
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      className={className}
      disabled={disabled || pending}
      type="submit"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? loadingText : defaultText}
    </Button>
  );
}
