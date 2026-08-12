"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { recreateResumeFromPdf } from "../../actions";

interface PdfImportButtonProps {
    resumeId: string;
}

export default function PdfImportButton({ resumeId }: PdfImportButtonProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File too large. Maximum size is 10MB");
            return;
        }

        setIsImporting(true);
        const toastId = toast.loading("Uploading and extracting resume data with AI...");

        try {
            // 1. Upload PDF
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(",")[1] || "");
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const uploadRes = await fetch("/api/files/upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    fileType: "resume_pdf",
                    fileSize: file.size,
                    fileData: base64,
                }),
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok || !uploadData.success) {
                throw new Error(uploadData.error || "Failed to upload PDF");
            }

            toast.loading("AI is extracting resume data... This may take 10-15 seconds.", { id: toastId });

            // 2. Recreate resume from PDF
            const result = await recreateResumeFromPdf(uploadData.fileId);

            if (result.success && result.resumeId) {
                toast.success("Resume data extracted! Redirecting to new resume...", { id: toastId });
                router.push(`/dashboard/editor/${result.resumeId}`);
            } else {
                toast.error(result.error || "Failed to extract resume data", { id: toastId });
            }
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to import PDF",
                { id: toastId },
            );
        } finally {
            setIsImporting(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }, [router]);

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => inputRef.current?.click()}
                            disabled={isImporting}
                        >
                            {isImporting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Import from PDF — Extract data from an existing resume</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
}
