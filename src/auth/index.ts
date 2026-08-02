import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";

const isDev = process.env.NEXTJS_ENV === "development";

function getBaseURL() {
  // Prefer explicit BETTER_AUTH_URL, but auto-detect from Vercel deployment if missing
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function authBuilder() {
  const dbInstance = await getDb();

  const baseURL = getBaseURL();
  const secret = process.env.BETTER_AUTH_SECRET || "";
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const trustedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || "https://resum-mu.vercel.app",
    "https://resum.vercel.app",
    "http://localhost:3000",
  ];

  // Add any custom domain
  if (process.env.CUSTOM_DOMAIN) {
    trustedOrigins.push(`https://${process.env.CUSTOM_DOMAIN}`);
  }

  return betterAuth({
    baseURL,
    secret,
    trustedOrigins,
    socialProviders: {
      google: {
        clientId: googleClientId!,
        clientSecret: googleClientSecret!,
      },
    },
    emailAndPassword: {
      enabled: true,
      sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string; token: string }) => {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          to: user.email,
          subject: "Verify your Resum account",
          html: `<p>Welcome to Resum!</p><p>Click the link below to verify your account:</p><p><a href="${url}">Verify Email</a></p><p>If you didn't create an account, you can safely ignore this email.</p>`,
        });
      },
      changePassword: {
        enabled: true,
      },
      forgotPassword: {
        enabled: true,
        sendResetEmail: async ({ user, url }: { user: { email: string }; url: string; token: string }) => {
          const { sendEmail } = await import("@/lib/email");
          await sendEmail({
            to: user.email,
            subject: "Reset your Resum password",
            html: `<p>You requested a password reset.</p><p>Click the link below to set a new password:</p><p><a href="${url}">Reset Password</a></p><p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`,
          });
        },
      },
    },
    database: drizzleAdapter(dbInstance, {
      provider: "sqlite",
      usePlural: true,
    }),
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
  });
}

let authInstance: Awaited<ReturnType<typeof authBuilder>> | null = null;

export async function initAuth() {
  if (!authInstance) {
    authInstance = await authBuilder();
  }
  return authInstance;
}

// Simplified config for Better Auth CLI schema generation
export const auth = betterAuth({
  database: drizzleAdapter(process.env.DATABASE as any, {
    provider: "sqlite",
    usePlural: true,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
