"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FileText, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 group">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold font-heading tracking-tight">
            Re<span className="text-primary">s</span>um
            <span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <ModeToggle />
          {isPending ? (
            <Button disabled variant="ghost">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : session ? (
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
      <div className="h-px bg-foreground/10" />
    </header>
  );
}
