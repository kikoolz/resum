/**
 * PDF Upload API Route
 *
 * Uploads PDF directly to Vercel Blob server-side.
 */

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { put } from "@vercel/blob";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { buildBlobKey, PDF_MIME_TYPES, MAX_PDF_SIZE } from "@/lib/r2";

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
    const blobKey = buildBlobKey(userId, fileType, fileId, ext);

    // Decode base64 and upload
    const buffer = Buffer.from(fileData, "base64");
    const blob = await put(blobKey, buffer, {
      access: "private",
      contentType: "application/pdf",
    });

    // Create DB record
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

    return NextResponse.json({ success: true, fileId, url: blob.url });
  } catch (err) {
    console.error("[upload-pdf] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to upload PDF" },
      { status: 500 },
    );
  }
}
