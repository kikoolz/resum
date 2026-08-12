import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userFiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { UploadsClient } from "./uploads-client";
import { UploadSection } from "./upload-section";

export const dynamic = "force-dynamic";

export default async function UploadsPage() {
    const session = await requireSession();
    const db = await getDb();

    const files = await db
        .select({
            id: userFiles.id,
            fileName: userFiles.fileName,
            fileSize: userFiles.fileSize,
            mimeType: userFiles.mimeType,
            r2Key: userFiles.r2Key,
            createdAt: userFiles.createdAt,
        })
        .from(userFiles)
        .where(eq(userFiles.userId, session.user.id))
        .orderBy(desc(userFiles.createdAt));

    const filesWithUrls = files.map((file) => ({
        ...file,
        url: `/api/files/${encodeURIComponent(file.r2Key)}`,
        createdAt: file.createdAt,
    }));

    return (
        <div className="container mx-auto flex flex-1 flex-col gap-6 px-4 py-8">
            <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Manage
                </div>
                <h1 className="text-2xl font-bold font-heading tracking-tight">
                    Uploads
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Upload PDF resumes to extract and analyze with AI.
                </p>
            </div>

            <div className="h-px bg-foreground/10" />

            <UploadSection />

            {filesWithUrls.length > 0 ? (
                <UploadsClient files={filesWithUrls} />
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        No files yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                        Upload a PDF above to get started.
                    </p>
                </div>
            )}
        </div>
    );
}
