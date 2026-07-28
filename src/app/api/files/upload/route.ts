/**
 * File Storage — Vercel Blob
 *
 * Handles photo uploads via server-side Vercel Blob.
 */

import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { resumes, userFiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  buildBlobKey,
  blobKeyToUrl,
  PHOTO_MIME_TYPES,
  MAX_PHOTO_SIZE,
} from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = formData.get("fileType") as string | null;
    const resumeId = (formData.get("resumeId") as string) || null;

    if (!file || !fileType) {
      return NextResponse.json(
        { error: "Missing file or fileType" },
        { status: 400 },
      );
    }

    if (fileType !== "photo") {
      return NextResponse.json(
        { error: "Only photo uploads supported. Use /api/files/upload for PDFs." },
        { status: 400 },
      );
    }

    if (!PHOTO_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 },
      );
    }

    if (file.size > MAX_PHOTO_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_PHOTO_SIZE / (1024 * 1024)}MB` },
        { status: 400 },
      );
    }

    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId required for photo uploads" },
        { status: 400 },
      );
    }

    const db = await getDb();

    const ownedResume = await db.query.resumes.findFirst({
      where: and(eq(resumes.id, resumeId), eq(resumes.userId, userId)),
      columns: { id: true },
    });

    if (!ownedResume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 },
      );
    }

    // Delete existing photos for this resume
    const existingPhotos = await db.query.userFiles.findMany({
      where: and(
        eq(userFiles.resumeId, resumeId),
        eq(userFiles.userId, userId),
        eq(userFiles.fileType, "photo"),
      ),
      columns: { id: true, r2Key: true },
    });

    for (const existing of existingPhotos) {
      try { await del(existing.r2Key); } catch {}
      await db.delete(userFiles).where(eq(userFiles.id, existing.id));
    }

    // Upload to Vercel Blob
    const fileId = crypto.randomUUID();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const blobKey = buildBlobKey(userId, "photo", fileId, ext);

    const result = await put(blobKey, file, {
      access: "private",
      contentType: file.type,
    });

    const url = blobKeyToUrl(blobKey);

    // Insert DB record
    await db.insert(userFiles).values({
      id: fileId,
      userId,
      resumeId,
      fileType: "photo",
      r2Key: blobKey,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

    // Sync photo URL to resume
    await db
      .update(resumes)
      .set({ photoUrl: url, updatedAt: new Date() })
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

    return NextResponse.json({
      success: true,
      url,
      fileId,
      resumePhotoSynced: true,
    });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get("fileType");
    const resumeId = searchParams.get("resumeId");

    if (fileType !== "photo") {
      return NextResponse.json(
        { error: "DELETE only supports fileType=photo" },
        { status: 400 },
      );
    }

    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId required" },
        { status: 400 },
      );
    }

    const db = await getDb();

    const existingPhotos = await db.query.userFiles.findMany({
      where: and(
        eq(userFiles.resumeId, resumeId),
        eq(userFiles.userId, userId),
        eq(userFiles.fileType, "photo"),
      ),
      columns: { id: true, r2Key: true },
    });

    for (const photo of existingPhotos) {
      try { await del(photo.r2Key); } catch {}
    }

    if (existingPhotos.length > 0) {
      await db
        .delete(userFiles)
        .where(
          and(
            eq(userFiles.resumeId, resumeId),
            eq(userFiles.userId, userId),
            eq(userFiles.fileType, "photo"),
          ),
        );
    }

    await db
      .update(resumes)
      .set({ photoUrl: null, updatedAt: new Date() })
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

    return NextResponse.json({ success: true, deletedFileCount: existingPhotos.length });
  } catch (err) {
    console.error("[upload delete] error:", err);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 },
    );
  }
}
