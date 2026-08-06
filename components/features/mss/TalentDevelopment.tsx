"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, ArrowRight, Star, Users, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NINE_BOX = [
  { name: "Ahmad Razif", performance: "high", potential: "high", label: "Star" },
  { name: "Siti Norzahra", performance: "high", potential: "medium", label: "Core Player" },
  { name: "Ravi Kumar", performance: "medium", potential: "high", label: "High Potential" },
  { name: "Nurul Ain", performance: "medium", potential: "medium", label: "Solid Performer" },
  { name: "Lim Wei Jie", performance: "low", potential: "high", label: "Enigma" },
];

const CAREER_PATHS = [
  {
    name: "Ahmad Razif",
    current: "Senior Engineer",
    paths: [
      { role: "Principal Engineer", readiness: 72, timeframe: "12-18 months", type: "technical" },
      { role: "Engineering Manager", readiness: 55, timeframe: "18-24 months", type: "leadership" },
    ],
  },
  {
    name: "Ravi Kumar",
    current: "Backend Engineer",
    paths: [
      { role: "Senior Engineer", readiness: 68, timeframe: "6-12 months", type: "technical" },
      { role: "Tech Lead", readiness: 40, timeframe: "18-24 months", type: "leadership" },
    ],
  },
];

const LEARNING_RECS = [
  { employee: "Ahmad Razif", course: "AWS Solutions Architect Pro", provider: "AWS", urgency: "high", reason: "Closes critical cloud skill gap" },
  { employee: "Ravi Kumar", course: "System Design Masterclass", provider: "Educative", urgency: "medium", reason: "Prepares for Senior Engineer path" },
  { employee: "Nurul Ain", course: "ISTQB Advanced Test Analyst", provider: "ISTQB", urgency: "medium", reason: "Certification for career progression" },
];

const NINE_BOX_COLORS: Record<string, string> = {
  "Star": "bg-emerald-100 border-emerald-300 text-emerald-800",
  "Core Player": "bg-blue-100 border-blue-300 text-blue-800",
  "High Potential": "bg-violet-100 border-violet-300 text-violet-800",
  "Solid Performer": "bg-slate-100 border-slate-300 text-slate-800",
  "Enigma": "bg-amber-100 border-amber-300 text-amber-800",
};

export function TalentDevelopment() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Talent Development</h1>
        <p className="text-sm text-muted-foreground mt-0.5">AI career paths, skills gaps, succession planning, and learning</p>
      </div>

      <Tabs defaultValue="succession">
        <TabsList className="grid grid-cols-3 h-9">
          <TabsTrigger value="succession" className="text-xs">9-Box Grid</TabsTrigger>
          <TabsTrigger value="careers" className="text-xs">Career Paths</TabsTrigger>
          <TabsTrigger value="learning" className="text-xs">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="succession" className="space-y-3 mt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                Talent Matrix (9-Box)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Simplified 9-box visual */}
              <div className="grid grid-cols-3 gap-1 mb-4 text-[10px] text-center">
                {["Low Potential", "Medium Potential", "High Potential"].map(p => (
                  <div key={p} className="text-muted-foreground font-medium py-1">{p}</div>
                ))}
                {["High Perf", "Med Perf", "Low Perf"].map(perf => (
                  ["low", "medium", "high"].map(pot => {
                    const member = NINE_BOX.find(m => m.performance === perf.split(" ")[0]!.toLowerCase() && m.potential === pot);
                    return (
                      <div key={`${perf}-${pot}`} className={cn(
                        "rounded border p-2 min-h-[52px] flex flex-col items-center justify-center gap-1",
                        member ? NINE_BOX_COLORS[member.label] : "bg-muted/30 border-border"
                      )}>
                        {member && (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[9px] bg-white/60">{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <span className="text-[9px] font-medium leading-tight text-center">{member.name.split(" ")[0]}</span>
                          </>
                        )}
                      </div>
                    );
                  })
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(NINE_BOX_COLORS).map(([label, cls]) => (
                  <Badge key={label} className={cn("text-[10px] border", cls)}>{label}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Succession Risks */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">⚠️ Succession Gaps</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                No identified successor for <strong>Senior Engineer</strong> role. Ahmad Razif is the only critical-path holder. Recommend developing Ravi Kumar as backup within 12 months.
              </p>
              <Button size="sm" className="mt-2 text-xs h-7 bg-amber-600 hover:bg-amber-700">Create Development Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careers" className="space-y-3 mt-3">
          {CAREER_PATHS.map((emp) => (
            <Card key={emp.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  {emp.name}
                  <span className="text-xs text-muted-foreground font-normal">· {emp.current}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {emp.paths.map((path) => (
                  <div key={path.role} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{emp.current}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-semibold">{path.role}</span>
                      <Badge className={cn("ml-auto text-[10px] border-0", path.type === "technical" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700")}>
                        {path.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={path.readiness} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground shrink-0">{path.readiness}% ready</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Est. {path.timeframe}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="learning" className="space-y-3 mt-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-semibold">AI Learning Recommendations</span>
          </div>
          {LEARNING_RECS.map((rec, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="text-sm font-semibold truncate">{rec.course}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.employee} · {rec.provider}</p>
                    <p className="text-xs mt-1 text-foreground">{rec.reason}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <Badge className={cn("text-[10px] border-0", rec.urgency === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                      {rec.urgency}
                    </Badge>
                    <Button size="sm" variant="outline" className="text-xs h-6 px-2">Approve</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
