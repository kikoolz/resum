"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ResumeValues } from "@/lib/validation";
import { saveResume } from "@/app/dashboard/actions";
import { toast } from "sonner";

const DEBOUNCE_MS = 2500; // Wait 2.5 s after last keystroke before saving

export default function useAutoSaveResume(resumeData: ResumeValues) {
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaveError, setLastSaveError] = useState<string | null>(null);

    // ---- Refs keep mutable state without causing re-renders ----
    const lastSavedJson = useRef(JSON.stringify(resumeData));
    const latestDataRef = useRef(resumeData);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const savingRef = useRef(false);

    // Always keep the ref pointing at the latest data
    latestDataRef.current = resumeData;

    // ---- Core save function (called from timer, never directly) ----
    const performSave = useCallback(async () => {
        // Guard: skip if already saving or nothing changed
        if (savingRef.current) return;
        const dataToSave = latestDataRef.current;
        const jsonSnapshot = JSON.stringify(dataToSave);
        if (jsonSnapshot === lastSavedJson.current) return;

        savingRef.current = true;
        setIsSaving(true);
        setLastSaveError(null);

        try {
            const result = await saveResume(dataToSave);

            if (!result.success) {
                throw new Error(result.error || "Save failed");
            }

            // Commit: mark this snapshot as "saved"
            lastSavedJson.current = jsonSnapshot;

            // Did the data change while we were saving? If so, schedule another.
            const currentJson = JSON.stringify(latestDataRef.current);
            if (currentJson !== jsonSnapshot) {
                setHasUnsavedChanges(true);
                timerRef.current = setTimeout(performSave, 1000);
            } else {
                setHasUnsavedChanges(false);
            }
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Failed to save";
            setLastSaveError(msg);
            toast.error("Auto-save failed", { description: msg });
            // Don't auto-retry on error – the next user edit will trigger a new save
        } finally {
            savingRef.current = false;
            setIsSaving(false);
        }
    }, []);

    // ---- Effect: schedule a debounced save whenever resumeData changes ----
    useEffect(() => {
        const currentJson = JSON.stringify(resumeData);
        const changed = currentJson !== lastSavedJson.current;
        setHasUnsavedChanges(changed);

        if (!changed) return;

        // Clear any pending timer so we only fire once after the user stops typing
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(performSave, DEBOUNCE_MS);

        return () => clearTimeout(timerRef.current);
    }, [resumeData, performSave]);

    return { isSaving, hasUnsavedChanges, lastSaveError };
}
