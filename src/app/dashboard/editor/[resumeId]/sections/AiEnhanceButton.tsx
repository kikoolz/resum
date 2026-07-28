"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { enhanceResumeField, type EnhanceFieldType } from "@/lib/ai-enhance";

interface AiEnhanceButtonProps {
    fieldType: EnhanceFieldType;
    currentText: string;
    context: Record<string, string>;
    maxLength?: number;
    onEnhanced: (newText: string) => void;
}

export default function AiEnhanceButton({
    fieldType,
    currentText,
    context,
    maxLength,
    onEnhanced,
}: AiEnhanceButtonProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleEnhance() {
        if (loading || !currentText?.trim()) return;
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await enhanceResumeField({
                fieldType,
                currentText,
                context,
                maxLength,
            });

            if (result.success && result.enhancedText) {
                onEnhanced(result.enhancedText);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
            } else {
                setError(result.error || "Enhancement failed");
                setTimeout(() => setError(null), 3000);
            }
        } catch {
            setError("Something went wrong");
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    }

    const isDisabled = loading || !currentText?.trim();

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={handleEnhance}
                        disabled={isDisabled}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium transition-all ${
                            success
                                ? "border-green-300 bg-green-50 text-green-600 dark:border-green-700 dark:bg-green-950/50 dark:text-green-400"
                                : error
                                  ? "border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-950/50 dark:text-red-400"
                                  : "border-violet-300/30 bg-gradient-to-r from-violet-50 to-amber-50 text-violet-600 hover:from-violet-100 hover:to-amber-100 dark:border-violet-500/20 dark:from-violet-950/30 dark:to-amber-950/20 dark:text-violet-400 dark:hover:from-violet-950/50 dark:hover:to-amber-950/30"
                        } ${isDisabled && !loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    >
                        {loading ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : success ? (
                            <Check className="size-3" />
                        ) : (
                            <Sparkles className="size-3" />
                        )}
                        <span>AI</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-52 text-center">
                    <p className="text-xs font-medium">
                        {loading
                            ? "Enhancing..."
                            : success
                              ? "Done!"
                              : error
                                ? error
                                : currentText?.trim()
                                  ? "AI-enhance this text"
                                  : "Enter some text first"}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
