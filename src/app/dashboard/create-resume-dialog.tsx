"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { recreateResumeFromPdf } from "./actions";

interface CreateResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atLimit?: boolean;
}

export function CreateResumeDialog({
  open,
  onOpenChange,
  atLimit = false,
}: CreateResumeDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOption, setLoadingOption] = useState<"scratch" | "upload" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFromScratch = async () => {
    if (atLimit) return;
    setIsLoading(true);
    setLoadingOption("scratch");
    try {
      // Import createResume dynamically
      const { createResume } = await import("./actions");
      await createResume();
    } catch (error) {
      console.error("Failed to create resume:", error);
    } finally {
      setIsLoading(false);
      setLoadingOption(null);
    }
  };

  const handleUploadClick = () => {
    if (atLimit) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsLoading(true);
    setLoadingOption("upload");
    const toastId = toast.loading("Uploading and extracting resume data...");

    try {
      // 1. Upload PDF
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/files/upload-url", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload PDF");
      }

      toast.loading("AI is extracting resume data...", { id: toastId });

      // 2. Recreate resume from PDF
      const result = await recreateResumeFromPdf(uploadData.fileId);

      if (result.success && result.resumeId) {
        toast.success("Resume created! Redirecting...", { id: toastId });
        onOpenChange(false);
        router.push(`/dashboard/editor/${result.resumeId}`);
      } else {
        toast.error(result.error || "Failed to extract resume data", { id: toastId });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import PDF",
        { id: toastId },
      );
    } finally {
      setIsLoading(false);
      setLoadingOption(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileSelect}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Choose how you'd like to start building your resume.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 pt-2">
            <button
              onClick={handleCreateFromScratch}
              disabled={isLoading || atLimit}
              className="flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="rounded-full bg-primary/10 p-3">
                {loadingOption === "scratch" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">Create from scratch</p>
                <p className="text-sm text-muted-foreground">
                  Start with a blank resume and build it yourself
                </p>
              </div>
            </button>

            <button
              onClick={handleUploadClick}
              disabled={isLoading || atLimit}
              className="flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="rounded-full bg-primary/10 p-3">
                {loadingOption === "upload" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Upload className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">Import from PDF</p>
                <p className="text-sm text-muted-foreground">
                  Upload an existing resume and let AI extract the content
                </p>
              </div>
            </button>
          </div>

          {atLimit && (
            <p className="text-center text-sm text-muted-foreground">
              You've reached the free plan limit.{" "}
              <a href="/dashboard/billing" className="text-primary underline">
                Upgrade to Pro
              </a>
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
