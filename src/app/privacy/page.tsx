import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for AI Resume Builder. Learn how we collect, use, and protect your personal information and resume data.",
  openGraph: {
    title: "Privacy Policy | AI Resume Builder",
    description:
      "Privacy Policy for AI Resume Builder. Learn how we collect, use, and protect your personal information and resume data.",
    url: "https://airesume.dev/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="border-b border-foreground/10 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold font-heading text-lg"
          >
            <Logo className="h-4 w-4" />
            AI Resume
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 md:py-24 max-w-3xl">
        <div className="mb-12">
          <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: July 27, 2026
          </p>
        </div>

        <div className="space-y-12 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              AI Resume Builder (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our AI-powered resume
              building platform and related services (the &quot;Service&quot;).
            </p>
            <p>
              By using the Service, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with the terms of this Privacy Policy, please do not access the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect several types of information to provide and improve
              the Service:
            </p>

            <h3 className="text-lg font-bold tracking-tight mb-3 mt-6">
              Account Information
            </h3>
            <p className="mb-4">
              When you create an account using Google OAuth, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name and email address from your Google account</li>
              <li>Google account profile picture (if available)</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="text-lg font-bold tracking-tight mb-3 mt-6">
              Resume Data
            </h3>
            <p className="mb-4">
              The resume content you create, upload, or generate through the
              Service, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Personal contact information (name, email, phone, address)</li>
              <li>Employment history and job descriptions</li>
              <li>Education details and credentials</li>
              <li>Skills, certifications, and qualifications</li>
              <li>Project descriptions and achievements</li>
              <li>Uploaded documents and files</li>
              <li>Portfolio content and URLs</li>
            </ul>

            <h3 className="text-lg font-bold tracking-tight mb-3 mt-6">
              Usage Data
            </h3>
            <p className="mb-4">
              We automatically collect certain information when you use the
              Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Device information (browser type, operating system, device type)</li>
              <li>IP address and approximate geographic location</li>
              <li>Pages visited, features used, and actions taken</li>
              <li>Time stamps of account creation and activity</li>
              <li>Referring website or source</li>
            </ul>

            <h3 className="text-lg font-bold tracking-tight mb-3 mt-6">
              Payment Information
            </h3>
            <p>
              When you subscribe to a paid plan, payment is processed by Stripe.
              We do not store your credit card number or payment details on our
              servers. Stripe&apos;s privacy policy governs the handling of your
              payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Providing the Service:</strong> To create, edit, store,
                and export your resumes and related documents
              </li>
              <li>
                <strong>AI Processing:</strong> To process your resume data
                through our AI models for content enhancement, ATS scoring,
                and generation of suggestions
              </li>
              <li>
                <strong>Account Management:</strong> To create and manage your
                account, authenticate your identity, and provide customer
                support
              </li>
              <li>
                <strong>Service Improvement:</strong> To analyze usage patterns,
                debug issues, and develop new features
              </li>
              <li>
                <strong>Communication:</strong> To send you account-related
                notifications, service updates, and (with your consent)
                marketing communications
              </li>
              <li>
                <strong>Security:</strong> To detect, prevent, and address fraud,
                abuse, and security issues
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable laws,
                regulations, and legal processes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              4. AI Processing Disclosure
            </h2>
            <p className="mb-4">
              Our Service uses artificial intelligence to enhance and generate
              resume content. When you use AI features:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Your resume data is processed by third-party AI models to
                generate suggestions, enhancements, and new content
              </li>
              <li>
                AI processing is performed in real-time and is not used to
                train or improve AI models
              </li>
              <li>
                We do not share your personal data with AI providers for their
                own purposes
              </li>
              <li>
                AI-generated content is provided to you and is not stored by
                third-party AI providers beyond what is necessary to fulfill
                the request
              </li>
            </ul>
            <p>
              You can use the Service without enabling AI features if you prefer
              not to have your data processed by AI systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              5. Data Storage and Security
            </h2>
            <p className="mb-4">
              Your data is stored on Cloudflare&apos;s infrastructure:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Cloudflare D1:</strong> A serverless SQL database that
                stores your account information and resume data
              </li>
              <li>
                <strong>Cloudflare R2:</strong> An object storage service that
                stores uploaded files and generated documents
              </li>
              <li>
                <strong>Encryption:</strong> All data is encrypted in transit
                (TLS 1.3) and at rest (AES-256)
              </li>
              <li>
                <strong>Data Centers:</strong> Your data is stored in data
                centers located in the United States and other regions served
                by Cloudflare
              </li>
            </ul>
            <p>
              While we implement industry-standard security measures, no method
              of electronic transmission or storage is 100% secure. We cannot
              guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              6. Third-Party Services
            </h2>
            <p className="mb-4">
              We use the following third-party services that may collect or
              process your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Google OAuth:</strong> For authentication and account
                creation. Google&apos;s privacy policy applies.
              </li>
              <li>
                <strong>Stripe:</strong> For payment processing. Stripe&apos;s
                privacy policy applies to payment data.
              </li>
              <li>
                <strong>Cloudflare:</strong> For hosting, storage, and content
                delivery. Cloudflare&apos;s privacy policy applies.
              </li>
              <li>
                <strong>Vercel:</strong> For application hosting and deployment.
                Vercel&apos;s privacy policy applies.
              </li>
            </ul>
            <p>
              These third-party services have access to your information only to
              perform specific tasks on our behalf and are obligated not to
              disclose or use it for other purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              7. Data Retention
            </h2>
            <p className="mb-4">
              We retain your personal information and resume data for as long as
              your account is active or as needed to provide the Service.
              Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Active Accounts:</strong> All data is retained while
                your account remains active
              </li>
              <li>
                <strong>Canceled Subscriptions:</strong> Free plan data is
                retained for 12 months after the last login. Paid plan data
                is retained for 30 days after cancellation, then migrated to
                free tier limits
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Upon account deletion, all
                personal data is permanently removed within 30 days. Resume
                data is purged within 90 days to allow for recovery.
              </li>
              <li>
                <strong>Usage Analytics:</strong> Aggregated, anonymized usage
                data may be retained indefinitely for analytics purposes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              8. Your Rights
            </h2>
            <p className="mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Access:</strong> You may request a copy of the personal
                data we hold about you
              </li>
              <li>
                <strong>Correction:</strong> You may request that we correct
                inaccurate or incomplete data
              </li>
              <li>
                <strong>Deletion:</strong> You may request that we delete your
                personal data, subject to certain legal exceptions
              </li>
              <li>
                <strong>Data Export:</strong> You may export your resume data at
                any time through your account settings or by contacting us
              </li>
              <li>
                <strong>Objection:</strong> You may object to certain types of
                data processing, including marketing communications
              </li>
              <li>
                <strong>Restriction:</strong> You may request that we restrict
                processing of your data in certain circumstances
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:contact@airesume.dev"
                className="text-primary hover:underline"
              >
                contact@airesume.dev
              </a>
              . We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              9. Cookies and Tracking
            </h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to maintain your
              session and improve the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Required for authentication,
                session management, and core functionality. These cannot be
                disabled.
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings,
                such as theme preference and language.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors use the Service. We use privacy-focused analytics
                that do not track users across sites.
              </li>
            </ul>
            <p>
              You can control cookie preferences through your browser settings.
              Disabling essential cookies may impair the functionality of the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not intended for children under 16 years of age.
              We do not knowingly collect personal information from children
              under 16. If we become aware that we have collected personal data
              from a child under 16, we will take steps to delete such
              information promptly. If you become aware that a child has
              provided us with personal data, please contact us at{" "}
              <a
                href="mailto:contact@airesume.dev"
                className="text-primary hover:underline"
              >
                contact@airesume.dev
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the &quot;Last updated&quot;
              date. We encourage you to review this Privacy Policy periodically
              for any changes. Your continued use of the Service after any
              modifications to this Privacy Policy constitutes your acceptance
              of such changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              12. Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us at{" "}
              <a
                href="mailto:contact@airesume.dev"
                className="text-primary hover:underline"
              >
                contact@airesume.dev
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-foreground/10 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} AI Resume Builder. All rights
            reserved.{" "}
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}