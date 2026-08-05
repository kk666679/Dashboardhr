"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  FileText,
  Download,
  Bot,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";

const PDFPreview = dynamic(
  () => import("@/components/features/pdf/pdf-preview").then((m) => m.PDFPreview),
  { ssr: false },
);

interface HandbookSection {
  id: string;
  title: string;
  content: string;
}

const DEFAULT_SECTIONS: HandbookSection[] = [
  {
    id: "welcome",
    title: "Welcome to Our Company",
    content: "Welcome to [Company Name]! This handbook serves as your guide to our policies, procedures, and expectations. Please read it carefully and keep it as a reference.",
  },
  {
    id: "company-overview",
    title: "Company Overview",
    content: "Our company is committed to excellence in [industry/field]. We value our employees and strive to create a positive work environment.",
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    content: "All employees are expected to maintain professional behavior, respect colleagues, and adhere to ethical standards in all business dealings.",
  },
  {
    id: "attendance",
    title: "Attendance and Punctuality",
    content: "Regular attendance and punctuality are essential. Please notify your supervisor in advance if you will be absent or late.",
  },
  {
    id: "benefits",
    title: "Employee Benefits",
    content: "We offer competitive benefits including health insurance, paid leave, and professional development opportunities.",
  },
  {
    id: "safety",
    title: "Health and Safety",
    content: "Employee safety is our top priority. Follow all safety protocols and report any hazards immediately.",
  },
];

export function HandbookGenerator() {
  const [companyName, setCompanyName] = useState("ABC Construction Sdn Bhd");
  const [employeeName, setEmployeeName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [sections, setSections] = useState<HandbookSection[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const { toast } = useToast();

  const addSection = () => {
    const newSection: HandbookSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      content: "Enter section content here...",
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const generateHandbook = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "handbook",
          context: {
            companyName,
            employeeName: employeeName || "Employee",
            sections,
            effectiveDate,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate handbook");
      }

      const result = await response.json();
      setPdfData(result.data);
      setPdfUrl(result.pdfUrl);

      toast({
        title: "Handbook Generated!",
        description: "Employee handbook ready for preview/download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [companyName, employeeName, sections, effectiveDate, toast]);

  const downloadPDF = useCallback(() => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `${companyName}-employee-handbook.pdf`;
      a.click();
    }
  }, [pdfUrl, companyName]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Employee Handbook Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="employeeName">Employee Name (Optional)</Label>
              <Input
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Personalize for specific employee"
              />
            </div>
            <div>
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Handbook Sections</Label>
              <Button onClick={addSection} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <Card key={section.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          className="font-medium mb-2"
                          placeholder="Section title"
                        />
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                          rows={4}
                          placeholder="Section content"
                        />
                      </div>
                      <Button
                        onClick={() => removeSection(section.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Section {index + 1}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateHandbook}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Handbook...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Generate Employee Handbook
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {pdfData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Handbook</CardTitle>
            <Badge variant="secondary" className="text-xs">
              AI Generated
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {pdfUrl ? (
              <>
                <PDFPreview
                  documentType="handbook"
                  data={pdfData}
                  className="w-full h-96 bg-gray-50 rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={downloadPDF}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Handbook PDF
                  </Button>
                  <Button
                    onClick={() => {
                      setPdfData(null);
                      setPdfUrl("");
                    }}
                    variant="ghost"
                  >
                    New Handbook
                  </Button>
                </div>
              </>
            ) : (
              <p>No preview available. Use "Generate" button.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pro Tip */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <BookOpen className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Comprehensive Handbooks</h3>
          <p className="text-sm text-muted-foreground">
            Create customized employee handbooks with company policies, procedures, and compliance information tailored to Malaysian employment law.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}