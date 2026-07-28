"use client";

import { Label } from "@/components/ui/label";
import type { EditorFormProps } from "@/lib/types";
import AiEnhanceButton from "./AiEnhanceButton";
import RichTextEditor from "./RichTextEditor";

const MAX_LENGTH = 1000;

export default function ProfileSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const summary = resumeData.summary ?? "";

    return (
        <div className="w-full min-w-0 max-w-full space-y-1.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Label htmlFor="summary" className="text-sm font-medium">
                        Professional Summary
                    </Label>
                    <AiEnhanceButton
                        fieldType="profile"
                        currentText={summary}
                        context={{
                            jobTitle: resumeData.jobTitle ?? "",
                            skills: (resumeData.skills ?? []).slice(0, 10).join(", "),
                        }}
                        maxLength={1000}
                        onEnhanced={(text) =>
                            setResumeData((prev) => ({
                                ...prev,
                                summary: text || undefined,
                            }))
                        }
                    />
                </div>
            </div>
            <RichTextEditor
                value={summary}
                onChange={(html) =>
                    setResumeData((prev) => ({
                        ...prev,
                        summary: html || undefined,
                    }))
                }
                placeholder="Write a concise professional summary highlighting your experience, skills, and career goals..."
                maxLength={MAX_LENGTH}
            />
        </div>
    );
}
