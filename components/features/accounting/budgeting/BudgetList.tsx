import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Budget {
  id: string;
  name: string;
  category: string;
  totalBudget: number;
  actual: number;
  remaining: number;
  period: string;
  status: "Active" | "Closed" | "Draft";
}

interface BudgetListProps {
  budgets: Budget[];
  onDelete?: (id: string) => void;
}

export function BudgetList({ budgets, onDelete }: BudgetListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actual</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((b) => {
          const percent = b.totalBudget ? Math.round((b.actual / b.totalBudget) * 100) : 0;
          return (
            <TableRow key={b.id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.category}</TableCell>
              <TableCell>{b.totalBudget}</TableCell>
              <TableCell>{b.actual}</TableCell>
              <TableCell>{b.remaining}</TableCell>
              <TableCell className="w-32">
                <Progress value={percent} className="h-2" />
              </TableCell>
              <TableCell>{b.period}</TableCell>
              <TableCell>
                <Badge variant={b.status === "Active" ? "success" : b.status === "Draft" ? "secondary" : "warning"}>
                  {b.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm">View</Button>
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(b.id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
