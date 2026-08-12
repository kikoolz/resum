import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ key: string[] }> },
) {
    try {
        const session = await requireSession();

        const { key } = await params;
        const storageKey = key.map(decodeURIComponent).join("/");

        const pathSegments = storageKey.split("/");
        if (pathSegments[0] !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const db = await getDb();
        const file = await db.query.userFiles.findFirst({
            where: eq(userFiles.r2Key, storageKey),
            columns: { fileData: true, mimeType: true },
        });

        if (!file || !file.fileData) {
            return new NextResponse("Not found", { status: 404 });
        }

        const buffer = Buffer.from(file.fileData, "base64");

        const headers = new Headers();
        headers.set("Content-Type", file.mimeType || "application/octet-stream");
        headers.set("Cache-Control", "private, max-age=3600");

        return new NextResponse(buffer, { headers });
    } catch (err) {
        console.error("[files/serve] error:", err);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
