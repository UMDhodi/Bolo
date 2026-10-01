"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupPrimitiveRoot = ToggleGroupPrimitive.Root as React.ComponentType<any>;
const ToggleGroupPrimitiveItem = ToggleGroupPrimitive.Item as React.ComponentType<any>;

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

type ToggleGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toggleVariants> & {
    type?: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    disabled?: boolean;
    rovingFocus?: boolean;
    loop?: boolean;
    dir?: "ltr" | "rtl";
  };

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, variant, size, children, type = "single", ...props }, ref) => (
    <ToggleGroupPrimitiveRoot
      ref={ref}
      type={type}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitiveRoot>
  ),
);

ToggleGroup.displayName = "ToggleGroup";

type ToggleGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof toggleVariants> & {
    value: string;
    asChild?: boolean;
  };

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, variant, size, value, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    return (
      <ToggleGroupPrimitiveItem
        ref={ref}
        value={value}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitiveItem>
    );
  },
);

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
