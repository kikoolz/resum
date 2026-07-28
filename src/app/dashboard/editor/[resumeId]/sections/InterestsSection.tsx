"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Eye, EyeOff, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorFormProps } from "@/lib/types";
import type { ResumeValues } from "@/lib/validation";

type InterestItem = NonNullable<ResumeValues["interests"]>[number];

export default function InterestsSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const [inputValue, setInputValue] = useState("");
    const interests = resumeData.interests ?? [];

    const addInterest = useCallback(() => {
        const trimmed = inputValue.trim().slice(0, 100);
        if (!trimmed) return;
        const normalized = trimmed.toLowerCase();
        const exists = interests.some(
            (i) => i.name?.trim().toLowerCase() === normalized
        );
        if (exists) return;

        const newItem: InterestItem = {
            id: `new-${crypto.randomUUID()}`,
            name: trimmed,
            visible: true,
            displayOrder: interests.length,
        };
        setResumeData((prev) => ({
            ...prev,
            interests: [...(prev.interests ?? []), newItem],
        }));
        setInputValue("");
    }, [inputValue, interests, setResumeData]);

    const removeInterest = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                interests: (prev.interests ?? []).filter((_, i) => i !== index),
            }));
        },
        [setResumeData]
    );

    const toggleVisible = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                interests: (prev.interests ?? []).map((item, i) =>
                    i === index ? { ...item, visible: !item.visible } : item
                ),
            }));
        },
        [setResumeData]
    );

    const duplicateInterest = useCallback(
        (index: number) => {
            setResumeData((prev) => {
                const list = [...(prev.interests ?? [])];
                const item = list[index];
                if (!item) return prev;
                const duplicate: InterestItem = {
                    ...item,
                    id: `new-${crypto.randomUUID()}`,
                    displayOrder: list.length,
                };
                list.splice(index + 1, 0, duplicate);
                return {
                    ...prev,
                    interests: list.map((entry, i) => ({
                        ...entry,
                        displayOrder: i,
                    })),
                };
            });
        },
        [setResumeData],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addInterest();
            }
        },
        [addInterest]
    );

    return (
        <div className="w-full min-w-0 max-w-full space-y-4">
            <div className="flex gap-2">
                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="interest-input" className="text-sm font-medium">
                        Add interest
                    </Label>
                    <Input
                        id="interest-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Photography, Hiking"
                        maxLength={100}
                    />
                </div>
                <div className="flex flex-col justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addInterest}
                        disabled={!inputValue.trim()}
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>

            {interests.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Interests</Label>
                    <div className="flex flex-wrap gap-2">
                        {interests.map((item, index) => (
                            <Badge
                                key={item.id ?? index}
                                variant="secondary"
                                className={cn(
                                    "gap-1 pr-1",
                                    !item.visible && "opacity-60",
                                )}
                            >
                                {item.name}
                                <button
                                    type="button"
                                    onClick={() => toggleVisible(index)}
                                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                                    title={item.visible ? "Hide" : "Show"}
                                >
                                    {item.visible ? (
                                        <Eye className="h-3 w-3" />
                                    ) : (
                                        <EyeOff className="h-3 w-3" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => duplicateInterest(index)}
                                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                                    title="Duplicate"
                                >
                                    <Copy className="h-3 w-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeInterest(index)}
                                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                                    aria-label={`Remove ${item.name}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
