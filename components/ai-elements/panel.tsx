import { cn } from "@/lib/utils";
import { Panel as PanelPrimitive } from "@xyflow/react";
import type { ComponentProps, HTMLAttributes } from "react";

type PanelProps = ComponentProps<typeof PanelPrimitive>;

export const Panel = ({ className, ...props }: PanelProps) => (
  <PanelPrimitive
    className={cn(
      "m-4 overflow-hidden rounded-md border bg-card p-1",
      className,
    )}
    {...props}
  />
);

type PanelSectionProps = HTMLAttributes<HTMLDivElement>;

export const PanelHeader = ({ className, ...props }: PanelSectionProps) => (
  <div className={cn("flex flex-col gap-1 p-4 pb-2", className)} {...props} />
);

export const PanelTitle = ({ className, ...props }: PanelSectionProps) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

export const PanelDescription = ({ className, ...props }: PanelSectionProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const PanelContent = ({ className, ...props }: PanelSectionProps) => (
  <div className={cn("p-4 pt-2", className)} {...props} />
);

export const PanelActions = ({ className, ...props }: PanelSectionProps) => (
  <div className={cn("flex items-center gap-2", className)} {...props} />
);
