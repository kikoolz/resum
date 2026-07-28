"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
            <div className="rounded-xl border-4 border-red-500 bg-red-50 p-8 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] dark:bg-red-950/30 dark:shadow-[4px_4px_0px_0px_rgba(239,68,68,0.5)]">
                <p className="font-mono text-2xl font-black uppercase tracking-tight text-red-600 dark:text-red-400">
                    SOMETHING WENT WRONG
                </p>
                <p className="mt-2 text-sm text-red-500/80">
                    {error.message || "An unexpected error occurred."}
                </p>
                <Button
                    onClick={reset}
                    className="mt-6 border-2 border-black bg-black font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-0 active:shadow-none dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
                >
                    TRY AGAIN
                </Button>
            </div>
        </div>
    );
}
