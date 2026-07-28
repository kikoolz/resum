"use client";

import { useEffect, useRef, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Shield,
    RefreshCw,
    Sparkles,
    TrendingUp,
    Target,
    Zap,
    Star,
} from "lucide-react";
import { analyzeResumePdf } from "../actions";
import type { AiResumeAnalysis } from "@/lib/ai-schemas";

interface AnalysisDrawerProps {
    fileId: string | null;
    fileName: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Score helpers                                                      */
/* ------------------------------------------------------------------ */

function scoreColor(score: number): string {
    if (score >= 83) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 71) return "text-green-600 dark:text-green-400";
    if (score >= 56) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 41) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
}

function scoreBg(score: number): string {
    if (score >= 83) return "bg-emerald-100 border-emerald-600 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-100";
    if (score >= 71) return "bg-green-100 border-green-600 text-green-900 dark:bg-green-900/30 dark:border-green-400 dark:text-green-100";
    if (score >= 56) return "bg-yellow-100 border-yellow-600 text-yellow-900 dark:bg-yellow-900/30 dark:border-yellow-400 dark:text-yellow-100";
    if (score >= 41) return "bg-orange-100 border-orange-600 text-orange-900 dark:bg-orange-900/30 dark:border-orange-400 dark:text-orange-100";
    return "bg-red-100 border-red-600 text-red-900 dark:bg-red-900/30 dark:border-red-400 dark:text-red-100";
}

function scoreProgressColor(score: number): string {
    if (score >= 83) return "[&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-400";
    if (score >= 71) return "[&>div]:bg-green-600 dark:[&>div]:bg-green-400";
    if (score >= 56) return "[&>div]:bg-yellow-600 dark:[&>div]:bg-yellow-400";
    if (score >= 41) return "[&>div]:bg-orange-600 dark:[&>div]:bg-orange-400";
    return "[&>div]:bg-red-600 dark:[&>div]:bg-red-400";
}

function scoreLabel(score: number): string {
    if (score >= 93) return "Exceptional";
    if (score >= 83) return "Excellent";
    if (score >= 71) return "Good";
    if (score >= 56) return "Average";
    if (score >= 41) return "Below Average";
    if (score >= 21) return "Needs Work";
    return "Critical";
}

function scoreBadgeVariant(
    score: number,
): "default" | "secondary" | "destructive" {
    if (score >= 71) return "default";
    if (score >= 56) return "secondary";
    return "destructive";
}

/* ------------------------------------------------------------------ */
/*  Circular score ring                                                */
/* ------------------------------------------------------------------ */

