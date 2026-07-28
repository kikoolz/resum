import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { generatePortfolioFromResume } from "@/app/dashboard/actions";

interface RouteParams {
    params: Promise<{ resumeId: string }>;
}

/**
 * GET /api/portfolio/[resumeId]
 *
 * Generates (or re-generates) a neobrutalist portfolio HTML page for the
 * authenticated user's resume and returns it as a text/html response.
 * Requires authentication — not a public URL.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        await requireSession();

        const { resumeId } = await params;

        const result = await generatePortfolioFromResume(resumeId);

        if (!result.success || !result.html) {
            return NextResponse.json(
                { error: result.error ?? "Failed to generate portfolio" },
                { status: 500 },
            );
        }

        return new NextResponse(result.html, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                // Don't cache — each call re-generates
                "Cache-Control": "no-store",
            },
        });
    } catch (err) {
        console.error("[GET /api/portfolio/[resumeId]]", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
