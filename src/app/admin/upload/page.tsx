"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  X,
  Wand2,
  FileText,
  Sparkles,
} from "lucide-react";

interface UploadResult {
  success: boolean;
  id?: number;
  message?: string;
  error?: string;
}

interface MetadataField {
  key: string;
  value: string;
}

export default function UploadPage() {
  const isUploadDisabled = process.env.NODE_ENV === "development";

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [pasteInput, setPasteInput] = useState("");
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([
    { key: "", value: "" },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showSmartPaste, setShowSmartPaste] = useState(false);

  const categories = [
    "experience",
    "projects",
    "skills",
    "education",
    "achievements",
    "certifications",
    "personal",
    "contact",
  ];

  const templates = {
    experience: `Category: experience
Content: Software Engineer at TechCorp (2023-Present). Led development of microservices architecture, mentored junior developers, and improved system performance by 40%.
company: TechCorp
role: Software Engineer
duration: 2023-Present
technologies: ["React", "Node.js", "AWS", "PostgreSQL"]`,

    projects: `Category: projects
Content: AI-powered task management app with natural language processing. Built with Next.js and integrated OpenAI API for intelligent task categorization.
title: AI Task Manager
description: Smart task management with NLP
technologies: ["Next.js", "OpenAI API", "PostgreSQL", "Tailwind"]
status: Completed`,

    skills: `Category: skills
Content: Full-stack development expertise in modern JavaScript ecosystem
programming_languages: ["JavaScript", "TypeScript", "Python"]
frontend: ["React", "Next.js", "Tailwind CSS"]
backend: ["Node.js", "Express", "PostgreSQL"]
tools: ["Git", "Docker", "AWS"]`,
  };

  const parseContent = (text: string) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    let parsedCategory = "";
    let parsedContent = "";
    const parsedMetadata: MetadataField[] = [];

    for (const line of lines) {
      if (line.toLowerCase().match(/^(category|type):\s*/)) {
        parsedCategory = line
          .replace(/^(category|type):\s*/i, "")
          .trim()
          .toLowerCase();
      } else if (line.toLowerCase().match(/^content:\s*/)) {
        parsedContent = line.replace(/^content:\s*/i, "").trim();
      } else if (line.includes(":") && !line.toLowerCase().startsWith("http")) {
        const [key, ...valueParts] = line.split(":");
        const value = valueParts.join(":").trim();
        const cleanKey = key
          .trim()
          .toLowerCase()
          .replace(/^[-*•]\s*/, "");

        if (cleanKey && value) {
          parsedMetadata.push({ key: cleanKey, value });
        }
      }
    }

    // Auto-detect category if not specified
    if (!parsedCategory && parsedContent) {
      const content = parsedContent.toLowerCase();
      if (
        content.includes("engineer") ||
        content.includes("developer") ||
        content.includes("manager")
      ) {
        parsedCategory = "experience";
      } else if (
        content.includes("project") ||
        content.includes("built") ||
        content.includes("created")
      ) {
        parsedCategory = "projects";
      } else if (
        content.includes("skill") ||
        content.includes("technology") ||
        content.includes("programming")
      ) {
        parsedCategory = "skills";
      }
    }

    return { parsedCategory, parsedContent, parsedMetadata };
  };

  const handleSmartParse = () => {
    if (!pasteInput.trim()) return;

    const { parsedCategory, parsedContent, parsedMetadata } =
      parseContent(pasteInput);

    if (parsedCategory && categories.includes(parsedCategory)) {
      setCategory(parsedCategory);
    }
    if (parsedContent) {
      setContent(parsedContent);
    }
    if (parsedMetadata.length > 0) {
      setMetadataFields(parsedMetadata);
    }

    setPasteInput("");
    setShowSmartPaste(false);
  };

  const insertTemplate = (templateKey: keyof typeof templates) => {
    setPasteInput(templates[templateKey]);
  };

  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: "", value: "" }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== index));
  };

  const updateMetadataField = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const updated = metadataFields.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setMetadataFields(updated);
  };

  const buildMetadataObject = (): Record<string, any> => {
    const metadata: Record<string, any> = {};
    metadataFields.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        try {
          metadata[key.trim()] = JSON.parse(value);
        } catch {
          metadata[key.trim()] = value.trim();
        }
      }
    });
    return metadata;
  };

  const handleSubmit = async () => {
    // Additional safety check for disabled upload
    if (isUploadDisabled) {
      setUploadResult({
        success: false,
        error:
          "Upload functionality is disabled in production to prevent unauthorized data modifications. Use development mode to add content.",
      });
      return;
    }

    if (!content.trim() || !category) {
      setUploadResult({
        success: false,
        error: "Content and category are required",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const metadata = buildMetadataObject();

      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          category,
          metadata,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          id: result.id,
          message: "Content uploaded successfully!",
        });

        // Reset form
        setContent("");
        setCategory("");
        setMetadataFields([{ key: "", value: "" }]);
      } else {
        setUploadResult({
          success: false,
          error: result.error || "Upload failed",
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: "Network error. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearForm = () => {
    setContent("");
    setCategory("");
    setPasteInput("");
    setMetadataFields([{ key: "", value: "" }]);
    setUploadResult(null);
  };

  // If upload is disabled, show disabled state
  if (isUploadDisabled) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto py-12 px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Upload Content
            </h1>
            <p className="text-muted-foreground text-lg">
              Add your professional information to the knowledge base
            </p>
          </div>

          {/* Disabled State Card */}
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Upload Feature Disabled</CardTitle>
              <CardDescription className="text-base">
                Content upload functionality is disabled in production to
                prevent unauthorized modifications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-1">
                    <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
                      Production Environment - Upload Disabled
                    </AlertDescription>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      This feature is intentionally disabled in production to
                      prevent unauthorized users from adding unwanted data to
                      the portfolio.
                    </p>
                  </div>
                </div>
              </Alert>

              <div className="pt-4 text-sm text-muted-foreground space-y-2">
                <p className="font-medium">This is an open source project!</p>
                <div className="text-left bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium text-foreground mb-2">
                    For developers who forked this project:
                  </p>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Run locally in development mode to enable uploads</li>
                    <li>Add your content through the upload interface</li>
                    <li>
                      Deploy to production (uploads will be auto-disabled)
                    </li>
                    <li>
                      This protects your live site from unauthorized content
                    </li>
                  </ol>
                </div>
                <p className="text-xs mt-2">
                  <strong>Security:</strong> Never enable uploads in production
                  unless you have proper authentication.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Upload Content
          </h1>
          <p className="text-muted-foreground text-lg">
            Add your professional information to the knowledge base
          </p>
        </div>

        {/* Smart Paste Toggle */}
        <div className="mb-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowSmartPaste(!showSmartPaste)}
            className="gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {showSmartPaste ? "Hide Smart Paste" : "Use Smart Paste"}
          </Button>
        </div>

        {/* Smart Paste Section */}
        {showSmartPaste && (
          <Card className="mb-8 border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Smart Paste
              </CardTitle>
              <CardDescription>
                Paste formatted content and let AI parse it automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Templates */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium">Templates:</span>
                {Object.keys(templates).map((key) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() =>
                      insertTemplate(key as keyof typeof templates)
                    }
                  >
                    {key}
                  </Badge>
                ))}
              </div>

              <Textarea
                placeholder="Paste your content here..."
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                rows={6}
                className="resize-none"
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleSmartParse}
                  disabled={!pasteInput.trim()}
                  className="gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Parse Content
                </Button>
                <Button variant="outline" onClick={() => setPasteInput("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Content Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  required
                  className="resize-none"
                />
                <div className="text-sm text-muted-foreground text-right">
                  {content.length} characters
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Additional Information</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addMetadataField}
                    className="gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-3">
                  {metadataFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Field name"
                        value={field.key}
                        onChange={(e) =>
                          updateMetadataField(index, "key", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateMetadataField(index, "value", e.target.value)
                        }
                        className="flex-1"
                      />
                      {metadataFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMetadataField(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || !content.trim() || !category}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Content
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={clearForm}
                  disabled={isUploading}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Result */}
        {uploadResult && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <Alert
                className={
                  uploadResult.success
                    ? "border-green-500/20 bg-green-50/50 dark:bg-green-950/20"
                    : "border-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                }
              >
                <div className="flex items-center gap-2">
                  {uploadResult.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <AlertDescription
                    className={
                      uploadResult.success
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }
                  >
                    {uploadResult.success ? (
                      <div className="flex items-center gap-2">
                        {uploadResult.message}
                        {uploadResult.id && (
                          <Badge variant="outline">ID: {uploadResult.id}</Badge>
                        )}
                      </div>
                    ) : (
                      uploadResult.error
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
