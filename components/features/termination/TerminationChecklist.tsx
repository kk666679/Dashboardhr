import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  required: boolean;
  assignedTo: string;
}

interface TerminationChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export function TerminationChecklist({ items, onToggle }: TerminationChecklistProps) {
  const completed = items.filter(i => i.completed).length;
  const total = items.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Termination Checklist</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{completed}/{total}</span>
            <Progress value={progress} className="w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => onToggle(item.id)}
                />
                <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                  {item.name}
                </span>
                {item.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{item.assignedTo}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
