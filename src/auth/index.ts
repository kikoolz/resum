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
    "https://resum-mu.vercel.app",
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
