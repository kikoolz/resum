/**
 * PDF Upload API Route
 *
 * Accepts FormData with a PDF file field and stores it in Turso.
 * Self-heals: adds file_data column if missing from the database.
 */

import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { buildStorageKey, MAX_PDF_SIZE } from "@/lib/file-storage";

async function ensureFileDataColumn(db: Awaited<ReturnType<typeof getDb>>) {
    try {
        await db.all(sql`SELECT file_data FROM user_files LIMIT 1`);
    } catch {
        console.log("[upload-pdf] file_data column missing, adding it...");
        await db.run(sql`ALTER TABLE user_files ADD COLUMN file_data TEXT`);
        console.log("[upload-pdf] file_data column added successfully");
    }
}

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
        await ensureFileDataColumn(db);

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
