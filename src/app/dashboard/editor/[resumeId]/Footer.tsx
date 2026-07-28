"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    FileText,
    Loader2,
    Check,
    AlertCircle,
    Circle,
    Sparkles,
} from "lucide-react";

interface FooterProps {
    showSmResumePreview: boolean;
    setShowSmResumePreview: (show: boolean) => void;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    lastSaveError: string | null;
    onGeneratePortfolio: () => void;
    resumeId?: string;
}

export default function Footer({
    showSmResumePreview,
    setShowSmResumePreview,
    isSaving,
    hasUnsavedChanges,
    lastSaveError,
    onGeneratePortfolio,
    resumeId,
}: FooterProps) {
    return (
        <footer className="w-full border-t border-border/40 bg-background/80 px-3 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                {/* Left: Mobile preview toggle + Generate Portfolio */}
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setShowSmResumePreview(
                                            !showSmResumePreview,
                                        )
                                    }
                                    className="md:hidden"
                                >
                                    <FileText className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle preview</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Generate Portfolio button — only show when a resume is saved (has an ID) */}
                    {resumeId && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all"
                                        onClick={onGeneratePortfolio}
                                    >
                                        <span className="hidden sm:inline">
                                            Generate Portfolio
                                        </span>
                                        <span className="sm:hidden">Portfolio</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Generate a neobrutalist portfolio website from your resume using Gemini AI</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>

                {/* Spacer on desktop */}
                <div className="hidden flex-1 md:block" />

                {/* Save status indicator */}
                <SaveStatus
                    isSaving={isSaving}
                    hasUnsavedChanges={hasUnsavedChanges}
                    lastSaveError={lastSaveError}
                />
            </div>
        </footer>
    );
}

function SaveStatus({
    isSaving,
    hasUnsavedChanges,
    lastSaveError,
}: {
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    lastSaveError: string | null;
}) {
    if (lastSaveError) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge
                            variant="destructive"
                            className="gap-1.5 font-normal"
                        >
                            <AlertCircle className="h-3 w-3" />
                            Save failed
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p className="max-w-xs text-xs">{lastSaveError}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (isSaving) {
        return (
            <Badge variant="secondary" className="gap-1.5 font-normal">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
            </Badge>
        );
    }

    if (hasUnsavedChanges) {
        return (
            <Badge variant="outline" className="gap-1.5 font-normal">
                <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
                Unsaved changes
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="gap-1.5 font-normal text-muted-foreground"
        >
            <Check className="h-3 w-3" />
            Saved
        </Badge>
    );
}
