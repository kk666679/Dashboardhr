"use client";

interface StepsProps {
  steps: { label: string; status: string }[];
}

function Steps({ steps }: StepsProps) {
  const statusOrder = ["inactive", "active", "complete"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`h-2 w-2 rounded-full ${
            step.status === "complete" ? "bg-green-500" :
            step.status === "active" ? "bg-blue-500" : "bg-gray-300"
          }`} />
          <span className="text-xs text-muted-foreground">{step.label}</span>
          {i < steps.length - 1 && <div className="h-px w-4 bg-gray-300" />}
        </div>
      ))}
    </div>
  );
}

interface ClearanceProgressProps {
  instance: { id: string; status?: string; completed: boolean; [key: string]: unknown };
}

export function ClearanceProgress({ instance }: ClearanceProgressProps) {
  const status = (instance as any).status || (instance.completed ? "COMPLETED" : "PENDING");
  const steps = [
    { label: "Pending", status: status === "PENDING" ? "active" as const : "complete" as const },
    { label: "In Progress", status: status === "IN_PROGRESS" ? "active" as const : status === "COMPLETED" ? "complete" as const : "inactive" as const },
    { label: "Completed", status: status === "COMPLETED" ? "complete" as const : "inactive" as const },
  ];

  return <Steps steps={steps} />;
}
