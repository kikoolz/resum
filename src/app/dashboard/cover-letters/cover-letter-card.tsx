"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, FileText, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "../actions";

interface CoverLetterCardProps {
  coverLetter: {
    id: string;
    title: string | null;
    companyName: string | null;
    jobTitle: string | null;
    updatedAt: Date | null;
  };
}

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const editorHref = `/dashboard/cover-letters/${coverLetter.id}`;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteCoverLetter(coverLetter.id);
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
        <Link href={editorHref} className="block p-5">
          <div className="mb-3 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h3 className="font-medium text-foreground line-clamp-1">
            {coverLetter.title || "Untitled Cover Letter"}
          </h3>
          {coverLetter.companyName && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {coverLetter.companyName}
              {coverLetter.jobTitle ? ` — ${coverLetter.jobTitle}` : ""}
            </p>
          )}
          {!coverLetter.companyName && coverLetter.jobTitle && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {coverLetter.jobTitle}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground/70">
            {coverLetter.updatedAt
              ? new Date(coverLetter.updatedAt).toLocaleDateString()
              : "Recently created"}
          </p>
        </Link>

        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(editorHref)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete cover letter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;
              {coverLetter.title || "Untitled Cover Letter"}&quot;. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
