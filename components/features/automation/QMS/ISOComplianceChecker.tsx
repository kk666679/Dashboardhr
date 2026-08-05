"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ComplianceItem {
  id: string;
  requirement: string;
  status: "compliant" | "non-compliant" | "partial";
  evidence?: string;
}

interface ISOComplianceCheckerProps {
  items: ComplianceItem[];
  onUpdate?: (id: string, status: string) => void;
}

export function ISOComplianceChecker({ items, onUpdate }: ISOComplianceCheckerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ISO Compliance Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                selected === item.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelected(item.id)}
            >
              <div className="flex-1">
                <p className="text-sm">{item.requirement}</p>
                {item.evidence && (
                  <p className="text-xs text-muted-foreground">Evidence: {item.evidence}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {item.status === "compliant" && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Compliant
                  </Badge>
                )}
                {item.status === "non-compliant" && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Non-Compliant
                  </Badge>
                )}
                {item.status === "partial" && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Partial
                  </Badge>
                )}
                {onUpdate && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open dialog to update status
                    }}
                  >
                    Update
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
