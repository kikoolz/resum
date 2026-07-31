import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileId = crypto.randomUUID();
    const blobKey = `${userId}/tiptap/${fileId}.${ext}`;

    const result = await put(blobKey, file, {
      access: "private",
      contentType: file.type,
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (err) {
    console.error("[upload-image] error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
