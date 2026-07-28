import Link from "next/link";
import { Linkedin } from "lucide-react";
import { Logo } from "@/components/logo";
import { GithubIcon } from "./github-icon";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Logo className="h-5 w-5" />
            <span className="text-lg font-bold font-heading tracking-tight">
              Re<span className="text-primary">s</span>um
              <span className="text-primary">.</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Resum. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/kennethkikoole/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/kikoolz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
