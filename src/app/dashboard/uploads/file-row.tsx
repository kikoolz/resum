"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { deleteFile } from "../actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

    return (
        <div className="group flex flex-col gap-4 border-b border-foreground/10 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold tracking-tight">
                    {file.fileName}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span className="text-foreground/20">/</span>
                    <span>{formatDate(file.createdAt)}</span>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                <TooltipProvider>
                <Tooltip>
                    <AlertDialog>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDeleting}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Analyze</TooltipContent>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Analyze Resume</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Run AI-powered ATS analysis on <strong>{file.fileName}</strong>? This will use your AI quota.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="cursor-pointer"
                                    onClick={() => onAnalyze(file.id, file.fileName)}
                                >
                                    Analyze
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Tooltip>

                <Tooltip>
                    <AlertDialog>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    disabled={isDeleting}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <span>
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Download</TooltipContent>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Download File</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Download <strong>{file.fileName}</strong> ({formatFileSize(file.fileSize)}) to your device?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="cursor-pointer" asChild>
                                    <a href={file.url} download={file.fileName}>
                                        Download
                                    </a>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Tooltip>

                <Tooltip>
                    <AlertDialog>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDeleting}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                                >
                                    {isDeleting ? (
                                        <Spinner className="h-4 w-4" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete File</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{file.fileName}</strong>? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
