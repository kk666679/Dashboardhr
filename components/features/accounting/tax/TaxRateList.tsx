import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: "Sales" | "Income" | "Withholding" | "VAT";
  effectiveDate: string;
  status: "Active" | "Inactive";
}

interface TaxRateListProps {
  rates: TaxRate[];
  onDelete?: (id: string) => void;
}

export function TaxRateList({ rates, onDelete }: TaxRateListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Effective</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.name}</TableCell>
            <TableCell>{t.rate}%</TableCell>
            <TableCell>
              <Badge variant="secondary">{t.type}</Badge>
            </TableCell>
            <TableCell>{new Date(t.effectiveDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={t.status === "Active" ? "success" : "secondary"}>
                {t.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(t.id)}>
                  Delete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
