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

type ProjectEntry = NonNullable<ResumeValues["projects"]>[number];

const DEFAULT_ENTRY: ProjectEntry = {
    title: "",
    subtitle: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
    visible: true,
};

function getSummary(entry: ProjectEntry): string {
    const title = entry.title?.trim();
    return title || "Untitled Project";
}

function isEmpty(entry: ProjectEntry): boolean {
    return (
        !entry.title?.trim() &&
        !entry.subtitle?.trim() &&
        !entry.description?.trim() &&
        !entry.link?.trim() &&
        !entry.startDate?.trim() &&
        !entry.endDate?.trim()
    );
}

export default function ProjectsSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const entries = resumeData.projects ?? [];
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [localEntry, setLocalEntry] = useState<ProjectEntry | null>(null);

    // Sync local edits to resumeData so the preview updates in real-time
    useEffect(() => {
        if (localEntry && editingIndex !== null) {
            setResumeData((prev) => {
                const list = [...(prev.projects ?? [])];
                list[editingIndex] = { ...localEntry };
                return { ...prev, projects: list };
            });
        }
    }, [localEntry, editingIndex, setResumeData]);

    const handleAdd = useCallback(() => {
        const newEntry: ProjectEntry = { ...DEFAULT_ENTRY };
        setResumeData((prev) => ({
            ...prev,
            projects: [...(prev.projects ?? []), newEntry],
        }));
        setLocalEntry({ ...newEntry });
        setEditingIndex(entries.length);
    }, [entries.length, setResumeData]);

    const handleEdit = useCallback(
        (idx: number) => {
            const entry = entries[idx];
            if (entry) {
                setLocalEntry({ ...entry });
                setEditingIndex(idx);
            }
        },
        [entries],
    );

    const handleSave = useCallback(() => {
        if (localEntry === null || editingIndex === null) return;
        setResumeData((prev) => {
            const list = [...(prev.projects ?? [])];
            list[editingIndex] = { ...localEntry };
            return { ...prev, projects: list };
        });
        setLocalEntry(null);
        setEditingIndex(null);
    }, [localEntry, editingIndex, setResumeData]);

    const handleCancel = useCallback(() => {
        if (editingIndex === null) return;
        const entry = entries[editingIndex];
        if (entry && !entry.id && isEmpty(entry)) {
            setResumeData((prev) => {
                const list = [...(prev.projects ?? [])];
                list.splice(editingIndex, 1);
                return { ...prev, projects: list };
            });
        }
        setLocalEntry(null);
        setEditingIndex(null);
    }, [editingIndex, entries, setResumeData]);

    const toggleVisible = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.projects ?? [])];
                const item = list[idx];
                if (item) {
                    list[idx] = { ...item, visible: !item.visible };
                }
                return { ...prev, projects: list };
            });
        },
        [setResumeData],
    );

    const handleDelete = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.projects ?? [])];
                list.splice(idx, 1);
                return { ...prev, projects: list };
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
                const list = [...(prev.projects ?? [])];
                const item = list[idx];
                if (!item) return prev;
                const duplicate: ProjectEntry = {
                    ...item,
                    id: crypto.randomUUID(),
                };
                list.splice(idx + 1, 0, duplicate);
                return { ...prev, projects: list };
            });
            setEditingIndex((current) =>
                current !== null && current > idx ? current + 1 : current,
            );
        },
        [setResumeData],
    );

    const handleReorder = useCallback(
        (newOrder: ProjectEntry[]) => {
            setResumeData((prev) => ({
                ...prev,
                projects: newOrder,
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
                            ? "New Project"
                            : "Edit Project"}
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
                        <Label htmlFor="proj-title">Title</Label>
                        <Input
                            id="proj-title"
                            value={localEntry.title ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    title: e.target.value,
                                }))
                            }
                            placeholder="Project name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="proj-subtitle">Subtitle</Label>
                        <Input
                            id="proj-subtitle"
                            value={localEntry.subtitle ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    subtitle: e.target.value,
                                }))
                            }
                            placeholder="e.g. Tech stack, role"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                            <Label htmlFor="proj-desc">Description</Label>
                            <AiEnhanceButton
                                fieldType="project"
                                currentText={localEntry.description ?? ""}
                                context={{
                                    title: localEntry.title ?? "",
                                    subtitle: localEntry.subtitle ?? "",
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
                            placeholder="Describe the project..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="proj-link">Link (URL)</Label>
                        <Input
                            id="proj-link"
                            type="url"
                            value={localEntry.link ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    link: e.target.value || undefined,
                                }))
                            }
                            placeholder="https://..."
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
                        key={entry.id ?? `proj-${idx}`}
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
                                        entry.visible !== false ? "Hide" : "Show"
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
                Add Project
            </Button>
        </div>
    );
}
