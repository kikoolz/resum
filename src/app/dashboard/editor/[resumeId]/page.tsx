import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { requireSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ResumeEditor from "./ResumeEditor";

interface EditorPageProps {
    params: Promise<{ resumeId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { resumeId } = await params;
    const session = await requireSession();

    let resumeToEdit = null;

    if (resumeId !== "new") {
        const db = await getDb();
        const result = await db.query.resumes.findFirst({
            where: and(
                eq(resumes.id, resumeId),
                eq(resumes.userId, session.user.id),
            ),
            with: {
                workExperiences: true,
                educations: true,
                projects: true,
                awards: true,
                publications: true,
                certificates: true,
                languages: true,
                courses: true,
                resumeReferences: true,
                interests: true,
            },
        });

        if (!result) {
            notFound();
        }

        resumeToEdit = result;
    }

    return (
        <Suspense
            fallback={
                <div className="flex h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden">
                    <div className="text-muted-foreground">
                        Loading editor...
                    </div>
                </div>
            }
        >
            <div className="h-[calc(100dvh-4rem)] w-full overflow-hidden">
                <ResumeEditor resumeToEdit={resumeToEdit} />
            </div>
        </Suspense>
    );
}
