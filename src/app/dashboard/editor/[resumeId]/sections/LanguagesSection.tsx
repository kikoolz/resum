"use client";

import { useState, useCallback, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Pencil,
    Check,
    X,
    GripVertical,
    Copy,
} from "lucide-react";
import type { EditorFormProps } from "@/lib/types";
import type { ResumeValues } from "@/lib/validation";

const PROFICIENCY_OPTIONS = [
    "Native",
    "Fluent",
    "Advanced",
    "Intermediate",
    "Basic",
] as const;
const NONE_PROFICIENCY_VALUE = "__none__";

type LanguageItem = NonNullable<ResumeValues["languages"]>[number];

const DEFAULT_LANGUAGE: LanguageItem = {
    id: "",
    language: "",
    proficiency: "",
    visible: true,
    displayOrder: 0,
};

function getSummary(item: LanguageItem) {
    const lang = item.language?.trim() || "Untitled Language";
    const prof = item.proficiency?.trim();
    return prof ? `${lang} — ${prof}` : lang;
}

export default function LanguagesSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editCopy, setEditCopy] = useState<LanguageItem | null>(null);

    useEffect(() => {
        if (editCopy && editingIndex !== null) {
            setResumeData((prev) => {
                const list = [...(prev.languages ?? [])];
                list[editingIndex] = { ...editCopy };
                return { ...prev, languages: list };
            });
        }
    }, [editCopy, editingIndex, setResumeData]);

    const languages = resumeData.languages ?? [];

    const handleAdd = useCallback(() => {
        const newItem: LanguageItem = {
            ...DEFAULT_LANGUAGE,
            id: `new-${crypto.randomUUID()}`,
            displayOrder: languages.length,
        };
        setResumeData((prev) => ({
            ...prev,
            languages: [...(prev.languages ?? []), newItem],
        }));
        setEditCopy(newItem);
        setEditingIndex(languages.length);
    }, [languages.length, setResumeData]);

    const handleEdit = useCallback((index: number) => {
        const item = languages[index];
        if (!item) return;
        setEditCopy({ ...item });
        setEditingIndex(index);
    }, [languages]);

    const handleSave = useCallback(() => {
        if (editingIndex === null || editCopy === null) return;
        setResumeData((prev) => {
            const arr = [...(prev.languages ?? [])];
            arr[editingIndex] = { ...editCopy, displayOrder: editingIndex };
            return { ...prev, languages: arr };
        });
        setEditingIndex(null);
        setEditCopy(null);
    }, [editingIndex, editCopy, setResumeData]);

    const handleCancel = useCallback(() => {
        if (editingIndex === null) return;
        const item = languages[editingIndex];
        const isNew = item?.id?.startsWith("new-");
        const isEmpty = !editCopy?.language?.trim();
        if (isNew && isEmpty) {
            setResumeData((prev) => ({
                ...prev,
                languages: (prev.languages ?? []).filter((_, i) => i !== editingIndex),
            }));
        }
        setEditingIndex(null);
        setEditCopy(null);
    }, [editingIndex, languages, editCopy, setResumeData]);

    const handleToggleVisible = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                languages: (prev.languages ?? []).map((l, i) =>
                    i === index ? { ...l, visible: !l.visible } : l
                ),
            }));
        },
        [setResumeData]
    );

    const handleDelete = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                languages: (prev.languages ?? []).filter((_, i) => i !== index),
            }));
            if (editingIndex === index) {
                setEditingIndex(null);
                setEditCopy(null);
            } else if (editingIndex !== null && editingIndex > index) {
                setEditingIndex((prev) => (prev !== null ? prev - 1 : null));
            }
        },
        [editingIndex, setResumeData]
    );

    const handleDuplicate = useCallback(
        (index: number) => {
            setResumeData((prev) => {
                const list = [...(prev.languages ?? [])];
                const item = list[index];
                if (!item) return prev;
                const duplicate: LanguageItem = {
                    ...item,
                    id: `new-${crypto.randomUUID()}`,
                };
                list.splice(index + 1, 0, duplicate);
                return {
                    ...prev,
                    languages: list.map((l, i) => ({ ...l, displayOrder: i })),
                };
            });
            setEditingIndex((current) =>
                current !== null && current > index ? current + 1 : current,
            );
        },
        [setResumeData],
    );

    const handleReorder = useCallback(
        (reordered: LanguageItem[]) => {
            setResumeData((prev) => ({
                ...prev,
                languages: reordered.map((l, i) => ({ ...l, displayOrder: i })),
            }));
            if (editingIndex !== null) {
                const oldId = languages[editingIndex]?.id;
                const newIndex = reordered.findIndex((l) => l.id === oldId);
                setEditingIndex(newIndex >= 0 ? newIndex : null);
            }
        },
        [languages, editingIndex, setResumeData]
    );

    if (editingIndex !== null && editCopy !== null) {
        return (
            <div className="w-full min-w-0 max-w-full space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">Edit Language</h3>
                    <div className="flex w-full justify-end gap-1 sm:w-auto">
                        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="button" variant="secondary" size="sm" onClick={handleSave}>
                            <Check className="h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Input
                            value={editCopy.language ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, language: e.target.value })}
                            placeholder="e.g. English, Spanish"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Proficiency</Label>
                        <Select
                            value={editCopy.proficiency || NONE_PROFICIENCY_VALUE}
                            onValueChange={(value) =>
                                setEditCopy((c) =>
                                    c
                                        ? {
                                              ...c,
                                              proficiency:
                                                  value === NONE_PROFICIENCY_VALUE
                                                      ? ""
                                                      : value,
                                          }
                                        : c,
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NONE_PROFICIENCY_VALUE}>
                                    Select proficiency
                                </SelectItem>
                                {PROFICIENCY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 max-w-full space-y-3">
            <Reorder.Group
                axis="y"
                values={languages}
                onReorder={handleReorder}
                className="w-full min-w-0 max-w-full space-y-2 overflow-x-hidden"
            >
                {languages.map((item, index) => (
                    <Reorder.Item
                        key={item.id ?? index}
                        value={item}
                        className="w-full min-w-0 overflow-hidden rounded-lg border bg-card p-2.5"
                    >
                        <div className="flex w-full min-w-0 max-w-full items-center gap-2 overflow-hidden">
                            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{getSummary(item)}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleToggleVisible(index)}
                                    title={item.visible ? "Hide" : "Show"}
                                >
                                    {item.visible ? (
                                        <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleEdit(index)}
                                    title="Edit"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => handleDuplicate(index)}
                                    title="Duplicate"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(index)}
                                    title="Delete"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleAdd}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Language
            </Button>
        </div>
    );
}
