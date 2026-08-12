/**
 * Confirm Upload API Route
 *
 * With Turso storage, uploads are server-side so this just verifies the file exists.
 */

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ConfirmUploadRequestBody {
    fileId: string;
    storageKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
}

export async function POST(request: Request) {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        const body = (await request.json()) as ConfirmUploadRequestBody;
        const { fileId, storageKey, fileName, fileSize, mimeType } = body;

        if (!fileId || !storageKey || !fileName || !fileSize || !mimeType) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 },
            );
        }

        if (!storageKey.startsWith(`${userId}/`)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 },
            );
        }

        const db = await getDb();
        const existingFile = await db.query.userFiles.findFirst({
            where: eq(userFiles.r2Key, storageKey),
            columns: { id: true },
        });

        if (!existingFile) {
            return NextResponse.json(
                { success: false, error: "File not found in storage" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, fileId });
    } catch (err) {
        console.error("[confirm-upload] error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to confirm upload" },
            { status: 500 },
        );
    }
}
