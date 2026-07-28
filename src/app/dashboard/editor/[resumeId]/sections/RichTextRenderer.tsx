import { cn } from "@/lib/utils";

interface RichTextRendererProps {
    html: string;
    className?: string;
}

function isHtmlEmpty(html: string): boolean {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped === "" || stripped === "<br>";
}

export default function RichTextRenderer({ html, className }: RichTextRendererProps) {
    if (isHtmlEmpty(html)) return null;

    return (
        <div
            className={cn(
                "prose prose-sm max-w-none",
                "[&_p]:my-1",
                "[&_ul]:list-disc",
                "[&_ol]:list-decimal",
                "[&_ul]:pl-6",
                "[&_ol]:pl-6",
                "[&_li]:my-1",
                "[&_li_p]:m-0",
                "[&_a]:underline",
                "[&_a]:text-primary",
                "[&_strong]:font-bold",
                "[&_em]:italic",
                "[&_u]:underline",
                "[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs",
                "[&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic",
                className,
            )}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
