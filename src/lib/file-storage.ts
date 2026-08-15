/**
 * File Storage — Turso/base64 approach.
 *
 * Files are stored as base64-encoded strings in the `user_files.file_data` column.
 * Tradeoff: simplicity (no external blob storage) vs. row size limits (~4.5MB on Vercel).
 * The `r2Key` column name is a legacy artifact from a planned R2 migration that was
 * never completed. It now stores a logical key for the Turso-stored file.
 */

import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const PHOTO_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

export const PDF_MIME_TYPES = new Set(["application/pdf"]);

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

export function buildStorageKey(
    userId: string,
    _fileType: "photo" | "resume_pdf",
    fileId: string,
    extension: string,
): string {
    return `${userId}/${fileId}.${extension}`;
}

export function storageKeyToUrl(storageKey: string): string {
    return `/api/files/${storageKey}`;
}

export async function getFileData(
    storageKey: string,
): Promise<{ data: string; mimeType: string } | null> {
    const db = await getDb();

    const file = await db.query.userFiles.findFirst({
        where: eq(userFiles.r2Key, storageKey),
        columns: { fileData: true, mimeType: true },
    });

    if (!file || !file.fileData) {
        return null;
    }

    return { data: file.fileData, mimeType: file.mimeType };
}

export const PHOTO_MIME_TYPES_SET = PHOTO_MIME_TYPES;
export const PDF_MIME_TYPES_SET = PDF_MIME_TYPES;
