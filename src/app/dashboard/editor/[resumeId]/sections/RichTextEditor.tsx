"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
    Bold,
    Italic,
    UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    Undo2,
    Redo2,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    maxLength?: number;
}

function ToolbarButton({
    onClick,
    isActive,
    disabled,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "rounded p-1 transition-colors",
                isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                disabled && "cursor-not-allowed opacity-40"
            )}
        >
            {children}
        </button>
    );
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const addLink = useCallback(() => {
        if (!editor) return;
        const url = window.prompt("Enter URL:");
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-input px-2 py-1">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
            >
                <Bold className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
            >
                <Italic className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
            >
                <UnderlineIcon className="h-3.5 w-3.5" />
            </ToolbarButton>
            <div className="mx-1 h-4 w-px bg-border" />
            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
                isActive={editor.isActive("bulletList")}
            >
                <List className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                isActive={editor.isActive("orderedList")}
            >
                <ListOrdered className="h-3.5 w-3.5" />
            </ToolbarButton>
            <div className="mx-1 h-4 w-px bg-border" />
            <ToolbarButton
                onClick={addLink}
                isActive={editor.isActive("link")}
            >
                <LinkIcon className="h-3.5 w-3.5" />
            </ToolbarButton>
            <div className="flex-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                <Undo2 className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                <Redo2 className="h-3.5 w-3.5" />
            </ToolbarButton>
        </div>
    );
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write here...",
    className,
    maxLength,
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                blockquote: false,
                horizontalRule: false,
                code: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "underline underline-offset-2 text-primary",
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass:
                    "is-editor-empty first:before:text-muted-foreground first:before:float-left first:before:pointer-events-none first:before:h-0 first:before:content-[attr(data-placeholder)]",
            }),
        ],
        content: value || "",
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] px-3 py-2",
                    "prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5",
                    "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                ),
            },
        },
        onUpdate: ({ editor: e }) => {
            const html = e.getHTML();
            if (maxLength && e.getText().length > maxLength) {
                return;
            }
            if (html === "<p></p>") {
                onChange("");
            } else {
                onChange(html);
            }
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            const currentHtml = editor.getHTML();
            const normalizedValue = value || "<p></p>";
            if (normalizedValue !== currentHtml && value !== "") {
                editor.commands.setContent(value, { emitUpdate: false });
            } else if (value === "" && currentHtml !== "<p></p>") {
                editor.commands.setContent("", { emitUpdate: false });
            }
        }
    }, [editor, value]);

    if (!editor) return null;

    return (
        <div
            className={cn(
                "rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
                "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                className
            )}
        >
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
            {maxLength !== undefined && (
                <div className="border-t border-input px-3 py-1 text-right text-[10px] text-muted-foreground">
                    {editor.getText().length}/{maxLength}
                </div>
            )}
        </div>
    );
}
