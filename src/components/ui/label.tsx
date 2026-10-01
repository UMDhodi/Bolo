"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const LabelPrimitiveRoot = LabelPrimitive.Root as React.ComponentType<any>;

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, children, ...props }, ref) => (
  <LabelPrimitiveRoot ref={ref} className={cn(labelVariants(), className)} {...props}>
    {children}
  </LabelPrimitiveRoot>
));
Label.displayName = "Label";

export { Label };
