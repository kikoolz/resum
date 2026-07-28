import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";

const isDev = process.env.NEXTJS_ENV === "development";

async function authBuilder() {
  const dbInstance = await getDb();

  const baseURL =
    process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const secret = process.env.BETTER_AUTH_SECRET || "";
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  return betterAuth({
    baseURL,
    secret,
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
