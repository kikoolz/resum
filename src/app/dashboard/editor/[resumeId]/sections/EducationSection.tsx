"use client";

import { useState, useCallback, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, X, Copy } from "lucide-react";
import type { EditorFormProps } from "@/lib/types";
import type { ResumeValues } from "@/lib/validation";
import AiEnhanceButton from "./AiEnhanceButton";

type EducationEntry = NonNullable<ResumeValues["educations"]>[number];

const DEFAULT_ENTRY: EducationEntry = {
    degree: "",
    school: "",
    fieldOfStudy: "",
    gpa: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    visible: true,
};

function getSummary(entry: EducationEntry): string {
    const deg = entry.degree?.trim();
    const sch = entry.school?.trim();
    if (deg && sch) return `${deg} at ${sch}`;
    if (deg) return deg;
    if (sch) return sch;
    return "Untitled Education";
}

export default function EducationSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const entries = resumeData.educations ?? [];
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [localEntry, setLocalEntry] = useState<EducationEntry | null>(null);
    const [isNewEntry, setIsNewEntry] = useState(false);

    // Sync local edits to resumeData so the preview updates in real-time
    useEffect(() => {
        if (localEntry && editingIndex !== null) {
            setResumeData((prev) => {
                const list = [...(prev.educations ?? [])];
                list[editingIndex] = { ...localEntry };
                return { ...prev, educations: list };
            });
        }
    }, [localEntry, editingIndex, setResumeData]);

    const handleAdd = useCallback(() => {
        const newEntry: EducationEntry = {
            ...DEFAULT_ENTRY,
            id: crypto.randomUUID(),
        };
        setResumeData((prev) => ({
            ...prev,
            educations: [...(prev.educations ?? []), newEntry],
        }));
        setLocalEntry({ ...newEntry });
        setEditingIndex(entries.length);
        setIsNewEntry(true);
    }, [entries.length, setResumeData]);

    const handleEdit = useCallback((idx: number) => {
        const entry = entries[idx];
        if (entry) {
            setLocalEntry({ ...entry });
            setEditingIndex(idx);
            setIsNewEntry(false);
        }
    }, [entries]);

    const handleSave = useCallback(() => {
        if (localEntry === null || editingIndex === null) return;
        setResumeData((prev) => {
            const list = [...(prev.educations ?? [])];
            list[editingIndex] = { ...localEntry };
            return { ...prev, educations: list };
        });
        setLocalEntry(null);
        setEditingIndex(null);
        setIsNewEntry(false);
    }, [localEntry, editingIndex, setResumeData]);

    const handleCancel = useCallback(() => {
        if (editingIndex === null) return;
        if (isNewEntry) {
            setResumeData((prev) => {
                const list = [...(prev.educations ?? [])];
                list.splice(editingIndex, 1);
                return { ...prev, educations: list };
            });
        }
        setLocalEntry(null);
        setEditingIndex(null);
        setIsNewEntry(false);
    }, [editingIndex, isNewEntry, setResumeData]);

    const toggleVisible = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.educations ?? [])];
                const item = list[idx];
                if (item) {
                    list[idx] = { ...item, visible: !item.visible };
                }
                return { ...prev, educations: list };
            });
        },
        [setResumeData],
    );

    const handleDelete = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.educations ?? [])];
                list.splice(idx, 1);
                return { ...prev, educations: list };
            });
            if (editingIndex === idx) {
                setLocalEntry(null);
                setEditingIndex(null);
            } else if (editingIndex !== null && editingIndex > idx) {
                setEditingIndex((prev) => (prev !== null ? prev - 1 : null));
            }
        },
        [editingIndex, setResumeData],
    );

    const handleDuplicate = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.educations ?? [])];
                const item = list[idx];
                if (!item) return prev;
                const duplicate: EducationEntry = {
                    ...item,
                    id: crypto.randomUUID(),
                };
                list.splice(idx + 1, 0, duplicate);
                return { ...prev, educations: list };
            });
            setEditingIndex((current) =>
                current !== null && current > idx ? current + 1 : current,
            );
        },
        [setResumeData],
    );

    const handleReorder = useCallback(
        (newOrder: EducationEntry[]) => {
            setResumeData((prev) => ({
                ...prev,
                educations: newOrder,
            }));
        },
        [setResumeData],
    );

    if (editingIndex !== null && localEntry !== null) {
        return (
            <div className="w-full min-w-0 max-w-full space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-medium">
                        {editingIndex >= entries.length
                            ? "New Education"
                            : "Edit Education"}
                    </h4>
                    <div className="flex w-full justify-end gap-2 sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                        >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                        >
                            <Check className="h-3.5 w-3.5" />
                            Save
                        </Button>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="edu-degree">Degree</Label>
                        <Input
                            id="edu-degree"
                            value={localEntry.degree ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    degree: e.target.value,
                                }))
                            }
                            placeholder="e.g. Bachelor of Science"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edu-school">School</Label>
                        <Input
                            id="edu-school"
                            value={localEntry.school ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    school: e.target.value,
                                }))
                            }
                            placeholder="University or institution name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edu-field">Field of Study</Label>
                        <Input
                            id="edu-field"
                            value={localEntry.fieldOfStudy ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    fieldOfStudy: e.target.value,
                                }))
                            }
                            placeholder="e.g. Computer Science"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edu-gpa">GPA</Label>
                        <Input
                            id="edu-gpa"
                            value={localEntry.gpa ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    gpa: e.target.value,
                                }))
                            }
                            placeholder="e.g. 3.8"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edu-location">Location</Label>
                        <Input
                            id="edu-location"
                            value={localEntry.location ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    location: e.target.value,
                                }))
                            }
                            placeholder="City, Country"
                        />
                    </div>
                    <div className="grid gap-3">
                        <div className="space-y-1.5">
                            <Label>Start Date</Label>
                            <DatePicker
                                value={localEntry.startDate}
                                onChange={(d) =>
                                    setLocalEntry((p) => ({
                                        ...p!,
                                        startDate: d,
                                    }))
                                }
                                placeholder="Select start date"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>End Date</Label>
                            <DatePicker
                                value={localEntry.endDate}
                                onChange={(d) =>
                                    setLocalEntry((p) => ({
                                        ...p!,
                                        endDate: d,
                                    }))
                                }
                                placeholder="Select end date"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                            <Label htmlFor="edu-desc">Description</Label>
                            <AiEnhanceButton
                                fieldType="education"
                                currentText={localEntry.description ?? ""}
                                context={{
                                    degree: localEntry.degree ?? "",
                                    school: localEntry.school ?? "",
                                    fieldOfStudy: localEntry.fieldOfStudy ?? "",
                                }}
                                onEnhanced={(text) =>
                                    setLocalEntry((p) => ({
                                        ...p!,
                                        description: text || undefined,
                                    }))
                                }
                            />
                        </div>
                        <RichTextEditor
                            value={localEntry.description ?? ""}
                            onChange={(html) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    description: html || undefined,
                                }))
                            }
                            placeholder="Relevant coursework, awards, activities..."
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 max-w-full space-y-3">
            <Reorder.Group
                axis="y"
                values={entries}
                onReorder={handleReorder}
                as="div"
                className="w-full min-w-0 max-w-full space-y-2 overflow-x-hidden"
            >
                {entries.map((entry, idx) => (
                    <Reorder.Item
                        key={entry.id ?? `edu-${idx}`}
                        value={entry}
                        className="relative w-full min-w-0 overflow-hidden"
                    >
                        <div
                            className={`flex w-full min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-md border px-3 py-2 ${
                                entry.visible === false ? "opacity-60" : ""
                            }`}
                        >
                            <span className="min-w-0 flex-1 truncate text-sm">
                                {getSummary(entry)}
                            </span>
                            <div className="flex shrink-0 items-center gap-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => toggleVisible(idx)}
                                    title={
                                        entry.visible !== false
                                            ? "Hide"
                                            : "Show"
                                    }
                                >
                                    {entry.visible !== false ? (
                                        <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleEdit(idx)}
                                    title="Edit"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleDuplicate(idx)}
                                    title="Duplicate"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleDelete(idx)}
                                    title="Delete"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAdd}
            >
                <Plus className="h-4 w-4" />
                Add Education
            </Button>
        </div>
    );
}
