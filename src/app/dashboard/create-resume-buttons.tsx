"use client";

import React from "react";
import { Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateResumeDialog } from "./create-resume-dialog";

export function CreateResumeButton({
  atLimit,
  size,
}: {
  atLimit: boolean;
  size?: "default" | "lg";
}) {
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

export function CreateResumeCard() {
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
