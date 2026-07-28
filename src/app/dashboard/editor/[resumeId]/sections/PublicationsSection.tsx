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

type PublicationEntry = NonNullable<
    ResumeValues["publications"]
>[number];

const DEFAULT_ENTRY: PublicationEntry = {
    title: "",
    publisher: "",
    authors: "",
    description: "",
    date: "",
    link: "",
    visible: true,
};

function getSummary(entry: PublicationEntry): string {
    const title = entry.title?.trim();
    return title || "Untitled Publication";
}

function isEmpty(entry: PublicationEntry): boolean {
    return (
        !entry.title?.trim() &&
        !entry.publisher?.trim() &&
        !entry.authors?.trim() &&
        !entry.description?.trim() &&
        !entry.date?.trim() &&
        !entry.link?.trim()
    );
}

export default function PublicationsSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const entries = resumeData.publications ?? [];
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [localEntry, setLocalEntry] = useState<PublicationEntry | null>(null);

    // Sync local edits to resumeData so the preview updates in real-time
    useEffect(() => {
        if (localEntry && editingIndex !== null) {
            setResumeData((prev) => {
                const list = [...(prev.publications ?? [])];
                list[editingIndex] = { ...localEntry };
                return { ...prev, publications: list };
            });
        }
    }, [localEntry, editingIndex, setResumeData]);

    const handleAdd = useCallback(() => {
        const newEntry: PublicationEntry = { ...DEFAULT_ENTRY };
        setResumeData((prev) => ({
            ...prev,
            publications: [...(prev.publications ?? []), newEntry],
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
            const list = [...(prev.publications ?? [])];
            list[editingIndex] = { ...localEntry };
            return { ...prev, publications: list };
        });
        setLocalEntry(null);
        setEditingIndex(null);
    }, [localEntry, editingIndex, setResumeData]);

    const handleCancel = useCallback(() => {
        if (editingIndex === null) return;
        const entry = entries[editingIndex];
        if (entry && !entry.id && isEmpty(entry)) {
            setResumeData((prev) => {
                const list = [...(prev.publications ?? [])];
                list.splice(editingIndex, 1);
                return { ...prev, publications: list };
            });
        }
        setLocalEntry(null);
        setEditingIndex(null);
    }, [editingIndex, entries, setResumeData]);

    const toggleVisible = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.publications ?? [])];
                const item = list[idx];
                if (item) {
                    list[idx] = { ...item, visible: !item.visible };
                }
                return { ...prev, publications: list };
            });
        },
        [setResumeData],
    );

    const handleDelete = useCallback(
        (idx: number) => {
            setResumeData((prev) => {
                const list = [...(prev.publications ?? [])];
                list.splice(idx, 1);
                return { ...prev, publications: list };
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
                const list = [...(prev.publications ?? [])];
                const item = list[idx];
                if (!item) return prev;
                const duplicate: PublicationEntry = {
                    ...item,
                    id: crypto.randomUUID(),
                };
                list.splice(idx + 1, 0, duplicate);
                return { ...prev, publications: list };
            });
            setEditingIndex((current) =>
                current !== null && current > idx ? current + 1 : current,
            );
        },
        [setResumeData],
    );

    const handleReorder = useCallback(
        (newOrder: PublicationEntry[]) => {
            setResumeData((prev) => ({
                ...prev,
                publications: newOrder,
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
                            ? "New Publication"
                            : "Edit Publication"}
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
                        <Label htmlFor="pub-title">Title</Label>
                        <Input
                            id="pub-title"
                            value={localEntry.title ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    title: e.target.value,
                                }))
                            }
                            placeholder="Publication title"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="pub-publisher">Publisher</Label>
                        <Input
                            id="pub-publisher"
                            value={localEntry.publisher ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    publisher: e.target.value,
                                }))
                            }
                            placeholder="Journal, conference, etc."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="pub-authors">Authors</Label>
                        <Input
                            id="pub-authors"
                            value={localEntry.authors ?? ""}
                            onChange={(e) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    authors: e.target.value,
                                }))
                            }
                            placeholder="Author names"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                            <Label htmlFor="pub-desc">Description</Label>
                            <AiEnhanceButton
                                fieldType="publication"
                                currentText={localEntry.description ?? ""}
                                context={{
                                    title: localEntry.title ?? "",
                                    publisher: localEntry.publisher ?? "",
                                    authors: localEntry.authors ?? "",
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
                            placeholder="Brief description or abstract..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <DatePicker
                            value={localEntry.date}
                            onChange={(d) =>
                                setLocalEntry((p) => ({
                                    ...p!,
                                    date: d,
                                }))
                            }
                            placeholder="Select date"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="pub-link">Link (URL)</Label>
                        <Input
                            id="pub-link"
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
                        key={entry.id ?? `pub-${idx}`}
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
                Add Publication
            </Button>
        </div>
    );
}
