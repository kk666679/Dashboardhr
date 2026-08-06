"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, Star, MessageSquare, Target, Sparkles,
  ThumbsUp, Award, Loader2, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TEAM_MEMBERS = [
  { id: "1", name: "Ahmad Razif", role: "Senior Engineer", rating: 4.1, reviewDue: true, okrProgress: 58 },
  { id: "2", name: "Siti Norzahra", role: "Product Designer", rating: 4.6, reviewDue: false, okrProgress: 82 },
  { id: "3", name: "Ravi Kumar", role: "Backend Engineer", rating: 3.8, reviewDue: true, okrProgress: 45 },
  { id: "4", name: "Nurul Ain", role: "QA Engineer", rating: 4.2, reviewDue: false, okrProgress: 71 },
];

const FEEDBACK_FEED = [
  { from: "Siti Norzahra", to: "Ahmad Razif", type: "recognition", message: "Excellent work on the API redesign — saved us 2 weeks of rework.", date: "2 days ago" },
  { from: "Ravi Kumar", to: "Nurul Ain", type: "feedback", message: "Great catch on the edge case in the payment flow. Very thorough testing.", date: "4 days ago" },
  { from: "Manager", to: "Siti Norzahra", type: "coaching", message: "Let's work on stakeholder communication — consider weekly design reviews.", date: "1 week ago" },
];

const RATING_COLORS: Record<number, string> = {
  5: "text-emerald-600", 4: "text-blue-600", 3: "text-amber-600", 2: "text-red-600", 1: "text-red-700",
};

export function PerformanceFeedback() {
  const [draftFor, setDraftFor] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [generating, setGenerating] = useState(false);

  async function generateAIDraft(name: string) {
    setDraftFor(name);
    setGenerating(true);
    setDraftText("");
    await new Promise(r => setTimeout(r, 1400));
    setDraftText(
      `${name} has demonstrated strong technical leadership this quarter. Their contributions to the API redesign project were instrumental in delivering ahead of schedule. Key strengths include problem-solving, code quality, and cross-team collaboration.\n\nAreas for development: stakeholder communication and documentation practices could be strengthened to support knowledge transfer as the team scales.\n\nRecommended rating: 4.1/5 — Exceeds Expectations in technical delivery, Meets Expectations in collaboration.`
    );
    setGenerating(false);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance & Feedback</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Continuous feedback, OKR tracking, and AI-assisted reviews</p>
      </div>

      <Tabs defaultValue="reviews">
        <TabsList className="grid grid-cols-3 h-9">
          <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs">Feedback Feed</TabsTrigger>
          <TabsTrigger value="okrs" className="text-xs">OKRs</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-3 mt-3">
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.id} className={cn(member.reviewDue && "border-amber-200")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{member.name}</span>
                      {member.reviewDue && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Review Due</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn("text-lg font-bold", RATING_COLORS[Math.floor(member.rating)])}>
                      {member.rating}
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={cn("h-2.5 w-2.5", s <= Math.round(member.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground")} />
                      ))}
                    </div>
                  </div>
                </div>

                {member.reviewDue && (
                  <div className="mt-3 space-y-2">
                    {draftFor === member.name ? (
                      <div className="space-y-2">
                        {generating ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            AI is drafting your review…
                          </div>
                        ) : (
                          <Textarea value={draftText} onChange={e => setDraftText(e.target.value)} className="text-xs min-h-[100px]" />
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" className="text-xs h-7">Submit Review</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setDraftFor(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-7 flex-1" onClick={() => generateAIDraft(member.name)}>
                          <Sparkles className="h-3 w-3 mr-1 text-violet-600" /> AI Draft Review
                        </Button>
                        <Button size="sm" className="text-xs h-7 flex-1">
                          Write Review <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-3 mt-3">
          <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-700 text-xs h-8">
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Give Feedback or Recognition
          </Button>
          {FEEDBACK_FEED.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge className={cn("text-[10px] border-0",
                    item.type === "recognition" ? "bg-emerald-100 text-emerald-700" :
                    item.type === "coaching" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  )}>
                    {item.type === "recognition" ? <><Award className="h-2.5 w-2.5 mr-1 inline" />Recognition</> :
                     item.type === "coaching" ? <><Target className="h-2.5 w-2.5 mr-1 inline" />Coaching</> :
                     <><ThumbsUp className="h-2.5 w-2.5 mr-1 inline" />Feedback</>}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{item.date}</span>
                </div>
                <p className="text-xs font-medium mb-0.5">{item.from} → {item.to}</p>
                <p className="text-xs text-muted-foreground">{item.message}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="okrs" className="space-y-3 mt-3">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{member.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{member.okrProgress}%</span>
                </div>
                <Progress
                  value={member.okrProgress}
                  className={cn("h-2",
                    member.okrProgress >= 70 ? "[&>div]:bg-emerald-500" :
                    member.okrProgress >= 50 ? "[&>div]:bg-amber-500" :
                    "[&>div]:bg-red-500"
                  )}
                />
              </div>
              <Badge className={cn("text-[10px] border-0 shrink-0",
                member.okrProgress >= 70 ? "bg-emerald-100 text-emerald-700" :
                member.okrProgress >= 50 ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              )}>
                {member.okrProgress >= 70 ? "On Track" : member.okrProgress >= 50 ? "At Risk" : "Behind"}
              </Badge>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Alias export to avoid collision with features/performance/PerformanceFeedback
export { PerformanceFeedback as MSSPerformanceFeedback };
