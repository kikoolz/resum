"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit, FileDown, MoreVertical, Printer, Snowflake, Trash2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
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
import { deleteResume } from "./actions";
import { mapToResumeValues } from "@/lib/utils";
import type { ResumeServerData } from "@/lib/types";
import ResumeTemplate from "./editor/[resumeId]/ResumeTemplate";
import PrintableResume from "./editor/[resumeId]/PrintableResume";
import {
  CONTENT_WIDTH,
  PAGE_PADDING_X,
  PAGE_PADDING_Y,
  PAGE_WIDTH,
  RESUME_PRINT_PAGE_STYLE,
  getPreviewFontFamilyCss,
} from "./editor/[resumeId]/previewConfig";
import PortfolioModal from "./editor/[resumeId]/PortfolioModal";

interface ResumeCardProps {
  resume: ResumeServerData;
  userTier?: "free" | "pro" | "lifetime";
}

export function ResumeCard({ resume, userTier }: ResumeCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(300);
  const [mounted, setMounted] = useState(false);

  const resumeValues = useMemo(() => mapToResumeValues(resume), [resume]);

  const fontFamilyCss = getPreviewFontFamilyCss(resumeValues.fontFamily);
  const fontScale = (resumeValues.fontSize ?? 10) / 10;
  const effectiveContentWidth = CONTENT_WIDTH / fontScale;
  const thumbScale = cardWidth / PAGE_WIDTH;

  useEffect(() => {
    setMounted(true);
    const el = previewRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setCardWidth(entries[0]?.contentRect.width ?? 300);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resume.title || "Resume",
    pageStyle: RESUME_PRINT_PAGE_STYLE,
    onBeforePrint: async () => {
      const el = printRef.current;
      if (!el) return;
      const imgs = Array.from(el.querySelectorAll("img"));
      await Promise.allSettled(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve();
                return;
              }
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
        ),
      );
    },
  });

  async function handleDocxDownload() {
    try {
      const res = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: resume.id }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(resumeValues.firstName || "resume").replace(/\s+/g, "_")}_${(resumeValues.lastName || "").replace(/\s+/g, "_")}_resume.docx`.replace(/^_/, "");
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export error:", err);
    }
  }

  const editorHref = `/dashboard/editor/${resume.id}`;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteResume(resume.id);
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-none border bg-card transition-all hover:shadow-md">
        {/* Preview thumbnail — use div + onClick to avoid <a> nesting */}
        <div
          ref={previewRef}
          role="link"
          tabIndex={0}
          className="relative block w-full cursor-pointer overflow-hidden bg-white"
          style={{ aspectRatio: "210 / 297" }}
          onClick={() => router.push(editorHref)}
          onKeyDown={(e) => {
            if (e.key === "Enter") router.push(editorHref);
          }}
        >
          <div
            className="pointer-events-none absolute left-0 top-0 origin-top-left"
            style={{
              width: PAGE_WIDTH,
              transform: `scale(${thumbScale})`,
              transformOrigin: "top left",
            }}
          >
            <div
              style={{
                padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
              }}
            >
              <div style={{ width: effectiveContentWidth }}>
                <div style={{ zoom: fontScale }}>
                  {mounted && (
                    <ResumeTemplate
                      resumeData={resumeValues}
                      fontFamily={fontFamilyCss}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card footer */}
        <div className="flex items-center gap-2 border-t px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {resume.title || "Untitled Resume"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(resume.updatedAt, {
                addSuffix: true,
              })}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={editorHref}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrint()}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Save PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDocxDownload}>
                <FileDown className="mr-2 h-4 w-4" />
                Download DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPortfolioOpen(true)}>
                <Snowflake className="mr-2 h-4 w-4" />
                Generate Portfolio
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

      {mounted && <PrintableResume ref={printRef} resumeData={resumeValues} userTier={userTier} />}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;
              {resume.title || "Untitled Resume"}&quot;. This action cannot be
              undone.
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

      <PortfolioModal
        open={portfolioOpen}
        onOpenChange={setPortfolioOpen}
        resumeId={resume.id}
        resumeTitle={resume.title ?? undefined}
      />
    </>
  );
}
