"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function QMSGenerator() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    // Mock generation – replace with AI call
    setOutput(`Generated QMS document based on: ${input}\n\nDocument content here...`);
    toast({ title: "QMS Document Generated" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QMS Document Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the process or requirements..."
          rows={4}
        />
        <Button onClick={handleGenerate}>Generate QMS Document</Button>
        {output && (
          <div className="mt-4 p-4 border rounded bg-muted/20">
            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
