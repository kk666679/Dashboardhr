"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText } from "lucide-react";

interface DocumentPreviewProps {
  document: {
    id: string;
    title: string;
    type: string;
    version: string;
    status: "Draft" | "Review" | "Approved" | "Archived";
    date: string;
    summary?: string;
  };
  onDownload?: (id: string) => void;
  onView?: (id: string) => void;
}

export function DocumentPreview({ document, onDownload, onView }: DocumentPreviewProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          <span className="truncate">{document.title}</span>
          <Badge variant={document.status === "Approved" ? "success" : document.status === "Review" ? "warning" : "secondary"}>
            {document.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{document.type}</span>
          <span>v{document.version}</span>
          <span>• {new Date(document.date).toLocaleDateString()}</span>
        </div>
        {document.summary && (
          <p className="text-sm mt-2 line-clamp-2">{document.summary}</p>
        )}
        <div className="flex gap-2 mt-3">
          {onView && (
            <Button size="sm" variant="outline" onClick={() => onView(document.id)}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
          )}
          {onDownload && (
            <Button size="sm" variant="outline" onClick={() => onDownload(document.id)}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
