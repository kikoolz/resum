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
import { createResume } from "./actions";

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

    setIsLoading(true);
    setLoadingOption("upload");

    try {
      // Redirect to uploads page where they can process the PDF
      router.push("/dashboard/uploads");
    } catch (error) {
      console.error("Failed to handle upload:", error);
    } finally {
      setIsLoading(false);
      setLoadingOption(null);
      onOpenChange(false);
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
                <p className="font-medium">Upload your resume</p>
                <p className="text-sm text-muted-foreground">
                  Import an existing PDF and let AI extract the content
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
