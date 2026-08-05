import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Integration {
  id: string;
  name: string;
  platform: string;
  logo: string; // path to SVG in public/platform-logo-svg
  status: "Connected" | "Disconnected" | "Error";
  lastSync: string;
  actions?: string;
}

interface IntegrationListProps {
  integrations: Integration[];
  onDelete?: (id: string) => void;
}

export function IntegrationList({ integrations, onDelete }: IntegrationListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Platform</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Sync</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {integrations.map((i) => (
          <TableRow key={i.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={`/platform-logo-svg/${i.logo}`}
                    alt={i.platform}
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{i.platform}</span>
              </div>
            </TableCell>
            <TableCell>{i.name}</TableCell>
            <TableCell>
              <Badge variant={i.status === "Connected" ? "success" : i.status === "Error" ? "destructive" : "secondary"}>
                {i.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(i.lastSync).toLocaleString()}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/integrations/${i.id}`)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/integrations/${i.id}/edit`)}>Edit</Button>
              <Button variant="outline" size="sm">Sync</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(i.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
