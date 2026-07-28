"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { EditorFormProps } from "@/lib/types";

export default function SkillsSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const [inputValue, setInputValue] = useState("");
    const skills = resumeData.skills ?? [];

    const addSkill = useCallback(() => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        const normalized = trimmed.slice(0, 100);
        if (skills.includes(normalized)) return;

        setResumeData((prev) => ({
            ...prev,
            skills: [...(prev.skills ?? []), normalized],
        }));
        setInputValue("");
    }, [inputValue, skills, setResumeData]);

    const removeSkill = useCallback(
        (skill: string) => {
            setResumeData((prev) => ({
                ...prev,
                skills: (prev.skills ?? []).filter((s) => s !== skill),
            }));
        },
        [setResumeData],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
            }
        },
        [addSkill],
    );

    return (
        <div className="w-full min-w-0 max-w-full space-y-4">
            <div className="flex gap-2">
                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="skill-input" className="text-sm font-medium">
                        Add skill
                    </Label>
                    <Input
                        id="skill-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. JavaScript, Project Management"
                        maxLength={100}
                    />
                </div>
                <div className="flex flex-col justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addSkill}
                        disabled={!inputValue.trim()}
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>

            {skills.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="gap-1 pr-1"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                                    aria-label={`Remove ${skill}`}
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
