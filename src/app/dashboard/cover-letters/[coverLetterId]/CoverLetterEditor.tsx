"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Trash2,
  ArrowLeft,
  Loader2,
  Download,
  Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { saveCoverLetter, deleteCoverLetter, getResumeForCoverLetter } from "../../actions";
import { generateCoverLetter } from "@/lib/ai-cover-letter";
import type { CoverLetterValues } from "@/lib/validation";

interface CoverLetterEditorProps {
  coverLetter: {
    id: string;
    title: string | null;
    companyName: string | null;
    jobTitle: string | null;
    jobDescription: string | null;
    tone: string;
    content: string | null;
    resumeId: string | null;
  };
  resumes: {
    id: string;
    title: string | null;
    firstName: string | null;
    lastName: string | null;
    jobTitle: string | null;
  }[];
}

export default function CoverLetterEditor({
  coverLetter,
  resumes,
}: CoverLetterEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(coverLetter.title || "");
  const [companyName, setCompanyName] = useState(coverLetter.companyName || "");
  const [jobTitle, setJobTitle] = useState(coverLetter.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(
    coverLetter.jobDescription || "",
  );
  const [tone, setTone] = useState<string>(coverLetter.tone || "professional");
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    coverLetter.resumeId || "none",
  );
  const [content, setContent] = useState(coverLetter.content || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const values: CoverLetterValues = {
        id: coverLetter.id,
        title: title || undefined,
        companyName: companyName || undefined,
        jobTitle: jobTitle || undefined,
        jobDescription: jobDescription || undefined,
        tone: tone as "professional" | "casual" | "enthusiastic" | "formal",
        content: content || undefined,
        resumeId:
          selectedResumeId === "none"
            ? undefined
            : selectedResumeId || undefined,
      };
      const result = await saveCoverLetter(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Cover letter saved");
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    coverLetter.id,
    title,
    companyName,
    jobTitle,
    jobDescription,
    tone,
    content,
    selectedResumeId,
  ]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      let resumeData: Record<string, unknown> = {};
      if (selectedResumeId && selectedResumeId !== "none") {
        const data = await getResumeForCoverLetter(selectedResumeId);
        if (data) resumeData = data;
      }

      const result = await generateCoverLetter({
        resumeId: selectedResumeId === "none" ? "" : selectedResumeId,
        resumeData: resumeData as Parameters<
          typeof generateCoverLetter
        >[0]["resumeData"],
        companyName: companyName || undefined,
        jobTitle: jobTitle || undefined,
        jobDescription: jobDescription || undefined,
        tone: tone as "professional" | "casual" | "enthusiastic" | "formal",
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.content) {
        setContent(result.content);
        toast.success("Cover letter generated!");
      }
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedResumeId, companyName, jobTitle, jobDescription, tone]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;
    setIsDeleting(true);
    try {
      const result = await deleteCoverLetter(coverLetter.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Cover letter deleted");
        router.push("/dashboard/cover-letters");
      }
    } finally {
      setIsDeleting(false);
    }
  }, [coverLetter.id, router]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 no-print">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/cover-letters")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Cover Letter"
              className="h-8 max-w-xs border-none bg-transparent text-lg font-bold font-heading focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={!content}
            >
              <Download className="mr-1.5 h-4 w-4" />
              Download PDF
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Left: Input panel */}
        <div className="space-y-4 no-print">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Link Resume (optional)</Label>
                <Select
                  value={selectedResumeId}
                  onValueChange={setSelectedResumeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume to use as context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No resume linked</SelectItem>
                    {resumes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title ||
                          `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
                          "Untitled"}
                        {r.jobTitle ? ` — ${r.jobTitle}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Apple, Stripe"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a more tailored cover letter..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Snowflake className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview panel */}
        <div className="space-y-4">
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle className="text-lg">Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              {content ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-4 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Snowflake className="mb-3 h-8 w-8 opacity-50" />
                  <p className="text-sm">
                    {isGenerating
                      ? "AI is writing your cover letter..."
                      : "Fill in the job details and click Generate to create your cover letter"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editable content */}
          {content && (
            <Card className="no-print">
              <CardHeader>
                <CardTitle className="text-lg">Edit Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Print layout */}
      <div className="print-only hidden">
        <div className="mx-auto max-w-2xl p-8">
          <div className="mb-6 text-sm text-foreground">
            {coverLetter.resumeId && (
              <p className="text-muted-foreground">
                Re: {jobTitle || "Position"}
              </p>
            )}
          </div>
          {content &&
            content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
