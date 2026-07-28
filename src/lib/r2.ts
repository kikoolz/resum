import { put, del, head } from "@vercel/blob";

export async function uploadToBlob(
  key: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const result = await put(key, data, {
    access: "private",
    contentType,
  });
  return result.url;
}

export async function deleteFromBlob(key: string): Promise<void> {
  await del(key);
}

export async function headBlob(
  key: string,
): Promise<{ size: number; url: string } | null> {
  try {
    const result = await head(key);
    return { size: result.size, url: result.url };
  } catch {
    return null;
  }
}

export function buildBlobKey(
  userId: string,
  _fileType: "photo" | "resume_pdf",
  fileId: string,
  extension: string,
): string {
  return `${userId}/${fileId}.${extension}`;
}

export function blobKeyToUrl(blobKey: string): string {
  return `/api/files/${blobKey}`;
}

export const PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const PDF_MIME_TYPES = new Set(["application/pdf"]);

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB
