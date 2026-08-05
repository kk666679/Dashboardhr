import { cn } from "@/lib/utils";

interface StepsProps {
  steps: string[];
  current?: number;
  className?: string;
}

export function Steps({ steps, current = 0, className }: StepsProps) {
  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((step, i) => (
        <li key={i} className={cn("text-sm", i === current ? "font-semibold text-primary" : "text-muted-foreground")}>
          {i + 1}. {step}
        </li>
      ))}
    </ol>
  );
}
