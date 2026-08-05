import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Geofence {
  id: string;
  name: string;
  type: "Circle" | "Polygon";
  center: { lat: number; lng: number };
  radius: number;
  polygon?: { lat: number; lng: number }[];
  status: "Active" | "Inactive";
  users: number;
}

interface GeofenceManagerProps {
  geofences: Geofence[];
  onAdd?: (data: unknown) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  onGeofenceClick?: (geofence: Geofence) => void;
}

export function GeofenceManager({ geofences, onAdd, onDelete, onToggle }: GeofenceManagerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Circle" as "Circle" | "Polygon",
    lat: 0,
    lng: 0,
    radius: 100,
  });

  const handleSubmit = () => {
    toast({ title: "Geofence created" });
    onAdd?.(formData);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Geofences</h3>
        <Button size="sm" onClick={() => setOpen(true)}>Add Geofence</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Center</TableHead>
            <TableHead>Radius</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {geofences.map((g) => (
            <TableRow key={g.id}>
              <TableCell>{g.name}</TableCell>
              <TableCell>{g.type}</TableCell>
              <TableCell>{g.center.lat.toFixed(4)}, {g.center.lng.toFixed(4)}</TableCell>
              <TableCell>{g.radius}m</TableCell>
              <TableCell>{g.users}</TableCell>
              <TableCell>
                <Badge variant={g.status === "Active" ? "success" : "secondary"}>
                  {g.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onToggle?.(g.id)}>
                  {g.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete?.(g.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Geofence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "Circle" | "Polygon" })}
              >
                <option value="Circle">Circle</option>
                <option value="Polygon">Polygon</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Radius (meters)</Label>
              <Input
                type="number"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
