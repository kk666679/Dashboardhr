"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HELP_SECTIONS = [
  {
    title: "Documentation",
    description: "Browse guides, API references, and how-to articles.",
    icon: BookOpen,
    href: "https://github.com/foreignworkerhr-stack/Khakih",
  },
  {
    title: "Discussions",
    description: "Ask questions and share ideas with the community.",
    icon: MessageSquare,
    href: "https://github.com/foreignworkerhr-stack/Khakih/discussions",
  },
  {
    title: "Report an Issue",
    description: "Found a bug? Open an issue on GitHub.",
    icon: Mail,
    href: "https://github.com/foreignworkerhr-stack/Khakih/issues",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Help &amp; Support</h1>
          <p className="text-sm text-muted-foreground">
            Resources and support channels for AiFWMS
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {HELP_SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-primary" />
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={s.href} target="_blank" rel="noreferrer">
                    Open
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
