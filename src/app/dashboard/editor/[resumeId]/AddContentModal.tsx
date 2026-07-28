"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { OPTIONAL_SECTIONS, type SectionMeta } from "./sectionConfig";

interface AddContentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentOrder: string[];
    onAddSection: (key: string) => void;
}

export default function AddContentModal({
    open,
    onOpenChange,
    currentOrder,
    onAddSection,
}: AddContentModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-md">
                <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
                    <DialogTitle>Add Content</DialogTitle>
                    <DialogDescription>
                        Choose additional sections to add to your resume.
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto px-6 pb-6">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {OPTIONAL_SECTIONS.map((section: SectionMeta) => {
                            const isAdded = currentOrder.includes(section.key);
                            const Icon = section.icon;
                            return (
                                <Button
                                    key={section.key}
                                    type="button"
                                    variant={isAdded ? "secondary" : "outline"}
                                    className="flex h-auto items-start gap-3 px-3 py-3 text-left"
                                    disabled={isAdded}
                                    onClick={() => {
                                        onAddSection(section.key);
                                        onOpenChange(false);
                                    }}
                                >
                                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {section.title}
                                        </p>
                                        <p className="whitespace-normal text-xs text-muted-foreground">
                                            {section.description}
                                        </p>
                                    </div>
                                    {isAdded && (
                                        <Check className="h-4 w-4 shrink-0 text-primary" />
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
