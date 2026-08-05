"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface KnowledgeTransferProps {
  plan?: string;
  summary?: string;
  owners?: string[];
  attachments?: string[];
  onSave?: (data: unknown) => void;
}

export function KnowledgeTransfer({ plan, summary, owners = [], attachments = [], onSave }: KnowledgeTransferProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ plan, summary, owners, attachments });

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Knowledge Transfer</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="text-sm font-medium">KT Plan</label>
              <Textarea
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                placeholder="Describe the knowledge transfer plan..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Summary of transferred knowledge..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Owners (comma separated)</label>
              <Input
                value={formData.owners.join(", ")}
                onChange={(e) => setFormData({ ...formData, owners: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Attachments</label>
              <Input
                value={formData.attachments.join(", ")}
                onChange={(e) => setFormData({ ...formData, attachments: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                placeholder="File URLs"
              />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <>
            {plan && (
              <div>
                <h4 className="text-sm font-medium">Plan</h4>
                <p className="text-sm">{plan}</p>
              </div>
            )}
            {summary && (
              <div>
                <h4 className="text-sm font-medium">Summary</h4>
                <p className="text-sm">{summary}</p>
              </div>
            )}
            {owners.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Owners</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {owners.map((o) => (
                    <Badge key={o} variant="secondary">{o}</Badge>
                  ))}
                </div>
              </div>
            )}
            {attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Attachments</h4>
                <ul className="list-disc list-inside text-sm">
                  {attachments.map((a, i) => (
                    <li key={i}>
                      <a href={a} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {a}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
