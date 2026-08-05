'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface HandbookViewerProps {
  handbook: {
    id: string;
    title: string;
    version: string;
    status: string;
    content: string;
    category?: string;
    tags?: string;
    updated: string;
  };
}

export function HandbookViewer({ handbook }: HandbookViewerProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{handbook.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">v{handbook.version}</Badge>
            <Badge variant={handbook.status === "Published" ? "success" : "warning"}>
              {handbook.status}
            </Badge>
            {handbook.category && <Badge variant="outline">{handbook.category}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Updated {new Date(handbook.updated).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/handbook/${handbook.id}/edit`)}>
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          {/* For production, use a Markdown renderer */}
          <div dangerouslySetInnerHTML={{ __html: handbook.content.replace(/\n/g, "<br />") }} />
        </CardContent>
      </Card>

      {handbook.tags && (
        <div>
          <span className="text-sm font-medium">Tags:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {handbook.tags.split(",").map((tag) => (
              <Badge key={tag} variant="secondary">{tag.trim()}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
