"use client";

import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    ExternalLink,
    RefreshCw,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { generatePortfolioFromResume } from "../../actions";

type State =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "done"; html: string }
    | { status: "error"; message: string };

interface PortfolioModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resumeId: string;
    resumeTitle?: string;
}

export default function PortfolioModal({
    open,
    onOpenChange,
    resumeId,
    resumeTitle,
}: PortfolioModalProps) {
    const [state, setState] = useState<State>({ status: "idle" });
    const blobUrlRef = useRef<string | null>(null);

    // Start generation as soon as the modal opens (if not already loading/done)
    useEffect(() => {
        if (open && state.status === "idle") {
            generate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Revoke blob URL on unmount / close
    useEffect(() => {
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
        };
    }, []);

    async function generate() {
        setState({ status: "loading" });
        // Revoke old blob
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }

        const result = await generatePortfolioFromResume(resumeId);

        if (!result.success || !result.html) {
            setState({
                status: "error",
                message: result.error ?? "Unknown error generating portfolio.",
            });
            return;
        }

        setState({ status: "done", html: result.html });
    }

    function handleOpenNewTab() {
        if (state.status !== "done") return;
        const blob = new Blob([state.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    function handleRegenerate() {
        setState({ status: "idle" });
        generate();
    }

    function handleOpenChange(v: boolean) {
        if (!v) {
            // Reset to idle when closed so next open triggers fresh generation
            setState({ status: "idle" });
        }
        onOpenChange(v);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex h-[90dvh] max-w-5xl flex-col gap-0 p-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="flex-shrink-0 border-b border-border/40 px-5 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <DialogTitle className="text-sm font-semibold">
                                AI Portfolio
                                {resumeTitle && (
                                    <span className="ml-1.5 font-normal text-muted-foreground">
                                        · {resumeTitle}
                                    </span>
                                )}
                            </DialogTitle>
                            {state.status === "loading" && (
                                <Badge variant="secondary" className="gap-1 text-xs font-normal">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Generating…
                                </Badge>
                            )}
                            {state.status === "done" && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 text-xs font-normal text-emerald-500 border-emerald-500/30"
                                >
                                    Ready
                                </Badge>
                            )}
                        </div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            {state.status === "done" && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 gap-1.5 text-xs"
                                        onClick={handleRegenerate}
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        Regenerate
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-7 gap-1.5 text-xs"
                                        onClick={handleOpenNewTab}
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        Open in New Tab
                                    </Button>
                                </>
                            )}
                            {state.status === "error" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1.5 text-xs"
                                    onClick={handleRegenerate}
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Try again
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {/* Body */}
                <div className="relative flex-1 overflow-hidden bg-muted/50">
                    {/* Loading state */}
                    {state.status === "loading" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                            {/* Animated gradient orb */}
                            <div className="relative h-20 w-20">
                                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                                <div className="absolute inset-2 animate-pulse rounded-full bg-primary/30" />
                                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-primary/50">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    Gemini is crafting your portfolio…
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    This may take 15–30 seconds. Sit tight!
                                </p>
                            </div>
                            {/* Animated progress bar */}
                            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                                    style={{ backgroundSize: "200% 100%" }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {state.status === "error" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-destructive">
                                    Generation failed
                                </p>
                                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                    {state.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Idle (shouldn't show, but just in case) */}
                    {state.status === "idle" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">
                                Opening…
                            </p>
                        </div>
                    )}

                    {/* Preview iframe */}
                    {state.status === "done" && (
                        <iframe
                            srcDoc={state.html}
                            className="h-full w-full border-0"
                            sandbox="allow-scripts allow-same-origin"
                            title="Portfolio Preview"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
