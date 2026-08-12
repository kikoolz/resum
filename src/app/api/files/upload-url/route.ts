/**
 * PDF Upload API Route
 *
 * Accepts FormData with a PDF file field and stores it in Turso.
 */

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { buildStorageKey, MAX_PDF_SIZE } from "@/lib/file-storage";

export async function POST(request: Request) {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 },
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { success: false, error: "Only PDF files are supported" },
                { status: 400 },
            );
        }

        if (file.size > MAX_PDF_SIZE) {
            return NextResponse.json(
                { success: false, error: `File too large. Max ${MAX_PDF_SIZE / (1024 * 1024)}MB` },
                { status: 400 },
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        const fileId = crypto.randomUUID();
        const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
        const storageKey = buildStorageKey(userId, "resume_pdf", fileId, ext);

        const db = await getDb();
        await db.insert(userFiles).values({
            id: fileId,
            userId,
            resumeId: null,
            fileType: "resume_pdf",
            r2Key: storageKey,
            fileName: file.name,
            fileSize: file.size,
            mimeType: "application/pdf",
            fileData: base64,
        });

        const url = `/api/files/${storageKey}`;

        return NextResponse.json({ success: true, fileId, url });
    } catch (err) {
        console.error("[upload-pdf] error:", err);
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
