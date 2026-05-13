// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-accent/10 disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
