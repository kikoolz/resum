import { getDb } from "@/db";
import { coverLetters } from "@/db/schema";
import { requireSession } from "@/lib/auth-server";
import { canCreateCoverLetter } from "@/lib/subscription";
import { eq, desc } from "drizzle-orm";
import { Plus, Lock, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCoverLetter } from "../actions";
import { CoverLetterCard } from "./cover-letter-card";

export default async function CoverLettersPage() {
  const session = await requireSession();
  const db = await getDb();

  const userCoverLetters = await db.query.coverLetters.findMany({
    where: eq(coverLetters.userId, session.user.id),
    orderBy: [desc(coverLetters.updatedAt)],
  });

  const {
    allowed: canCreate,
    current,
    limit,
  } = await canCreateCoverLetter(session.user.id);

  async function handleCreateCoverLetter() {
    "use server";
    await createCoverLetter();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Cover Letters</h1>
          <p className="mt-1 text-muted-foreground">
            {userCoverLetters.length === 0
              ? "Create your first AI-powered cover letter"
              : `You have ${userCoverLetters.length} cover letter${userCoverLetters.length === 1 ? "" : "s"}`}
            {!canCreate && limit === 0 && (
              <span className="ml-1 text-xs text-primary">(Pro feature)</span>
            )}
          </p>
        </div>
        {userCoverLetters.length > 0 && (
          <form action={handleCreateCoverLetter}>
            <Button type="submit" disabled={!canCreate}>
              {!canCreate ? (
                <>
                  <Lock className="mr-1.5 h-4 w-4" />
                  Pro Only
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Cover Letter
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Pro upgrade banner for free users */}
      {!canCreate && limit === 0 && (
        <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm font-medium text-primary">
            Cover letters are a Pro feature
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Upgrade to Pro for unlimited AI-powered cover letters.{" "}
            <a
              href="/dashboard/billing"
              className="font-medium underline underline-offset-2 hover:text-primary"
            >
              View plans
            </a>
          </p>
        </div>
      )}

      {/* Cover Letters Grid */}
      {userCoverLetters.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Create New Card */}
          {canCreate && (
            <div className="group overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-card transition-all hover:border-primary/50 hover:shadow-md">
              <form action={handleCreateCoverLetter} className="h-full">
                <button
                  type="submit"
                  className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 text-muted-foreground transition-colors group-hover:text-primary"
                >
                  <div className="rounded-full border-2 border-dashed border-muted-foreground/30 p-4 transition-colors group-hover:border-primary/50">
                    <Plus className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-medium">
                    Create New Cover Letter
                  </span>
                </button>
              </form>
            </div>
          )}

          {userCoverLetters.map((cl) => (
            <CoverLetterCard key={cl.id} coverLetter={cl} />
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 rounded-full bg-primary/10 p-4">
              <Snowflake className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">No cover letters yet</CardTitle>
            <CardDescription>
              {canCreate
                ? "Create your first AI-powered cover letter tailored to any job."
                : "Upgrade to Pro to create AI-powered cover letters."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            {canCreate ? (
              <form action={handleCreateCoverLetter}>
                <Button type="submit" size="lg">
                  <Snowflake className="mr-1.5 h-4 w-4" />
                  Create Your First Cover Letter
                </Button>
              </form>
            ) : (
              <a href="/dashboard/billing">
                <Button size="lg" variant="outline">
                  Upgrade to Pro
                </Button>
              </a>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
