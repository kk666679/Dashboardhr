import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  placeholders: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface DocumentTemplateEditorProps {
  template?: any;
  onSave?: (data: FormValues) => void;
}

export function DocumentTemplateEditor({ template, onSave }: DocumentTemplateEditorProps) {
  const { toast } = useToast();
  const [preview, setPreview] = useState("");
  const [activeTab, setActiveTab] = useState("edit");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: template || {
      name: "",
      description: "",
      content: "",
      placeholders: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    toast({ title: "Template saved" });
    onSave?.(values);
  };

  const handlePreview = () => {
    const content = form.getValues("content");
    // Replace placeholders with sample data for preview
    const sampleData = {
      employeeName: "John Doe",
      date: new Date().toLocaleDateString(),
      position: "Developer",
    };
    let previewText = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      previewText = previewText.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    setPreview(previewText);
    setActiveTab("preview");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{template ? "Edit Template" : "New Template"}</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Template Name</Label>
          <Input {...form.register("name")} />
        </div>
        <div>
          <Label>Description</Label>
          <Input {...form.register("description")} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Textarea
              rows={12}
              {...form.register("content")}
              placeholder="Use {{placeholders}} like {{employeeName}}"
            />
          </TabsContent>
          <TabsContent value="preview">
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded">{preview || "Click Preview to see sample"}</pre>
          </TabsContent>
        </Tabs>

        <div>
          <Label>Placeholders (comma separated)</Label>
          <Input {...form.register("placeholders")} placeholder="employeeName, date, position" />
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handlePreview}>Preview</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
