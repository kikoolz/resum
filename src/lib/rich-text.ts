export function richTextHtml(text: string | undefined): string {
    if (!text) return "";
    if (text.includes("<")) return text;
    const lines = text.split("\n").filter(Boolean);
    if (lines.length <= 1) return `<p>${text}</p>`;
    return lines.map((l) => `<p>${l}</p>`).join("");
}

export function isRichTextEmpty(text: string | undefined): boolean {
    if (!text) return true;
    return text.replace(/<[^>]*>/g, "").trim() === "";
}
