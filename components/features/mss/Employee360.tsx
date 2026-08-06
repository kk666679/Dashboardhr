"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Briefcase, Star, TrendingUp, BookOpen, Heart,
  Award, Target, MessageSquare, ChevronRight, Mail, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Employee360Props {
  employeeId?: string;
  name?: string;
  role?: string;
  department?: string;
  avatar?: string;
  onClose?: () => void;
}

const MOCK_SKILLS = [
  { name: "React / TypeScript", level: 90, category: "Technical" },
  { name: "System Design", level: 75, category: "Technical" },
  { name: "Leadership", level: 68, category: "Soft Skills" },
  { name: "Communication", level: 82, category: "Soft Skills" },
  { name: "AWS Cloud", level: 55, category: "Technical" },
];

const MOCK_GOALS = [
  { title: "Complete AWS Solutions Architect cert", progress: 60, due: "Sep 2026", status: "on-track" },
  { title: "Lead Q3 product launch", progress: 35, due: "Aug 2026", status: "at-risk" },
  { title: "Mentor 2 junior engineers", progress: 80, due: "Dec 2026", status: "on-track" },
];

const MOCK_TIMELINE = [
  { date: "Jan 2024", event: "Promoted to Senior Engineer", type: "promotion" },
  { date: "Jul 2023", event: "Completed PMP Certification", type: "cert" },
  { date: "Mar 2023", event: "Joined Engineering Team", type: "join" },
];

export function Employee360({ name = "Ahmad Razif", role = "Senior Engineer", department = "Engineering", avatar, onClose }: Employee360Props) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="border-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-slate-300 text-sm">{role} · {department}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge className="bg-white/15 text-white border-0 text-xs">Active</Badge>
                <Badge className="bg-amber-500/80 text-white border-0 text-xs">Flight Risk</Badge>
                <Badge className="bg-emerald-500/80 text-white border-0 text-xs">High Performer</Badge>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-amber-400">87</div>
              <div className="text-xs text-slate-400">Risk Score</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            {[
              { label: "Tenure", value: "3.2 yrs" },
              { label: "Engagement", value: "62/100" },
              { label: "Performance", value: "4.1/5" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-lg p-2">
                <div className="font-bold text-sm">{value}</div>
                <div className="text-[10px] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs h-7">
              <Mail className="h-3 w-3 mr-1" /> Message
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs h-7">
              <MessageSquare className="h-3 w-3 mr-1" /> 1:1 Agenda
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs h-7 ml-auto">
              Take Action <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-4 h-9">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs">Goals</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Heart, label: "Wellbeing", value: 58, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
              { icon: TrendingUp, label: "Productivity", value: 81, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
              { icon: BookOpen, label: "Learning", value: 72, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
              { icon: Award, label: "Recognition", value: 45, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={cn("rounded-lg p-3", bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("h-4 w-4", color)} />
                  <span className="text-xs font-medium">{label}</span>
                </div>
                <div className={cn("text-xl font-bold", color)}>{value}</div>
                <Progress value={value} className="mt-1.5 h-1.5" />
              </div>
            ))}
          </div>
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">AI Recommendation</p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Schedule a retention conversation this week. Offer a salary review and discuss career growth path to reduce flight risk from 87% to below 40%.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-2 mt-3">
          {MOCK_SKILLS.map((skill) => (
            <div key={skill.name} className="flex items-center gap-3">
              <div className="w-36 text-sm truncate">{skill.name}</div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", skill.level >= 75 ? "bg-emerald-500" : skill.level >= 55 ? "bg-amber-500" : "bg-red-500")}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{skill.level}%</span>
              <Badge variant="outline" className="text-[10px] h-4 shrink-0">{skill.category}</Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="goals" className="space-y-3 mt-3">
          {MOCK_GOALS.map((goal) => (
            <div key={goal.title} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <Badge className={cn("text-[10px] shrink-0 border-0", goal.status === "on-track" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                  {goal.status}
                </Badge>
              </div>
              <Progress value={goal.progress} className="h-1.5 mb-1" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.progress}% complete</span>
                <span>Due {goal.due}</span>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-3">
          <div className="relative pl-4 space-y-4">
            <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border" />
            {MOCK_TIMELINE.map((item, i) => (
              <div key={i} className="relative flex gap-3">
                <div className="absolute -left-[11px] h-3 w-3 rounded-full bg-primary border-2 border-background mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                  <p className="text-sm font-medium">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
