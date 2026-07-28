"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Download, Trash2, Wand2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { deleteFile, recreateResumeFromPdf } from "../actions";

interface FileRowProps {
    file: {
        id: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        url: string;
        createdAt: Date | null;
    };
    onAnalyze: (fileId: string, fileName: string) => void;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date | null): string {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export function FileRow({ file, onAnalyze }: FileRowProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRecreating, setIsRecreating] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            const result = await deleteFile(file.id);
            if (!result.success) {
                throw new Error(result.error || "Delete failed");
            }
            toast.success("File deleted");
            router.refresh();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to delete",
            );
            setIsDeleting(false);
        }
    }

    async function handleRecreate() {
        setIsRecreating(true);
        const toastId = toast.loading(
            "Extracting resume data with AI... This may take 10-15 seconds.",
        );
        try {
            const result = await recreateResumeFromPdf(file.id);
            if (result.success && result.resumeId) {
                toast.success("Resume recreated successfully! Redirecting...", {
                    id: toastId,
                });
                router.push(`/dashboard/editor/${result.resumeId}`);
            } else {
                toast.error(result.error || "Failed to recreate resume", {
                    id: toastId,
                });
                setIsRecreating(false);
            }
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to recreate",
                { id: toastId },
            );
            setIsRecreating(false);
        }
    }

    const isBusy = isDeleting || isRecreating;

    return (
        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-red-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-red-900/50 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <FileText className="h-6 w-6 text-black dark:text-white" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                    {file.fileName}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                    <span className="rounded-full bg-black px-2 py-0.5 text-white dark:bg-white dark:text-black">
                        PDF
                    </span>
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>•</span>
                    <span>{formatDate(file.createdAt)}</span>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {/* Recreate as editable resume */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRecreate}
                    disabled={isBusy}
                    title="Recreate"
                    className="h-10 w-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-300 active:translate-y-0.5 active:shadow-none dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-yellow-600"
                >
                    {isRecreating ? (
                        <Spinner className="h-5 w-5" />
                    ) : (
                        <Wand2 className="h-5 w-5" />
                    )}
                </Button>

                {/* AI Analysis */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onAnalyze(file.id, file.fileName)}
                    disabled={isBusy}
                    title="Analyze"
                    className="h-10 w-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-blue-300 active:translate-y-0.5 active:shadow-none dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-blue-600"
                >
                    <BarChart3 className="h-5 w-5" />
                </Button>

                {/* Download */}
                <Button
                    variant="outline"
                    size="icon"
                    asChild
                    disabled={isBusy}
                    className="h-10 w-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-green-300 active:translate-y-0.5 active:shadow-none dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-green-600"
                >
                    <a href={file.url} download={file.fileName}>
                        <Download className="h-5 w-5" />
                    </a>
                </Button>

                {/* Delete */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isBusy}
                    className="h-10 w-10 border-2 border-black bg-red-100 text-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-red-400 hover:text-black active:translate-y-0.5 active:shadow-none dark:border-white dark:bg-red-900/30 dark:text-red-400 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-red-700 dark:hover:text-white"
                >
                    {isDeleting ? (
                        <Spinner className="h-5 w-5" />
                    ) : (
                        <Trash2 className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}
