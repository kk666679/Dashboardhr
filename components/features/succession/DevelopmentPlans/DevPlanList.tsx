"use client";

interface DevPlanData {
  id: string;
  title: string;
  description?: string;
  status?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  employeeId?: string;
  [key: string]: unknown;
}

interface DevPlanListProps {
  plans: DevPlanData[];
  onSelect?: (plan: DevPlanData) => void;
}

export function DevPlanList({ plans, onSelect }: DevPlanListProps) {
  return (
    <div className="space-y-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="p-3 border rounded cursor-pointer hover:bg-accent"
          onClick={() => onSelect?.(plan)}
        >
          <p className="font-medium">{plan.title}</p>
          <p className="text-sm text-muted-foreground">{plan.description || "-"}</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-secondary px-2 py-0.5 rounded">{plan.status || "Active"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

