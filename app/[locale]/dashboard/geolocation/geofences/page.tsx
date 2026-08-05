"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { KpiCardGrid } from "@/components/modules/common/KpiCardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Shield,
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const GEOFENCE_TYPE_MAP: Record<string, { label: string; icon: any; color: string }> = {
  worksite: { label: "Worksite", icon: Building, color: "text-blue-600 bg-blue-100" },
  restricted: { label: "Restricted", icon: Shield, color: "text-red-600 bg-red-100" },
  accommodation: { label: "Accommodation", icon: Users, color: "text-green-600 bg-green-100" },
  custom: { label: "Custom", icon: MapPin, color: "text-purple-600 bg-purple-100" },
};

export default function GeofencesPage() {
  const { useGeofences, createGeofenceMutation, updateGeofenceMutation, deleteGeofenceMutation, toggleGeofenceMutation } = useGeolocation();
  const { data: geofences, isLoading } = useGeofences();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "worksite" as string,
    lat: 3.139,
    lng: 101.687,
    radius: 100,
    alertOnEntry: false,
    alertOnExit: true,
  });

  const handleCreate = async () => {
    try {
      await createGeofenceMutation.mutateAsync({
        name: formData.name,
        type: formData.type as any,
        coordinates: [[formData.lat, formData.lng], [formData.lat + 0.002, formData.lng], [formData.lat + 0.002, formData.lng + 0.002], [formData.lat, formData.lng + 0.002]] as any,
        radius: formData.radius,
        alertOnEntry: formData.alertOnEntry,
        alertOnExit: formData.alertOnExit,
      });
      setDialogOpen(false);
      setFormData({ name: "", type: "worksite", lat: 3.139, lng: 101.687, radius: 100, alertOnEntry: false, alertOnExit: true });
    } catch (e) {
      console.error("Failed to create geofence:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this geofence?")) {
      await deleteGeofenceMutation.mutateAsync({ id });
    }
  };

  const handleToggle = async (id: string) => {
    await toggleGeofenceMutation.mutateAsync({ id });
  };

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader title="Geofence Manager" description="Loading..." />
        <Skeleton className="h-64 w-full rounded-xl" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Geofence Manager"
        description="Create and manage location boundaries, restricted zones, and automated alerts"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Geofence
          </Button>
        }
      />

      {/* Stats */}
      <KpiCardGrid
        columns={4}
        items={[
          {
            label: "Total Geofences",
            value: geofences?.length ?? 0,
            icon: <MapPin className="h-4 w-4" />,
            color: "text-purple-600",
          },
          {
            label: "Active",
            value: geofences?.filter((g: any) => g.isActive).length ?? 0,
            icon: <CheckCircle className="h-4 w-4" />,
            color: "text-green-600",
          },
          {
            label: "Alert on Exit",
            value: geofences?.filter((g: any) => g.alertOnExit).length ?? 0,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: "text-orange-600",
          },
          {
            label: "Alert on Entry",
            value: geofences?.filter((g: any) => g.alertOnEntry).length ?? 0,
            icon: <Shield className="h-4 w-4" />,
            color: "text-red-600",
          },
        ]}
      />

      {/* Geofences Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Radius</TableHead>
                <TableHead>Alert On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geofences?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No geofences created yet. Click "Add Geofence" to create one.
                  </TableCell>
                </TableRow>
              )}
              {geofences?.map((g: any) => {
                const typeInfo = GEOFENCE_TYPE_MAP[g.type] ?? GEOFENCE_TYPE_MAP.custom;
                const coords = g.coordinates as Array<[number, number]>;
                return (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${typeInfo.color}`}>
                        <typeInfo.icon className="h-3 w-3" />
                        {typeInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {coords?.[0]?.[0]?.toFixed(4)}, {coords?.[0]?.[1]?.toFixed(4)}
                    </TableCell>
                    <TableCell>{g.radius ? `${g.radius}m` : "Polygon"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {g.alertOnExit && <Badge variant="outline" className="text-[10px]">Exit</Badge>}
                        {g.alertOnEntry && <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700">Entry</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={g.isActive ? "default" : "secondary"} className="text-xs">
                        {g.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleToggle(g.id)} title={g.isActive ? "Deactivate" : "Activate"}>
                          {g.isActive ? <ToggleRight className="h-3.5 w-3.5 text-green-600" /> : <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => handleDelete(g.id)} title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Geofence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Construction Site A"
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="worksite">Worksite</option>
                <option value="restricted">Restricted</option>
                <option value="accommodation">Accommodation</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Center Latitude</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.lat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lat: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Center Longitude</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.lng}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lng: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
            <div>
              <Label>Radius (meters, 0 for polygon)</Label>
              <Input
                type="number"
                value={formData.radius}
                onChange={(e) => setFormData((prev) => ({ ...prev, radius: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.alertOnExit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alertOnExit: e.target.checked }))}
                />
                Alert on Exit
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.alertOnEntry}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alertOnEntry: e.target.checked }))}
                />
                Alert on Entry
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!formData.name}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

