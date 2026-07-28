import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { requireSession } from "@/lib/auth-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    const session = await requireSession();

    const { key } = await params;
    const blobKey = key.map(decodeURIComponent).join("/");

    // Ownership check
    const pathSegments = blobKey.split("/");
    if (pathSegments[0] !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Use list to find the blob by prefix (the full key)
    const { blobs } = await list({ prefix: blobKey, limit: 1 });
    const blob = blobs.find((b) => b.pathname === blobKey);

    if (!blob) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Fetch the blob content via its URL with auth
    const response = await fetch(blob.url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    headers.set("Cache-Control", "private, max-age=3600");

    const body = await response.arrayBuffer();
    return new NextResponse(body, { headers });
  } catch (err) {
    console.error("[files/serve] error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
