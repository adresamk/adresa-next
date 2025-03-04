import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "text-s my-0.5 flex h-11 w-full rounded border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-9",
          "rounded-lg border-0 text-base text-brand-black shadow-sm ring-1 ring-slate-300 placeholder:text-brand-black-muted focus:ring-2 focus:ring-brand-light-blue sm:leading-6 md:text-base",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
