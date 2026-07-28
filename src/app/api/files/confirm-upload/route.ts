/**
 * Confirm Upload API Route
 *
 * With Vercel Blob, uploads are server-side so this just creates the DB record.
 */

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { get } from "@vercel/blob";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";

interface ConfirmUploadRequestBody {
  fileId: string;
  blobKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const body = (await request.json()) as ConfirmUploadRequestBody;
    const { fileId, blobKey, fileName, fileSize, mimeType } = body;

    if (!fileId || !blobKey || !fileName || !fileSize || !mimeType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!blobKey.startsWith(`${userId}/`)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    // Verify blob exists
    try {
      await get(blobKey, { access: "private" });
    } catch {
      return NextResponse.json(
        { success: false, error: "File not found in storage" },
        { status: 404 },
      );
    }

    const db = await getDb();
    await db.insert(userFiles).values({
      id: fileId,
      userId,
      resumeId: null,
      fileType: "resume_pdf",
      r2Key: blobKey,
      fileName,
      fileSize,
      mimeType: "application/pdf",
    });

    return NextResponse.json({ success: true, fileId });
  } catch (err) {
    console.error("[confirm-upload] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to confirm upload" },
      { status: 500 },
    );
  }
}
