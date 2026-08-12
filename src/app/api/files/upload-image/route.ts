import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!IMAGE_MIME_TYPES.has(file.type)) {
            return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileId = crypto.randomUUID();
        const storageKey = `${userId}/tiptap/${fileId}.${ext}`;

        // Read file as array buffer and convert to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        // Store in Turso
        const db = await getDb();
        await db.insert(userFiles).values({
            id: fileId,
            userId,
            resumeId: null,
            fileType: "photo",
            storageKey,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            fileData: base64,
        });

        const url = `/api/files/${storageKey}`;

        return NextResponse.json({ success: true, url });
    } catch (err) {
        console.error("[upload-image] error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
