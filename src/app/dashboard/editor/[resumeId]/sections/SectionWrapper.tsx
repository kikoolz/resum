"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Eye, EyeOff, ChevronDown, GripVertical, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface SectionWrapperProps {
    title: string;
    icon: LucideIcon;
    isVisible: boolean;
    onToggleVisibility: () => void;
    /** Optional count badge (e.g. number of entries) */
    count?: number;
    /** Whether this section can be removed (optional sections) */
    removable?: boolean;
    onRemove?: () => void;
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pointer-down handler for the drag handle -- provided by DraggableSectionItem */
    onDragStart?: (e: React.PointerEvent) => void;
    /** Disable drag handle for fixed sections */
    draggable?: boolean;
}

export default function SectionWrapper({
    title,
    icon: Icon,
    isVisible,
    onToggleVisibility,
    count,
    removable,
    onRemove,
    children,
    open,
    onOpenChange,
    onDragStart,
    draggable = true,
}: SectionWrapperProps) {

    return (
        <Collapsible
            open={open}
            onOpenChange={onOpenChange}
            className={cn(
                "w-full min-w-0 transition-all duration-300 ease-in-out",
                open ? "mb-4" : "mb-2"
            )}
        >
            <div
                className={cn(
                    "group w-full min-w-0 overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-md",
                    !isVisible && "opacity-60 grayscale-[0.5]",
                    open && "ring-1 ring-primary/20 shadow-md border-primary/20"
                )}
            >
                {/* Section Header */}
                <div
                    className={cn(
                        "flex min-w-0 items-center gap-1 px-3 py-3 transition-colors",
                        open ? "bg-accent/5" : "hover:bg-accent/50"
                    )}
                >
                    {/* Drag handle -- fires drag via useDragControls in parent */}
                    {draggable && (
                        <div
                            className="cursor-grab touch-none p-1 text-muted-foreground/50 transition-colors hover:text-foreground active:cursor-grabbing"
                            onPointerDown={onDragStart}
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>
                    )}

                    {/* Expand / collapse trigger */}
                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left text-sm font-medium transition-colors"
                        >
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
                                open
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border group-hover:border-primary/50 group-hover:text-primary"
                            )}>
                                <Icon className="h-4 w-4" />
                            </div>

                            <span className={cn(
                                "truncate text-sm font-semibold tracking-tight transition-colors",
                                open ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {title}
                            </span>

                            {count !== undefined && count > 0 && (
                                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                    {count}
                                </span>
                            )}
                            <ChevronDown
                                className={cn(
                                    "ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-300",
                                    open && "rotate-180 text-foreground",
                                )}
                            />
                        </button>
                    </CollapsibleTrigger>

                    {/* Visibility toggle */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-background hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility();
                        }}
                        title={isVisible ? "Hide section" : "Show section"}
                    >
                        {isVisible ? (
                            <Eye className="h-4 w-4" />
                        ) : (
                            <EyeOff className="h-4 w-4 opacity-50" />
                        )}
                    </Button>

                    {/* Remove button for optional sections */}
                    {removable && onRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            title="Remove section"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Section Content */}
                <CollapsibleContent className="min-w-0">
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300 w-full min-w-0 max-w-full overflow-x-hidden border-t px-4 py-4 bg-card/50">
                        {children}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}
