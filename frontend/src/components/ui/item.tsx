import * as React from "react";

import { cn } from "@/lib/utils";

type ItemVariant = "default" | "outline" | "muted";
type ItemSize = "default" | "sm" | "xs";

type ItemProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  variant?: ItemVariant;
  size?: ItemSize;
};

function Item({ className, variant = "default", size = "default", ...props }: ItemProps) {
  const sizeClasses = {
    default: "gap-5 p-8",
    sm: "gap-4 p-6",
    xs: "gap-3 p-4",
  }[size];

  const variantClasses = {
    default: "bg-card",
    outline: "bg-card border border-border",
    muted: "bg-muted/40 border border-border/60",
  }[variant];

  return (
    <div
      data-slot="item"
      className={cn(
        "flex flex-col rounded-2xl shadow-[0_0_0_1px_hsl(var(--border))]",
        variantClasses,
        sizeClasses,
        className,
      )}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-header" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "icon" | "image" | "avatar";
}) {
  const variantClasses = {
    default: "bg-muted text-foreground",
    icon: "bg-primary/10 text-primary",
    image: "overflow-hidden bg-muted",
    avatar: "overflow-hidden bg-muted",
  }[variant];

  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
        variantClasses,
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-content" className={cn("min-w-0 flex-1 space-y-1", className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-title" className={cn("text-base font-semibold leading-none tracking-tight", className)} {...props} />;
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="item-description" className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />;
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex items-center gap-3 pt-1", className)} {...props} />;
}

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-group" className={cn("flex flex-col gap-3", className)} {...props} />;
}

function ItemSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-separator" className={cn("h-px w-full bg-border", className)} {...props} />;
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-footer" className={cn("pt-1 text-sm text-muted-foreground", className)} {...props} />;
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};