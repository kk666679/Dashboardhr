"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Offer {
  id: string;
  candidate: string;
  job: string;
  salary: number;
  startDate: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Signed";
}

interface OfferLetterProps {
  offers: Offer[];
  onSend?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export function OfferLetter({ offers, onSend, onStatusChange }: OfferLetterProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Offer Letters</h2>
        <Button onClick={() => setOpen(true)}>Create Offer</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {offers.map((o) => (
              <div key={o.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{o.candidate}</p>
                  <p className="text-sm text-muted-foreground">{o.job}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={o.status === "Accepted" || o.status === "Signed" ? "default" : o.status === "Sent" ? "secondary" : "outline"}>
                      {o.status}
                    </Badge>
                    <span className="text-sm">RM {o.salary}</span>
                    <span className="text-sm">Start: {new Date(o.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {o.status === "Draft" && onSend && (
                    <Button size="sm" onClick={() => onSend(o.id)}>Send</Button>
                  )}
                  {o.status === "Sent" && onStatusChange && (
                    <>
                      <Button size="sm" variant="default" onClick={() => onStatusChange(o.id, "Accepted")}>
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onStatusChange(o.id, "Rejected")}>
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Offer Letter</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="candidate">Candidate</Label>
              <Input id="candidate" placeholder="Enter candidate name" />
            </div>
            <div>
              <Label htmlFor="job">Job Position</Label>
              <Input id="job" placeholder="Enter job title" />
            </div>
            <div>
              <Label htmlFor="salary">Salary (RM)</Label>
              <Input id="salary" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional terms..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
