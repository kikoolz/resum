"use client";

import React from "react";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { requireSession } from "@/lib/auth-server";
import { canCreateResume, PLAN_LIMITS, getUserTier } from "@/lib/subscription";
import { eq, desc } from "drizzle-orm";
import { Plus, FileText, Snowflake, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResumeCard } from "./resume-card";
import TemplatesSection from "./templates-section";
import { CreateResumeDialog } from "./create-resume-dialog";

function CreateResumeButton({ atLimit, size }: { atLimit: boolean; size?: "default" | "lg" }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={atLimit}
        className="font-bold rounded-none"
        size={size}
      >
        {atLimit ? (
          <>
            <Lock className="mr-1.5 h-4 w-4" />
            Limit Reached
          </>
        ) : (
          <>
            <Plus className="mr-1.5 h-4 w-4" />
            New Resume
          </>
        )}
      </Button>
      <CreateResumeDialog open={open} onOpenChange={setOpen} atLimit={atLimit} />
    </>
  );
}

function CreateResumeCard() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="group overflow-hidden rounded-none border-2 border-dashed border-muted-foreground/25 bg-card transition-all hover:border-primary/50 hover:shadow-md">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-3 text-muted-foreground transition-colors group-hover:text-primary"
          style={{ aspectRatio: "210 / 297" }}
        >
          <div className="rounded-full border-2 border-dashed border-muted-foreground/30 p-4 transition-colors group-hover:border-primary/50">
            <Plus className="h-8 w-8" />
          </div>
          <span className="text-sm font-medium">Create New Resume</span>
        </button>
      </div>
      <CreateResumeDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export default async function DashboardPage() {
  const session = await requireSession();
  const db = await getDb();

  const userResumes = await db.query.resumes.findMany({
    where: eq(resumes.userId, session.user.id),
    orderBy: [desc(resumes.updatedAt)],
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

  const {
    allowed: canCreate,
    current,
    limit,
  } = await canCreateResume(session.user.id);
  const atLimit = !canCreate;
  const userTier = await getUserTier(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mt-1 text-muted-foreground">
            {userResumes.length === 0
              ? "Create your first resume to get started"
              : `You have ${userResumes.length} resume${userResumes.length === 1 ? "" : "s"}`}
            {limit !== Infinity && (
              <span className="ml-1 text-xs">
                ({current}/{PLAN_LIMITS.free.resumes} free)
              </span>
            )}
          </p>
        </div>
        {userResumes.length > 0 && (
          <CreateResumeButton atLimit={atLimit} />
        )}
      </div>

      {/* Free-plan limit banner */}
      {atLimit && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            You&apos;ve reached the free plan limit ({current}/
            {PLAN_LIMITS.free.resumes} resumes).
          </p>
          <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
            Upgrade to Pro for unlimited resumes, premium templates, and more.{" "}
            <a
              href="/dashboard/billing"
              className="font-medium underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-200"
            >
              View plans
            </a>
          </p>
        </div>
      )}

      {/* Resumes Grid */}
      {userResumes.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {/* Create New Card */}
          {canCreate ? (
            <CreateResumeCard />
          ) : (
            <div className="overflow-hidden rounded-none border-2 border-dashed border-muted-foreground/15 bg-card opacity-50">
              <div
                className="flex w-full flex-col items-center justify-center gap-3 text-muted-foreground"
                style={{ aspectRatio: "210 / 297" }}
              >
                <div className="rounded-full border-2 border-dashed border-muted-foreground/20 p-4">
                  <Lock className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">Limit Reached</span>
                <span className="text-xs text-muted-foreground/70">
                  {current}/{PLAN_LIMITS.free.resumes} free resumes
                </span>
              </div>
            </div>
          )}

          {userResumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} userTier={userTier} />
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 rounded-full bg-primary/10 p-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">No resumes yet</CardTitle>
            <CardDescription>
              Get started by creating your first AI-powered resume. It only
              takes a few minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <CreateResumeButton atLimit={atLimit} size="lg" />
          </CardContent>
        </Card>
      )}

      {/* Templates Section — Client Component for modal state */}
      <TemplatesSection userTier={userTier} />
    </div>
  );
}
