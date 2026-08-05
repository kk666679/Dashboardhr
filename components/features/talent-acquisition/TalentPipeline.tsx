"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Candidate {
  id: string;
  name: string;
  job: string;
  stage: string;
}

interface TalentPipelineProps {
  candidates: Candidate[];
  stages: string[];
  onMove: (candidateId: string, newStage: string) => void;
}

export function TalentPipeline({ candidates, stages, onMove }: TalentPipelineProps) {
  const { toast } = useToast();

  const getCandidatesByStage = (stage: string) => {
    return candidates.filter(c => c.stage === stage);
  };

  const handleMove = (candidateId: string, newStage: string) => {
    onMove(candidateId, newStage);
    toast({ title: `Moved to ${newStage}` });
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {stages.map((stage) => (
        <Card key={stage}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex justify-between">
              {stage}
              <Badge variant="secondary">{getCandidatesByStage(stage).length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] space-y-2">
              {getCandidatesByStage(stage).map((c) => (
                <div
                  key={c.id}
                  className="p-2 bg-background border rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    const nextStageIndex = stages.indexOf(stage) + 1;
                    if (nextStageIndex < stages.length) {
                      handleMove(c.id, stages[nextStageIndex]);
                    }
                  }}
                >
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.job}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
