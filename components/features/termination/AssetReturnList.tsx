import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  returned: boolean;
  condition: string;
}

interface AssetReturnListProps {
  assets: Asset[];
  onToggleReturn?: (id: string) => void;
}

export function AssetReturnList({ assets, onToggleReturn }: AssetReturnListProps) {
  const allReturned = assets.every(a => a.returned);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          {assets.filter(a => a.returned).length} of {assets.length} returned
        </span>
        {allReturned && (
          <Badge variant="success">All Assets Returned</Badge>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Returned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.name}</TableCell>
              <TableCell className="font-mono text-xs">{a.serialNumber}</TableCell>
              <TableCell>{a.condition}</TableCell>
              <TableCell>
                <Checkbox
                  checked={a.returned}
                  onCheckedChange={() => onToggleReturn?.(a.id)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
