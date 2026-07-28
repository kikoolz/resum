"use client";

import { useState, useCallback, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, X, GripVertical, Copy } from "lucide-react";
import type { EditorFormProps } from "@/lib/types";
import type { ResumeValues } from "@/lib/validation";

type ReferenceItem = NonNullable<ResumeValues["references"]>[number];

const DEFAULT_REFERENCE: ReferenceItem = {
    id: "",
    name: "",
    position: "",
    company: "",
    email: "",
    phone: "",
    visible: true,
    displayOrder: 0,
};

function getSummary(item: ReferenceItem) {
    const name = item.name?.trim() || "Untitled Reference";
    const company = item.company?.trim();
    return company ? `${name} at ${company}` : name;
}

export default function ReferencesSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editCopy, setEditCopy] = useState<ReferenceItem | null>(null);

    useEffect(() => {
        if (editCopy && editingIndex !== null) {
            setResumeData((prev) => {
                const list = [...(prev.references ?? [])];
                list[editingIndex] = { ...editCopy };
                return { ...prev, references: list };
            });
        }
    }, [editCopy, editingIndex, setResumeData]);

    const references = resumeData.references ?? [];

    const handleAdd = useCallback(() => {
        const newItem: ReferenceItem = {
            ...DEFAULT_REFERENCE,
            id: `new-${crypto.randomUUID()}`,
            displayOrder: references.length,
        };
        setResumeData((prev) => ({
            ...prev,
            references: [...(prev.references ?? []), newItem],
        }));
        setEditCopy(newItem);
        setEditingIndex(references.length);
    }, [references.length, setResumeData]);

    const handleEdit = useCallback((index: number) => {
        const item = references[index];
        if (!item) return;
        setEditCopy({ ...item });
        setEditingIndex(index);
    }, [references]);

    const handleSave = useCallback(() => {
        if (editingIndex === null || editCopy === null) return;
        setResumeData((prev) => {
            const arr = [...(prev.references ?? [])];
            arr[editingIndex] = { ...editCopy, displayOrder: editingIndex };
            return { ...prev, references: arr };
        });
        setEditingIndex(null);
        setEditCopy(null);
    }, [editingIndex, editCopy, setResumeData]);

    const handleCancel = useCallback(() => {
        if (editingIndex === null) return;
        const item = references[editingIndex];
        const isNew = item?.id?.startsWith("new-");
        const isEmpty =
            !editCopy?.name?.trim() &&
            !editCopy?.position?.trim() &&
            !editCopy?.company?.trim() &&
            !editCopy?.email?.trim() &&
            !editCopy?.phone?.trim();
        if (isNew && isEmpty) {
            setResumeData((prev) => ({
                ...prev,
                references: (prev.references ?? []).filter((_, i) => i !== editingIndex),
            }));
        }
        setEditingIndex(null);
        setEditCopy(null);
    }, [editingIndex, references, editCopy, setResumeData]);

    const handleToggleVisible = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                references: (prev.references ?? []).map((r, i) =>
                    i === index ? { ...r, visible: !r.visible } : r
                ),
            }));
        },
        [setResumeData]
    );

    const handleDelete = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                references: (prev.references ?? []).filter((_, i) => i !== index),
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
                const list = [...(prev.references ?? [])];
                const item = list[index];
                if (!item) return prev;
                const duplicate: ReferenceItem = {
                    ...item,
                    id: `new-${crypto.randomUUID()}`,
                };
                list.splice(index + 1, 0, duplicate);
                return {
                    ...prev,
                    references: list.map((r, i) => ({ ...r, displayOrder: i })),
                };
            });
            setEditingIndex((current) =>
                current !== null && current > index ? current + 1 : current,
            );
        },
        [setResumeData],
    );

    const handleReorder = useCallback(
        (reordered: ReferenceItem[]) => {
            setResumeData((prev) => ({
                ...prev,
                references: reordered.map((r, i) => ({ ...r, displayOrder: i })),
            }));
            if (editingIndex !== null) {
                const oldId = references[editingIndex]?.id;
                const newIndex = reordered.findIndex((r) => r.id === oldId);
                setEditingIndex(newIndex >= 0 ? newIndex : null);
            }
        },
        [references, editingIndex, setResumeData]
    );

    if (editingIndex !== null && editCopy !== null) {
        return (
            <div className="w-full min-w-0 max-w-full space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">Edit Reference</h3>
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
                        <Label>Name</Label>
                        <Input
                            value={editCopy.name ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, name: e.target.value })}
                            placeholder="e.g. Jane Smith"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                            value={editCopy.position ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, position: e.target.value })}
                            placeholder="e.g. Senior Engineer"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                            value={editCopy.company ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, company: e.target.value })}
                            placeholder="e.g. Acme Inc."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={editCopy.email ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, email: e.target.value })}
                            placeholder="jane@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            type="tel"
                            value={editCopy.phone ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, phone: e.target.value })}
                            placeholder="+1 234 567 8900"
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
                values={references}
                onReorder={handleReorder}
                className="w-full min-w-0 max-w-full space-y-2 overflow-x-hidden"
            >
                {references.map((item, index) => (
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
                Add Reference
            </Button>
        </div>
    );
}
