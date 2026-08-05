"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AssetItem {
  name: string;
  serialNumber?: string | null;
  returned: boolean;
  condition?: string | null;
  [key: string]: unknown;
}

interface AssetListProps {
  items: AssetItem[];
}

export function AssetList({ items }: AssetListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Serial</TableHead>
          <TableHead>Returned</TableHead>
          <TableHead>Condition</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, i) => (
          <TableRow key={i}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.serialNumber || "-"}</TableCell>
            <TableCell>
              <Badge variant={item.returned ? "success" as "default" : "secondary"}>
                {item.returned ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell>{item.condition || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

