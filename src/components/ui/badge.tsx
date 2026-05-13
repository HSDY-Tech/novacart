import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", {
  variants: { variant: {
    default: "bg-primary text-white",
    accent: "bg-accent/10 text-accent",
    outline: "border border-border text-foreground",
    success: "bg-emerald-50 text-emerald-700",
    secondary: "bg-secondary text-secondary-foreground"
  }},
  defaultVariants: { variant: "secondary" }
});
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
