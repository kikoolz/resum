"use client";

import { useEffect } from "react";

export default function useUnloadWarning(condition: boolean) {
    useEffect(() => {
        if (!condition) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [condition]);
}
