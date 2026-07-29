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

function scoreColor(score: number): string {
    if (score >= 83) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 71) return "text-green-600 dark:text-green-400";
    if (score >= 56) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 41) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
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
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-foreground/10"
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
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black tracking-tighter ${scoreColor(score)}`}>
                    {score}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    / 100
                </span>
            </div>
        </div>
    );
}

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
        setExpandedSections(new Set(analysis.sections.map((_, i) => i)));
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
                {/* Header */}
                <DrawerHeader className="px-8 pb-6 pt-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <DrawerDescription className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                AI Resume Analysis
                            </DrawerDescription>
                            <DrawerTitle className="text-2xl font-black tracking-tight">
                                {fileName || "Resume"}
                            </DrawerTitle>
                        </div>
                        {analysis && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReanalyze}
                                disabled={loading}
                                className="gap-1.5 rounded-none px-4 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                                Re-analyze
                            </Button>
                        )}
                    </div>
                </DrawerHeader>

                <div className="mx-8 h-px bg-foreground/10" />

                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="px-8 py-8">
                        {/* Loading */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Spinner className="h-6 w-6 text-muted-foreground" />
                                <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                    Analyzing your resume...
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground/60">
                                    Reviewing content, formatting, and ATS compatibility
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <XCircle className="h-8 w-8 text-destructive/60" />
                                <p className="mt-4 text-sm font-medium text-destructive">
                                    {error}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-4 rounded-none font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                                    onClick={handleRetry}
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}

                        {/* Results */}
                        {analysis && (
                            <div className="space-y-10">
                                {/* Hero: Score + Summary */}
                                <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                                    <div className="flex shrink-0 flex-col items-center gap-4">
                                        <ScoreRing
                                            score={analysis.overallScore}
                                            size={120}
                                            strokeWidth={10}
                                        />
                                        <Badge
                                            variant={analysis.overallScore >= 71 ? "default" : analysis.overallScore >= 56 ? "secondary" : "destructive"}
                                            className="rounded-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            {scoreLabel(analysis.overallScore)}
                                        </Badge>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                                Executive Summary
                                            </h3>
                                            <p className="text-sm leading-relaxed text-foreground">
                                                {analysis.summaryFeedback}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Shield className="h-3.5 w-3.5" />
                                                <span>ATS:</span>
                                                <span className={`font-semibold ${scoreColor(analysis.atsCompatibility.score)}`}>
                                                    {analysis.atsCompatibility.score}/100
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Target className="h-3.5 w-3.5" />
                                                <span>Sections:</span>
                                                <span className="font-semibold">{analysis.sections.length}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Star className="h-3.5 w-3.5" />
                                                <span>Strengths:</span>
                                                <span className="font-semibold">{analysis.topStrengths.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-foreground/10" />

                                {/* Strengths & Improvements */}
                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div>
                                        <h3 className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            Top Strengths
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysis.topStrengths.map((s) => (
                                                <li key={s} className="flex items-start gap-3 text-sm leading-relaxed">
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                                            <Zap className="h-3.5 w-3.5" />
                                            Key Improvements
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysis.criticalImprovements.map((imp) => (
                                                <li key={imp} className="flex items-start gap-3 text-sm leading-relaxed">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                                    <span>{imp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="h-px bg-foreground/10" />

                                {/* ATS Compatibility */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
                                            <Shield className="h-3.5 w-3.5 text-blue-500" />
                                            ATS Compatibility
                                        </h3>
                                        <span className={`text-sm font-bold ${scoreColor(analysis.atsCompatibility.score)}`}>
                                            {analysis.atsCompatibility.score}/100
                                        </span>
                                    </div>
                                    <Progress
                                        value={analysis.atsCompatibility.score}
                                        className={`mb-4 h-1.5 ${scoreProgressColor(analysis.atsCompatibility.score)}`}
                                    />
                                    {analysis.atsCompatibility.issues.length > 0 ? (
                                        <ul className="space-y-2">
                                            {analysis.atsCompatibility.issues.map((issue) => (
                                                <li key={issue} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" />
                                                    <span>{issue}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-4 w-4" />
                                            No ATS issues detected
                                        </p>
                                    )}
                                </div>

                                <div className="h-px bg-foreground/10" />

                                {/* Section Breakdown */}
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-xs font-medium uppercase tracking-[0.2em]">
                                            Section Breakdown
                                        </h3>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 rounded-none px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                                onClick={expandAll}
                                            >
                                                Expand
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 rounded-none px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                                onClick={collapseAll}
                                            >
                                                Collapse
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        {analysis.sections.map((section, idx) => {
                                            const isExpanded = expandedSections.has(idx);
                                            return (
                                                <div key={section.name} className="border-b border-foreground/5 last:border-b-0">
                                                    <button
                                                        className="flex w-full items-center gap-3 py-3 text-left"
                                                        onClick={() => toggleSection(idx)}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-sm font-medium">{section.name}</span>
                                                                <Badge
                                                                    variant={section.score >= 71 ? "default" : section.score >= 56 ? "secondary" : "destructive"}
                                                                    className="rounded-none px-1.5 py-0 text-[10px]"
                                                                >
                                                                    {section.score}
                                                                </Badge>
                                                            </div>
                                                            <div className="mt-1.5">
                                                                <Progress
                                                                    value={section.score}
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

                                                    {isExpanded && (
                                                        <div className="space-y-4 pb-4 pl-0">
                                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                                {section.feedback}
                                                            </p>

                                                            <div className="grid gap-3 sm:grid-cols-2">
                                                                {section.strengths.length > 0 && (
                                                                    <div>
                                                                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                                            <CheckCircle2 className="h-3 w-3" />
                                                                            What&apos;s working
                                                                        </p>
                                                                        <ul className="space-y-1.5">
                                                                            {section.strengths.map((s) => (
                                                                                <li key={s} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                                                                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                                                                                    {s}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {section.improvements.length > 0 && (
                                                                    <div>
                                                                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-orange-600 dark:text-orange-400">
                                                                            <Zap className="h-3 w-3" />
                                                                            To improve
                                                                        </p>
                                                                        <ul className="space-y-1.5">
                                                                            {section.improvements.map((imp) => (
                                                                                <li key={imp} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                                                                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-500" />
                                                                                    {imp}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <p className="pb-4 text-center text-[11px] text-muted-foreground/50">
                                    Analysis generated by AI — scores are calibrated guidelines, not absolute measures
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
