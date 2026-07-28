"use client";

import { useState, useCallback, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, X, GripVertical, Copy } from "lucide-react";
import type { EditorFormProps } from "@/lib/types";
import type { ResumeValues } from "@/lib/validation";
import AiEnhanceButton from "./AiEnhanceButton";

type CertificateItem = NonNullable<ResumeValues["certificates"]>[number];

const DEFAULT_CERTIFICATE: CertificateItem = {
    id: "",
    title: "",
    issuer: "",
    description: "",
    date: "",
    link: "",
    credentialId: "",
    visible: true,
    displayOrder: 0,
};

function getSummary(item: CertificateItem) {
    return item.title?.trim() || "Untitled Certificate";
}

export default function CertificatesSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editCopy, setEditCopy] = useState<CertificateItem | null>(null);

    useEffect(() => {
        if (editCopy && editingIndex !== null) {
            setResumeData((prev) => {
                const list = [...(prev.certificates ?? [])];
                list[editingIndex] = { ...editCopy };
                return { ...prev, certificates: list };
            });
        }
    }, [editCopy, editingIndex, setResumeData]);

    const certificates = resumeData.certificates ?? [];

    const handleAdd = useCallback(() => {
        const newItem: CertificateItem = {
            ...DEFAULT_CERTIFICATE,
            id: `new-${crypto.randomUUID()}`,
            displayOrder: certificates.length,
        };
        setResumeData((prev) => ({
            ...prev,
            certificates: [...(prev.certificates ?? []), newItem],
        }));
        setEditCopy(newItem);
        setEditingIndex(certificates.length);
    }, [certificates.length, setResumeData]);

    const handleEdit = useCallback((index: number) => {
        const item = certificates[index];
        if (!item) return;
        setEditCopy({ ...item });
        setEditingIndex(index);
    }, [certificates]);

    const handleSave = useCallback(() => {
        if (editingIndex === null || editCopy === null) return;
        setResumeData((prev) => {
            const arr = [...(prev.certificates ?? [])];
            arr[editingIndex] = { ...editCopy, displayOrder: editingIndex };
            return { ...prev, certificates: arr };
        });
        setEditingIndex(null);
        setEditCopy(null);
    }, [editingIndex, editCopy, setResumeData]);

    const handleCancel = useCallback(() => {
        if (editingIndex === null) return;
        const item = certificates[editingIndex];
        const isNew = item?.id?.startsWith("new-");
        const isEmpty = !editCopy?.title?.trim() && !editCopy?.issuer?.trim() && !editCopy?.description?.trim();
        if (isNew && isEmpty) {
            setResumeData((prev) => ({
                ...prev,
                certificates: (prev.certificates ?? []).filter((_, i) => i !== editingIndex),
            }));
        }
        setEditingIndex(null);
        setEditCopy(null);
    }, [editingIndex, certificates, editCopy, setResumeData]);

    const handleToggleVisible = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                certificates: (prev.certificates ?? []).map((c, i) =>
                    i === index ? { ...c, visible: !c.visible } : c
                ),
            }));
        },
        [setResumeData]
    );

    const handleDelete = useCallback(
        (index: number) => {
            setResumeData((prev) => ({
                ...prev,
                certificates: (prev.certificates ?? []).filter((_, i) => i !== index),
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
                const list = [...(prev.certificates ?? [])];
                const item = list[index];
                if (!item) return prev;
                const duplicate: CertificateItem = {
                    ...item,
                    id: `new-${crypto.randomUUID()}`,
                };
                list.splice(index + 1, 0, duplicate);
                return {
                    ...prev,
                    certificates: list.map((c, i) => ({ ...c, displayOrder: i })),
                };
            });
            setEditingIndex((current) =>
                current !== null && current > index ? current + 1 : current,
            );
        },
        [setResumeData],
    );

    const handleReorder = useCallback(
        (reordered: CertificateItem[]) => {
            setResumeData((prev) => ({
                ...prev,
                certificates: reordered.map((c, i) => ({ ...c, displayOrder: i })),
            }));
            if (editingIndex !== null) {
                const oldId = certificates[editingIndex]?.id;
                const newIndex = reordered.findIndex((c) => c.id === oldId);
                setEditingIndex(newIndex >= 0 ? newIndex : null);
            }
        },
        [certificates, editingIndex, setResumeData]
    );

    if (editingIndex !== null && editCopy !== null) {
        return (
            <div className="w-full min-w-0 max-w-full space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">Edit Certificate</h3>
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
                        <Label>Title</Label>
                        <Input
                            value={editCopy.title ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, title: e.target.value })}
                            placeholder="e.g. AWS Certified Solutions Architect"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Issuer</Label>
                        <Input
                            value={editCopy.issuer ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, issuer: e.target.value })}
                            placeholder="e.g. Amazon Web Services"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <Label>Description</Label>
                            <AiEnhanceButton
                                fieldType="certificate"
                                currentText={editCopy.description ?? ""}
                                context={{
                                    title: editCopy.title ?? "",
                                    issuer: editCopy.issuer ?? "",
                                }}
                                onEnhanced={(text) =>
                                    setEditCopy((c) => c && { ...c, description: text })
                                }
                            />
                        </div>
                        <RichTextEditor
                            value={editCopy.description ?? ""}
                            onChange={(html) => setEditCopy((c) => c && { ...c, description: html })}
                            placeholder="Brief description..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <DatePicker
                            value={editCopy.date}
                            onChange={(d) => setEditCopy((c) => c && { ...c, date: d })}
                            placeholder="Select date"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Link (URL)</Label>
                        <Input
                            type="url"
                            value={editCopy.link ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, link: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Credential ID</Label>
                        <Input
                            value={editCopy.credentialId ?? ""}
                            onChange={(e) => setEditCopy((c) => c && { ...c, credentialId: e.target.value })}
                            placeholder="e.g. ABC123XYZ"
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
                values={certificates}
                onReorder={handleReorder}
                className="w-full min-w-0 max-w-full space-y-2 overflow-x-hidden"
            >
                {certificates.map((item, index) => (
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
                Add Certificate
            </Button>
        </div>
    );
}
