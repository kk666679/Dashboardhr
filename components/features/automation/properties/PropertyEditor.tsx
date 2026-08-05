"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Node, Edge } from "@xyflow/react";

interface PropertyEditorProps {
  element: Node | Edge;
  type: "node" | "edge";
  onUpdate: (data: unknown) => void;
}

export function PropertyEditor({ element, type, onUpdate }: PropertyEditorProps) {
  const [data, setData] = useState<any>(element.data || {});

  useEffect(() => {
    setData(element.data || {});
  }, [element]);

  const handleChange = (field: string, value: unknown) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate(newData);
  };

  // Common fields for both nodes and edges
  const commonFields = (
    <>
      <div className="space-y-1">
        <Label htmlFor="label" className="text-xs">Label</Label>
        <Input
          id="label"
          value={data.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
          className="h-8 text-sm"
          placeholder="Enter label"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="description" className="text-xs">Description</Label>
        <Textarea
          id="description"
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="text-sm"
          placeholder="Enter description"
          rows={2}
        />
      </div>
    </>
  );

  // Node-specific fields
  const nodeFields = (
    <>
      <div className="space-y-1">
        <Label htmlFor="type" className="text-xs">Node Type</Label>
        <div className="text-sm px-2 py-1 bg-muted rounded">{element.type}</div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="status" className="text-xs">Status</Label>
        <Select
          value={data.status || "idle"}
          onValueChange={(v) => handleChange("status", v)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="position" className="text-xs">Position</Label>
        <div className="grid grid-cols-2 gap-1">
          <Input
            type="number"
            value={type === "node" ? ((element as Node).position?.x ?? 0) : 0}
            disabled
            className="h-8 text-sm"
            placeholder="X"
          />
          <Input
            type="number"
            value={type === "node" ? ((element as Node).position?.y ?? 0) : 0}
            disabled
            className="h-8 text-sm"
            placeholder="Y"
          />
        </div>
      </div>
      {element.type === "decision" && (
        <div className="space-y-1">
          <Label htmlFor="condition" className="text-xs">Condition</Label>
          <Input
            id="condition"
            value={data.condition || ""}
            onChange={(e) => handleChange("condition", e.target.value)}
            className="h-8 text-sm"
            placeholder="e.g., status === 'approved'"
          />
        </div>
      )}
      {element.type === "action" && (
        <div className="space-y-1">
          <Label htmlFor="actionType" className="text-xs">Action Type</Label>
          <Input
            id="actionType"
            value={data.actionType || ""}
            onChange={(e) => handleChange("actionType", e.target.value)}
            className="h-8 text-sm"
            placeholder="e.g., send-email, http-request"
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Label htmlFor="disabled" className="text-xs">Disabled</Label>
        <Switch
          id="disabled"
          checked={data.disabled || false}
          onCheckedChange={(v) => handleChange("disabled", v)}
        />
      </div>
    </>
  );

  // Edge-specific fields
  const edgeFields = (
    <>
      <div className="space-y-1">
        <Label htmlFor="source" className="text-xs">Source Node</Label>
        <div className="text-sm px-2 py-1 bg-muted rounded">{(element as Edge).source}</div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="target" className="text-xs">Target Node</Label>
        <div className="text-sm px-2 py-1 bg-muted rounded">{(element as Edge).target}</div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="edgeStatus" className="text-xs">Status</Label>
        <Select
          value={data.status || "pending"}
          onValueChange={(v) => handleChange("status", v)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="animated" className="text-xs">Animated</Label>
        <Switch
          id="animated"
          checked={data.animated || false}
          onCheckedChange={(v) => handleChange("animated", v)}
        />
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {commonFields}
      {type === "node" ? nodeFields : edgeFields}
    </div>
  );
}
