import { getDb } from "@/db";
import { coverLetters, resumes } from "@/db/schema";
import { requireSession } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import CoverLetterEditor from "./CoverLetterEditor";

interface PageProps {
    params: Promise<{ coverLetterId: string }>;
}

export default async function CoverLetterEditorPage({ params }: PageProps) {
    const { coverLetterId } = await params;
    const session = await requireSession();
    const db = await getDb();

    const coverLetter = await db.query.coverLetters.findFirst({
        where: and(
            eq(coverLetters.id, coverLetterId),
            eq(coverLetters.userId, session.user.id),
        ),
    });

    if (!coverLetter) {
        notFound();
    }

    // Get user's resumes for linking
    const userResumes = await db.query.resumes.findMany({
        where: eq(resumes.userId, session.user.id),
        columns: { id: true, title: true, firstName: true, lastName: true, jobTitle: true },
        orderBy: [resumes.updatedAt],
    });

    return (
        <CoverLetterEditor
            coverLetter={coverLetter}
            resumes={userResumes}
        />
    );
}
