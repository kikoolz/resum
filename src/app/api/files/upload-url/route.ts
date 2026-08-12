/**
 * PDF Upload API Route
 *
 * Uploads PDF directly to Turso storage.
 */

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { buildStorageKey, PDF_MIME_TYPES, MAX_PDF_SIZE } from "@/lib/file-storage";

interface UploadRequestBody {
    fileName: string;
    contentType: string;
    fileType: "resume_pdf";
    fileSize: number;
    fileData: string; // base64 encoded
}

export async function POST(request: Request) {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        const body = (await request.json()) as UploadRequestBody;
        const { fileName, contentType, fileType, fileSize, fileData } = body;

        if (!fileName || !contentType || !fileType || !fileSize || !fileData) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 },
            );
        }

        if (fileType !== "resume_pdf") {
            return NextResponse.json(
                { success: false, error: "Only resume_pdf uploads supported" },
                { status: 400 },
            );
        }

        if (!PDF_MIME_TYPES.has(contentType)) {
            return NextResponse.json(
                { success: false, error: `Invalid content type: ${contentType}` },
                { status: 400 },
            );
        }

        if (typeof fileSize !== "number" || fileSize <= 0 || fileSize > MAX_PDF_SIZE) {
            return NextResponse.json(
                { success: false, error: `Invalid file size. Max ${MAX_PDF_SIZE / (1024 * 1024)}MB` },
                { status: 400 },
            );
        }

        const fileId = crypto.randomUUID();
        const ext = fileName.split(".").pop()?.toLowerCase() || "pdf";
        const storageKey = buildStorageKey(userId, fileType, fileId, ext);

        const db = await getDb();
        await db.insert(userFiles).values({
            id: fileId,
            userId,
            resumeId: null,
            fileType: "resume_pdf",
            r2Key: storageKey,
            fileName,
            fileSize,
            mimeType: "application/pdf",
            fileData: fileData,
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