function ScoreRing({
    score,
    size = 100,
    strokeWidth = 8,
}: {
    score: number;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getStrokeColor = (s: number) => {
        if (s >= 83) return "#10b981";
        if (s >= 71) return "#22c55e";
        if (s >= 56) return "#eab308";
        if (s >= 41) return "#f97316";
        return "#ef4444";
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-black/10 dark:text-white/10"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getStrokeColor(score)}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: "stroke-dashoffset 1s ease-out",
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-mono text-3xl font-black tracking-tighter ${scoreColor(score)}`}>
                    {score}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                    / 100
                </span>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main drawer component                                              */
/* ------------------------------------------------------------------ */

export function AnalysisDrawer({
    fileId,
    fileName,
    open,
    onOpenChange,
}: AnalysisDrawerProps) {
    const [analysis, setAnalysis] = useState<AiResumeAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(
        new Set(),
    );

    const lastFetchedFileId = useRef<string | null>(null);

    useEffect(() => {
        if (!open || !fileId) return;
        if (lastFetchedFileId.current === fileId && analysis) return;

        setLoading(true);
        setError(null);
        setAnalysis(null);
        setExpandedSections(new Set());

        analyzeResumePdf(fileId).then((result) => {
            if (result.success && result.analysis) {
                setAnalysis(result.analysis);
                lastFetchedFileId.current = fileId;
            } else {
                setError(result.error || "Analysis failed");
            }
            setLoading(false);
        });
    }, [open, fileId]); // eslint-disable-line react-hooks/exhaustive-deps

    function toggleSection(idx: number) {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    }

    function expandAll() {
        if (!analysis) return;
        setExpandedSections(
            new Set(analysis.sections.map((_, i) => i)),
        );
    }

    function collapseAll() {
        setExpandedSections(new Set());
    }

    function handleReanalyze() {
        if (!fileId) return;
        setLoading(true);
        setError(null);
        setAnalysis(null);
        setExpandedSections(new Set());

        analyzeResumePdf(fileId, true).then((result) => {
            if (result.success && result.analysis) {
                setAnalysis(result.analysis);
                lastFetchedFileId.current = fileId;
            } else {
                setError(result.error || "Analysis failed");
            }
            setLoading(false);
        });
    }

    function handleRetry() {
        if (!fileId) return;
        setLoading(true);
        setError(null);
        setAnalysis(null);

        analyzeResumePdf(fileId).then((result) => {
            if (result.success && result.analysis) {
                setAnalysis(result.analysis);
                lastFetchedFileId.current = fileId;
            } else {
                setError(result.error || "Analysis failed");
            }
            setLoading(false);
        });
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[85vh]">
                {/* --------- HEADER --------- */}
                <DrawerHeader className="border-b-4 border-black px-6 py-4 dark:border-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-yellow-600 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <Sparkles className="h-6 w-6 text-black dark:text-white" />
                            </div>
                            <div>
                                <DrawerTitle className="font-mono text-xl font-black uppercase tracking-tight text-black dark:text-white">
                                    AI Resume Analysis
                                </DrawerTitle>
                                <DrawerDescription className="font-mono text-xs font-bold uppercase text-muted-foreground">
                                    {fileName || "Resume"} — Powered by Gemini
                                </DrawerDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {analysis && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReanalyze}
                                    disabled={loading}
                                    className="gap-1.5 border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                                >
                                    <RefreshCw
                                        className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                                    />
                                    Re-analyze
                                </Button>
                            )}
                        </div>
                    </div>
                </DrawerHeader>

                <ScrollArea className="flex-1 overflow-y-auto bg-yellow-50/50 dark:bg-zinc-900/50">
                    <div className="px-6 py-8">
                        {/* --------- LOADING --------- */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-black/20 dark:bg-white/20" />
                                    <div className="relative flex h-20 w-20 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                        <Spinner className="h-8 w-8 text-black dark:text-white" />
                                    </div>
                                </div>
                                <p className="mt-8 font-mono text-lg font-bold uppercase tracking-widest text-black dark:text-white">
                                    Analyzing...
                                </p>
                                <p className="mt-2 font-mono text-xs font-medium text-muted-foreground">
                                    AI IS REVIEWING CONTENT, FORMATTING, AND ATS COMPATIBILITY
                                </p>
                            </div>
                        )}

                        {/* --------- ERROR --------- */}
                        {error && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-red-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-red-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="mt-6 font-mono text-lg font-bold uppercase text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-6 border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                    onClick={handleRetry}
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}

                        {/* --------- ANALYSIS RESULTS --------- */}
                        {analysis && (
                            <div className="space-y-8">
                                {/* ===== HERO: Score + Summary ===== */}
                                <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                                    {/* Score ring */}
                                    <div className="flex shrink-0 flex-col items-center gap-4">
                                        <div className="rounded-full border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                                            <ScoreRing
                                                score={analysis.overallScore}
                                                size={120}
                                                strokeWidth={12}
                                            />
                                        </div>
                                        <Badge
                                            variant={scoreBadgeVariant(
                                                analysis.overallScore,
                                            )}
                                            className="mt-2 border-2 border-black px-4 py-1 font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                        >
                                            {scoreLabel(analysis.overallScore)}
                                        </Badge>
                                    </div>

                                    {/* Summary */}
                                    <div className="flex-1 space-y-4">
                                        <div
                                            className={`rounded-none border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] ${scoreBg(analysis.overallScore)}`}
                                        >
                                            <h3 className="mb-2 font-mono text-sm font-black uppercase tracking-tight opacity-70">
                                                Executive Summary
                                            </h3>
                                            <p className="text-base font-medium leading-relaxed">
                                                {analysis.summaryFeedback}
                                            </p>
                                        </div>

                                        {/* Quick stats row */}
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs">
                                                <Shield className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="text-muted-foreground">
                                                    ATS:
                                                </span>
                                                <span
                                                    className={`font-semibold ${scoreColor(analysis.atsCompatibility.score)}`}
                                                >
                                                    {
                                                        analysis
                                                            .atsCompatibility
                                                            .score
                                                    }
                                                    /100
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs">
                                                <Target className="h-3.5 w-3.5 text-purple-500" />
                                                <span className="text-muted-foreground">
                                                    Sections:
                                                </span>
                                                <span className="font-semibold">
                                                    {analysis.sections.length}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs">
                                                <Star className="h-3.5 w-3.5 text-amber-500" />
                                                <span className="text-muted-foreground">
                                                    Strengths:
                                                </span>
                                                <span className="font-semibold">
                                                    {
                                                        analysis.topStrengths
                                                            .length
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ===== STRENGTHS & IMPROVEMENTS (side by side) ===== */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Strengths */}
                                    <div className="rounded-xl border bg-emerald-500/5 p-4">
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="h-4 w-4" />
                                            Top Strengths
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {analysis.topStrengths.map(
                                                (s) => (
                                                    <li
                                                        key={s}
                                                        className="flex items-start gap-2.5 text-sm"
                                                    >
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                                        <span className="leading-snug">
                                                            {s}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    {/* Improvements */}
                                    <div className="rounded-xl border bg-orange-500/5 p-4">
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                            <Zap className="h-4 w-4" />
                                            Key Improvements
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {analysis.criticalImprovements.map(
                                                (imp) => (
                                                    <li
                                                        key={imp}
                                                        className="flex items-start gap-2.5 text-sm"
                                                    >
                                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                                        <span className="leading-snug">
                                                            {imp}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* ===== ATS COMPATIBILITY ===== */}
                                <div className="rounded-xl border p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold">
                                            <Shield className="h-4 w-4 text-blue-500" />
                                            ATS Compatibility
                                        </h3>
                                        <Badge
                                            variant={scoreBadgeVariant(
                                                analysis.atsCompatibility.score,
                                            )}
                                        >
                                            {analysis.atsCompatibility.score}
                                            /100
                                        </Badge>
                                    </div>
                                    <Progress
                                        value={
                                            analysis.atsCompatibility.score
                                        }
                                        className={`mb-3 h-2 ${scoreProgressColor(analysis.atsCompatibility.score)}`}
                                    />
                                    {analysis.atsCompatibility.issues.length >
                                        0 ? (
                                        <ul className="space-y-2">
                                            {analysis.atsCompatibility.issues.map(
                                                (issue) => (
                                                    <li
                                                        key={issue}
                                                        className="flex items-start gap-2.5 text-sm"
                                                    >
                                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                                                        <span className="leading-snug text-muted-foreground">
                                                            {issue}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-4 w-4" />
                                            No ATS issues detected — your resume
                                            is parser-friendly!
                                        </p>
                                    )}
                                </div>

                                {/* ===== SECTION-BY-SECTION BREAKDOWN ===== */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold">
                                            Section-by-Section Breakdown
                                        </h3>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs"
                                                onClick={expandAll}
                                            >
                                                Expand All
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs"
                                                onClick={collapseAll}
                                            >
                                                Collapse
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {analysis.sections.map(
                                            (section, idx) => {
                                                const isExpanded =
                                                    expandedSections.has(idx);
                                                return (
                                                    <div
                                                        key={section.name}
                                                        className={`overflow-hidden rounded-xl border transition-colors ${isExpanded
                                                            ? "bg-muted/30"
                                                            : "hover:bg-muted/20"
                                                            }`}
                                                    >
                                                        {/* Collapsed header */}
                                                        <button
                                                            className="flex w-full items-center gap-3 p-3.5 text-left"
                                                            onClick={() =>
                                                                toggleSection(
                                                                    idx,
                                                                )
                                                            }
                                                        >
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            section.name
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant={scoreBadgeVariant(
                                                                            section.score,
                                                                        )}
                                                                        className="text-[10px] px-1.5 py-0"
                                                                    >
                                                                        {
                                                                            section.score
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                {/* Mini progress bar */}
                                                                <div className="mt-1.5">
                                                                    <Progress
                                                                        value={
                                                                            section.score
                                                                        }
                                                                        className={`h-1 ${scoreProgressColor(section.score)}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                            )}
                                                        </button>

                                                        {/* Expanded content */}
                                                        {isExpanded && (
                                                            <div className="space-y-4 border-t px-4 pb-4 pt-3">
                                                                {/* Feedback */}
                                                                <div className="rounded-lg bg-background/50 p-3">
                                                                    <p className="text-sm leading-relaxed text-foreground">
                                                                        {
                                                                            section.feedback
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="grid gap-3 sm:grid-cols-2">
                                                                    {/* Strengths */}
                                                                    {section
                                                                        .strengths
                                                                        .length >
                                                                        0 && (
                                                                            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                                                                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                                    What&apos;s
                                                                                    working
                                                                                </p>
                                                                                <ul className="space-y-1.5">
                                                                                    {section.strengths.map(
                                                                                        (
                                                                                            s,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    s
                                                                                                }
                                                                                                className="flex items-start gap-2 text-xs leading-snug"
                                                                                            >
                                                                                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                                                                                                {
                                                                                                    s
                                                                                                }
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        )}

                                                                    {/* Improvements */}
                                                                    {section
                                                                        .improvements
                                                                        .length >
                                                                        0 && (
                                                                            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                                                                                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                                                                                    <Zap className="h-3.5 w-3.5" />
                                                                                    To
                                                                                    improve
                                                                                </p>
                                                                                <ul className="space-y-1.5">
                                                                                    {section.improvements.map(
                                                                                        (
                                                                                            imp,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    imp
                                                                                                }
                                                                                                className="flex items-start gap-2 text-xs leading-snug"
                                                                                            >
                                                                                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-orange-500" />
                                                                                                {
                                                                                                    imp
                                                                                                }
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                {/* Footer disclaimer */}
                                <p className="pb-4 text-center text-[11px] text-muted-foreground/60">
                                    Analysis generated by AI · Scores are
                                    calibrated guidelines, not absolute measures
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
