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

export async function uploadFile(
    userId: string,
    storageKey: string,
    file: File | ArrayBuffer,
    contentType: string,
): Promise<void> {
    const db = await getDb();

    // Convert file to base64
    let arrayBuffer: ArrayBuffer;
    if (file instanceof File) {
        arrayBuffer = await file.arrayBuffer();
    } else {
        arrayBuffer = file;
    }

    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Check if file already exists
    const existing = await db.query.userFiles.findFirst({
        where: eq(userFiles.storageKey, storageKey),
    });

    if (existing) {
        // Update existing file
        await db
            .update(userFiles)
            .set({ fileData: base64 })
            .where(eq(userFiles.storageKey, storageKey));
    }
}

export async function getFileData(
    storageKey: string,
): Promise<{ data: string; mimeType: string } | null> {
    const db = await getDb();

    const file = await db.query.userFiles.findFirst({
        where: eq(userFiles.storageKey, storageKey),
        columns: { fileData: true, mimeType: true },
    });

    if (!file || !file.fileData) {
        return null;
    }

    return { data: file.fileData, mimeType: file.mimeType };
}

export async function deleteFileByStorageKey(
    storageKey: string,
): Promise<void> {
    const db = await getDb();
    await db.delete(userFiles).where(eq(userFiles.storageKey, storageKey));
}

export async function deleteFilesByPrefix(
    userId: string,
    prefix: string,
): Promise<void> {
    const db = await getDb();
    await db.delete(userFiles).where(
        and(
            eq(userFiles.userId, userId),
        ),
    );
}

export async function createFileRecord(
    userId: string,
    resumeId: string | null,
    fileType: "photo" | "resume_pdf",
    storageKey: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    fileData: string,
): Promise<void> {
    const db = await getDb();

    const fileId = crypto.randomUUID();

    await db.insert(userFiles).values({
        id: fileId,
        userId,
        resumeId,
        fileType,
        storageKey,
        fileName,
        fileSize,
        mimeType,
        fileData,
    });
}

export async function getFileRecord(
    storageKey: string,
) {
    const db = await getDb();
    return db.query.userFiles.findFirst({
        where: eq(userFiles.storageKey, storageKey),
    });
}

export async function deleteUserFiles(
    userId: string,
    resumeId: string,
    fileType: "photo" | "resume_pdf",
): Promise<void> {
    const db = await getDb();
    await db.delete(userFiles).where(
        and(
            eq(userFiles.userId, userId),
            eq(userFiles.resumeId, resumeId),
            eq(userFiles.fileType, fileType),
        ),
    );
}
