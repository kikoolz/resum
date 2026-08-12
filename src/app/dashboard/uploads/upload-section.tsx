"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

export function UploadSection() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStep, setUploadStep] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const uploadFile = useCallback(async (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }
        if (file.size > MAX_PDF_SIZE) {
            toast.error("File too large. Maximum size is 10MB");
            return;
        }

        setIsUploading(true);
        const toastId = "upload-" + Date.now();

        try {
            setUploadStep("Uploading...");
            toast.loading("Uploading...", { id: toastId });

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/files/upload-url", {
                method: "POST",
                body: formData,
            });

            const data = (await res.json()) as {
                success: boolean;
                fileId?: string;
                error?: string;
            };

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to upload");
            }

            toast.success("Resume uploaded successfully", { id: toastId });
            router.refresh();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to upload",
                { id: toastId },
            );
        } finally {
            setIsUploading(false);
            setUploadStep("");
            if (inputRef.current) inputRef.current.value = "";
        }
    }, [router]);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    }

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`group relative flex cursor-pointer flex-col items-center justify-center gap-6 overflow-hidden border border-dashed p-12 transition-all duration-300 ${
                dragOver
                    ? "border-primary/50 bg-primary/5"
                    : "border-foreground/15 bg-muted/20 hover:border-foreground/30"
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                }
            }}
            onClick={() => inputRef.current?.click()}
        >
            {isUploading ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {uploadStep || "Uploading..."}
                    </span>
                </div>
            ) : (
                <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-sm font-bold tracking-tight">
                            Drop PDF here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            or click to browse (max 10MB)
                        </p>
                    </div>
                </>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
