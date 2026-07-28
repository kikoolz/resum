import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function getDb() {
  if (!dbInstance) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}
