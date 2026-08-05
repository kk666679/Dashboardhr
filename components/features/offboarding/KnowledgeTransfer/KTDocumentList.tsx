"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface KTDocumentListProps {
  attachments: string[];
  documentLinks: string[];
}

export function KTDocumentList({ attachments, documentLinks }: KTDocumentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Transfer Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attachments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium">Attachments</h4>
            <ul className="list-disc list-inside">
              {attachments.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url.split("/").pop() || `Attachment ${i+1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {documentLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium">Document Links</h4>
            <ul className="list-disc list-inside">
              {documentLinks.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
