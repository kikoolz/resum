"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Loader2, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DoodleBackground } from "../doodle-background";

export default function SignUp() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (referralCode) {
      localStorage.setItem("pendingReferral", referralCode);
    }
  }, [referralCode]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp.email(
        {
          name,
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message || "Could not create account");
            setLoading(false);
          },
        }
      );
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Gradient orb */}
        <div className="absolute top-[15%] left-[10%] w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <section className="relative flex-1 flex items-stretch">
          {/* Left column — full-height background + divider */}
          <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center px-12">
            {/* Background */}
            <div className="absolute inset-0">
              <DoodleBackground />
            </div>
            {/* Vertical divider */}
            <div className="absolute top-0 right-0 bottom-0 w-px bg-foreground/10" />
            {/* Content */}
            <div className="relative z-10 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                  Get Started
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8"
              >
                Start
                <br />
                <span className="italic text-primary">Free</span>.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="h-px bg-foreground/10 w-16 mb-8"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-md leading-relaxed mb-10"
              >
                Create your account in seconds. Build AI-powered resumes,
                analyze existing ones, and land your dream job — all for free.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                {[
                  { number: "01", text: "3 free resumes" },
                  { number: "02", text: "50,000 AI tokens per month" },
                  { number: "03", text: "PDF export included" },
                ].map((item) => (
                  <div key={item.number} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-muted-foreground tracking-widest w-6">
                      {item.number}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right column — form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full max-w-md"
            >
              {/* Mobile divider */}
              <div className="h-px bg-foreground/10 mb-10 lg:hidden" />

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">
                    Create your account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="font-medium text-foreground underline underline-offset-4 decoration-foreground/20 hover:text-primary hover:decoration-primary transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Google OAuth */}
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-foreground/10 hover:bg-muted/50 hover:border-foreground/20 transition-all"
                  disabled={loading}
                  onClick={async () => {
                    await signIn.social({
                      provider: "google",
                      callbackURL: "/dashboard",
                      fetchOptions: {
                        onRequest: () => setLoading(true),
                        onResponse: () => setLoading(false),
                      },
                    });
                  }}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 256 262"
                      className="mr-2"
                    >
                      <path
                        fill="#4285F4"
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      />
                      <path
                        fill="#34A853"
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      />
                      <path
                        fill="#FBBC05"
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                      />
                      <path
                        fill="#EB4335"
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-foreground/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground tracking-widest">
                      or
                    </span>
                  </div>
                </div>

                {/* Email/Password form */}
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-md border border-foreground/10 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-md border border-foreground/10 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full h-11 px-3 rounded-md border border-foreground/10 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="h-px bg-foreground/10" />

                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  By creating an account, you agree to our{" "}
                  <span className="underline underline-offset-2 decoration-foreground/20 cursor-pointer hover:text-foreground transition-colors">
                    Terms of Service
                  </span>
                  {" "}and{" "}
                  <span className="underline underline-offset-2 decoration-foreground/20 cursor-pointer hover:text-foreground transition-colors">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Back to home */}
              <div className="mt-12">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to home
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
