import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Resum. Read our terms and conditions for using our AI-powered resume building platform.",
  openGraph: {
    title: "Terms of Service | Resum",
    description:
      "Terms of Service for Resum. Read our terms and conditions for using our AI-powered resume building platform.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://resum-mu.vercel.app"}/terms`,
  },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: July 27, 2026
          </p>
        </div>

        <div className="space-y-12 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using Resum (&quot;the Service&quot;),
              you agree to be bound by these Terms of Service (&quot;Terms&quot;).
              If you do not agree to all of these Terms, you may not access or
              use the Service. We reserve the right to modify these Terms at any
              time. Your continued use of the Service following the posting of
              revised Terms means that you accept and agree to the changes.
            </p>
            <p>
              You must be at least 16 years of age to use the Service. By using
              the Service, you represent and warrant that you meet this age
              requirement and have the legal capacity to enter into a binding
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              2. Description of Service
            </h2>
            <p className="mb-4">
              Resum is an AI-powered platform that helps users
              create, edit, and optimize professional resumes and cover letters.
              The Service provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>AI-assisted resume generation and content enhancement</li>
              <li>ATS (Applicant Tracking System) compatibility scoring</li>
              <li>Professional resume templates and design tools</li>
              <li>PDF and document export capabilities</li>
              <li>Portfolio hosting for sharing resumes online</li>
              <li>Cover letter generation and editing</li>
            </ul>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, whether express
              or implied. We do not guarantee that the Service will be
              uninterrupted, timely, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              3. User Accounts
            </h2>
            <p className="mb-4">
              To access certain features of the Service, you must create an
              account. You may register using Google OAuth authentication. When
              creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Provide accurate, current, and complete information during the
                registration process
              </li>
              <li>
                Maintain the security of your password and accept all risks of
                unauthorized access to your account
              </li>
              <li>
                Notify us immediately if you discover or suspect any security
                breaches related to the Service
              </li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
            </ul>
            <p>
              We reserve the right to suspend or terminate your account at any
              time, for any reason, including if we reasonably believe that your
              account has been compromised or that you have violated these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              4. Acceptable Use
            </h2>
            <p className="mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Create resumes containing false, misleading, or fraudulent
                information
              </li>
              <li>
                Impersonate any person or entity, or falsely state or otherwise
                misrepresent your identity or affiliation
              </li>
              <li>
                Upload or transmit malicious code, viruses, or other harmful
                technology
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service or its related systems
              </li>
              <li>
                Use the Service for any illegal purpose or in violation of any
                applicable law or regulation
              </li>
              <li>
                Interfere with or disrupt the Service or servers or networks
                connected to the Service
              </li>
              <li>
                Use automated systems, bots, or scrapers to access the Service
              </li>
              <li>
                Resell, redistribute, or sublicense the Service or any portion
                thereof without our written consent
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              5. Intellectual Property
            </h2>
            <p className="mb-4">
              The Service and its original content, features, functionality,
              design, and documentation are owned by Resum and are
              protected by international copyright, trademark, patent, trade
              secret, and other intellectual property or proprietary rights
              laws.
            </p>
            <p className="mb-4">
              You retain all rights to the content you submit to the Service,
              including your resume data, personal information, and uploaded
              documents. By using the Service, you grant us a limited,
              non-exclusive license to process, store, and display your content
              solely for the purpose of providing the Service to you.
            </p>
            <p>
              AI-generated content created through the Service is provided for
              your personal use. You may use, modify, and distribute AI-generated
              resume content as you see fit, subject to the accuracy disclaimers
              outlined in Section 6.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              6. AI-Generated Content Disclaimer
            </h2>
            <p className="mb-4">
              The Service uses artificial intelligence to generate, enhance, and
              optimize resume content. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                AI-generated content may contain inaccuracies, errors, or
                omissions. You are solely responsible for reviewing and editing
                all AI-generated content before use.
              </li>
              <li>
                AI-generated suggestions and enhancements are not guaranteed to
                be factually accurate, appropriate, or effective for your
                specific situation.
              </li>
              <li>
                The Service does not guarantee that AI-generated content will
                result in job interviews, offers, or any specific employment
                outcomes.
              </li>
              <li>
                ATS scoring and compatibility assessments are estimates based on
                general algorithms and should not be considered definitive
                evaluations.
              </li>
              <li>
                You should independently verify all information in your resume
                before submitting it to potential employers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              7. Payment and Subscription Terms
            </h2>
            <p className="mb-4">
              The Service offers both free and paid subscription plans. By
              selecting a paid plan, you agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Billing:</strong> Payments are processed through Stripe.
                You authorize us to charge your selected payment method for all
                applicable fees.
              </li>
              <li>
                <strong>Recurring Charges:</strong> Subscription fees are billed
                on a recurring monthly or annual basis, depending on your
                selected plan. Subscriptions automatically renew unless canceled
                before the renewal date.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel your subscription
                at any time through your account settings. Cancellation takes
                effect at the end of the current billing period. No prorated
                refunds are provided for partial months.
              </li>
              <li>
                <strong>Price Changes:</strong> We reserve the right to modify
                pricing with 30 days&apos; notice. Price changes will take
                effect at the start of your next billing cycle.
              </li>
              <li>
                <strong>Free Tier:</strong> Free plan usage is subject to
                monthly token and resume limits. We reserve the right to modify
                free tier limitations at our discretion.
              </li>
              <li>
                <strong>Refunds:</strong> All payments are non-refundable except
                where required by applicable law. If you believe a charge was
                made in error, contact us at contact@airesume.dev.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              8. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, AI Resume
              Builder and its officers, directors, employees, agents, and
              affiliates shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not
              limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Loss of profits, data, business opportunities, or goodwill
              </li>
              <li>
                Damages resulting from your use of or inability to use the
                Service
              </li>
              <li>
                Damages resulting from any content obtained through the Service
              </li>
              <li>
                Damages resulting from unauthorized access to or alteration of
                your data
              </li>
            </ul>
            <p>
              In no event shall our total aggregate liability exceed the greater
              of one hundred U.S. dollars (USD $100.00) or the amount you paid
              us, if any, in the past six months for the services giving rise to
              the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              9. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless AI Resume
              Builder and its officers, directors, employees, agents, and
              affiliates from and against any claims, liabilities, damages,
              losses, and expenses (including reasonable attorneys&apos; fees)
              arising out of or in any way connected with your access to or use
              of the Service, your violation of these Terms, or your violation
              of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              10. Termination
            </h2>
            <p className="mb-4">
              We may terminate or suspend your access to the Service immediately,
              without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will cease
              immediately. You may request export of your data by contacting us
              at contact@airesume.dev within 30 days of termination. After this
              period, your data may be permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              11. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to its conflict of
              law provisions. Any legal proceedings arising out of or relating to
              these Terms shall be brought exclusively in the courts of competent
              jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify or replace these Terms at any time
              at our sole discretion. If a revision is material, we will provide
              at least 30 days&apos; notice prior to any new terms taking effect.
              What constitutes a material change will be determined at our sole
              discretion. By continuing to access or use our Service after those
              revisions become effective, you agree to be bound by the revised
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              13. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
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
            © {new Date().getFullYear()} Resum. All rights
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