import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// z.record requires (keyType, valueType) in Zod v4
const schema = z.object({
  templateId: z.string().min(1),
  title: z.string().min(1),
  data: z.record(z.string(), z.string()).default({}),
});

type FormValues = z.infer<typeof schema>;

interface DocumentGeneratorProps {
  templates?: { id: string; name: string; placeholders: string[] }[];
  onGenerate?: (data: FormValues) => void;
}

export function DocumentGenerator({ templates = [], onGenerate }: DocumentGeneratorProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [previewContent, setPreviewContent] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      templateId: "",
      title: "",
      data: {},
    },
  });

  const handleTemplateChange = (id: string) => {
    setSelectedTemplate(id);
    form.setValue("templateId", id);
    const template = templates.find((t) => t.id === id);
    if (template) {
      const data = template.placeholders.reduce<Record<string, string>>(
        (acc, p) => ({ ...acc, [p]: "" }),
        {},
      );
      form.setValue("data", data);
    }
  };

  const onSubmit = (values: FormValues) => {
    toast({ title: "Document generated" });
    onGenerate?.(values);
  };

  const handlePreview = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (template) {
      const data = form.getValues("data");
      let preview = `Document preview for "${template.name}"\n\n`;
      Object.entries(data).forEach(([key, value]) => {
        preview += `${key}: ${value}\n`;
      });
      setPreviewContent(preview);
    }
  };

  // Keep a watched copy of data keys so the field list re-renders
  const dataKeys = Object.keys(form.watch("data") ?? {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generate Document</h2>

      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
        <div>
          <Label>Template</Label>
          <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Document Title</Label>
          <Input {...form.register("title")} />
        </div>

        {selectedTemplate && dataKeys.length > 0 && (
          <Card>
            <CardContent className="space-y-2 pt-4">
              {dataKeys.map((key) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <Input
                    value={(form.getValues(`data.${key}`) as string) || ""}
                    onChange={(e) => form.setValue(`data.${key}`, e.target.value)}
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {previewContent && (
          <Card>
            <CardContent className="pt-4">
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded">{previewContent}</pre>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          {selectedTemplate && (
            <Button type="button" variant="outline" onClick={handlePreview}>
              Preview
            </Button>
          )}
          <Button type="submit">Generate</Button>
        </div>
      </form>
    </div>
  );
}
