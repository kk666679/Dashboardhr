/**
 * MemoryPanel — Continuous learning & memory panel.
 *
 * Displays:
 *  - Learning events captured from executions
 *  - Recognized patterns
 *  - Active recommendations
 *  - User preferences
 *  - Generated insights for future improvements
 *
 * Integrates with useMemoryStore for state and EventBus for live updates.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemoryStore } from "@/lib/zustand/memory-store";
import {
  BrainCircuitIcon,
  LightbulbIcon,
  TrendingUpIcon,
  RefreshCcwIcon,
  SparklesIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ClockIcon,
  LayersIcon,
  StarIcon,
} from "lucide-react";

export function MemoryPanel() {
  const memory = useMemoryStore();
  const [activeTab, setActiveTab] = useState("recommendations");

  const recommendations = useMemo(
    () => memory.getActiveRecommendations(),
    [memory],
  );
  const patterns = useMemo(
    () => memory.getPatterns(0.6),
    [memory],
  );
  const events = useMemo(
    () => memory.getLearningEvents({ limit: 20 }),
    [memory],
  );
  const preferences = useMemo(
    () => memory.getPreferencesByCategory("workflow"),
    [memory],
  );

  const handleDismiss = useCallback(
    (id: string) => {
      memory.dismissRecommendation(id);
    },
    [memory],
  );

  const handleApply = useCallback(
    (id: string) => {
      memory.markRecommendationApplied(id);
    },
    [memory],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium">Memory & Learning</span>
        </div>
        <Badge variant="outline" className="text-[9px]">
          {recommendations.length} active
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-2">
          <TabsList className="w-full justify-start h-8">
            <TabsTrigger value="recommendations" className="text-xs px-2 py-1">
              <SparklesIcon className="size-3 mr-1" />
              Recommendations
              {recommendations.length > 0 && (
                <Badge variant="default" className="ml-1 text-[9px] px-1 py-0">
                  {recommendations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="patterns" className="text-xs px-2 py-1">
              <TrendingUpIcon className="size-3 mr-1" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs px-2 py-1">
              <LayersIcon className="size-3 mr-1" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="p-3 m-0">
            {recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <LightbulbIcon className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recommendations yet
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Recommendations will appear as the system learns from executions
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="shadow-none">
                    <CardHeader className="p-3 pb-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              rec.type === "optimization"
                                ? "default"
                                : rec.type === "compliance"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[9px] px-1 py-0"
                          >
                            {rec.type}
                          </Badge>
                          <CardTitle className="text-xs">
                            {rec.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-1.5 text-[10px]"
                            onClick={() => handleApply(rec.id)}
                          >
                            <CheckCircle2Icon className="size-3 mr-0.5" />
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-1.5 text-[10px]"
                            onClick={() => handleDismiss(rec.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-[10px] mt-1">
                        {rec.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <StarIcon className="size-2.5" />
                          Confidence: {Math.round(rec.confidence * 100)}%
                        </span>
                        <span className="flex items-center gap-0.5">
                          <ClockIcon className="size-2.5" />
                          {new Date(rec.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="p-3 m-0">
            {patterns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <TrendingUpIcon className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No patterns detected
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Patterns will appear as workflows are executed repeatedly
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {patterns.map((pattern) => (
                  <Card key={pattern.id} className="shadow-none">
                    <CardHeader className="p-3 pb-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            pattern.confidence > 0.8
                              ? "default"
                              : "secondary"
                          }
                          className="text-[9px] px-1 py-0"
                        >
                          {Math.round(pattern.confidence * 100)}%
                        </Badge>
                        <CardTitle className="text-xs">
                          {pattern.pattern}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-[10px] mt-0.5">
                        {pattern.outcome}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>
                          Frequency: {pattern.frequency}x
                        </span>
                        <span>
                          Last:{" "}
                          {new Date(
                            pattern.lastObserved,
                          ).toLocaleDateString()}
                        </span>
                        {pattern.recommendation && (
                          <span className="text-primary">
                            {pattern.recommendation}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="p-3 m-0">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <LayersIcon className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No learning events yet
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Learning events are captured during workflow execution
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 rounded-md border p-2"
                  >
                    <div className="mt-0.5">
                      {event.type === "execution_success" && (
                        <CheckCircle2Icon className="size-3.5 text-green-500" />
                      )}
                      {event.type === "execution_failure" && (
                        <AlertTriangleIcon className="size-3.5 text-red-500" />
                      )}
                      {event.type === "human_correction" && (
                        <RefreshCcwIcon className="size-3.5 text-amber-500" />
                      )}
                      {event.type === "policy_update" && (
                        <LightbulbIcon className="size-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">
                        {event.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {event.context}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground">
                        <span>
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        {event.tags.length > 0 && (
                          <span>{event.tags.join(", ")}</span>
                        )}
                      </div>
                    </div>
                    {event.applied && (
                      <Badge
                        variant="secondary"
                        className="text-[8px] px-1 py-0"
                      >
                        Applied
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

