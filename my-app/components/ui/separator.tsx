import * as React from "react";

import { cn } from "@/lib/utils";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        aria-hidden={decorative ? "true" : undefined}
        className={cn(
          "bg-border",
          isVertical ? "h-full w-px" : "h-px w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";

export { Separator };
