"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB
 
export function UploadSection() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStep, setUploadStep] = useState("");
    const [dragOver, setDragOver] = useState(false);

    async function uploadFile(file: File) {
        // Client-side validation: type
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }
        // Client-side validation: size
        if (file.size > MAX_PDF_SIZE) {
            toast.error("File too large. Maximum size is 10MB");
            return;
        }

        setIsUploading(true);
        const toastId = "upload-" + Date.now();

        try {
            // Step 1: Get presigned URL from server
            setUploadStep("Preparing upload...");
            toast.loading("Preparing upload...", { id: toastId });

            const urlRes = await fetch("/api/files/upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    fileType: "resume_pdf",
                    fileSize: file.size,
                }),
            });

            const urlData = (await urlRes.json()) as {
                success: boolean;
                uploadUrl?: string;
                fileId?: string;
                r2Key?: string;
                error?: string;
            };

            if (!urlRes.ok || !urlData.success) {
                throw new Error(urlData.error || "Failed to prepare upload");
            }

            // Step 2: Upload directly to R2 via presigned URL
            setUploadStep("Uploading to storage...");
            toast.loading("Uploading to storage...", { id: toastId });

            const uploadRes = await fetch(urlData.uploadUrl!, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                    "Content-Length": String(file.size),
                },
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload file to storage");
            }

            // Step 3: Confirm upload and create DB record
            setUploadStep("Verifying upload...");
            toast.loading("Verifying upload...", { id: toastId });

            const confirmRes = await fetch("/api/files/confirm-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileId: urlData.fileId,
                    r2Key: urlData.r2Key,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                }),
            });

            const confirmData = (await confirmRes.json()) as {
                success: boolean;
                error?: string;
            };

            if (!confirmRes.ok || !confirmData.success) {
                throw new Error(confirmData.error || "Failed to confirm upload");
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
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            uploadFile(file);
        }
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
            className={`group relative flex cursor-pointer flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border-4 border-dashed p-12 transition-all duration-300 ease-in-out hover:border-black hover:bg-yellow-50 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:border-white dark:hover:bg-yellow-900/20 dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] ${
                dragOver
                    ? "scale-[1.02] border-black bg-yellow-100 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-yellow-900/30 dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
                    : "border-muted-foreground/30 bg-muted/20 hover:scale-[1.01]"
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
                    <div className="relative h-20 w-20 animate-spin rounded-full border-8 border-muted-foreground/20 border-t-black dark:border-t-white" />
                    <span className="bg-black px-4 py-2 font-mono text-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:bg-white dark:text-black">
                        {uploadStep || "UPLOADING..."}
                    </span>
                </div>
            ) : (
                <>
                    <div className="rounded-full border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-12 dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <Upload className="h-10 w-10 text-black dark:text-white" />
                    </div>
                    <div className="text-center">
                        <p className="font-mono text-2xl font-black uppercase tracking-tight text-foreground">
                            Drop PDF here
                        </p>
                        <p className="mt-2 font-medium text-muted-foreground">
                            or click to browse (max 10MB)
                        </p>
                    </div>
                    <Button
                        type="button"
                        className="border-2 border-black bg-black text-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 hover:bg-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-0 active:shadow-none dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] dark:hover:bg-white dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]"
                        onClick={(e) => {
                            e.stopPropagation();
                            inputRef.current?.click();
                        }}
                    >
                        SELECT FILE
                    </Button>
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
