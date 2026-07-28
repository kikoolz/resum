import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: ["./src/db/schema.ts", "./src/db/auth.schema.ts"],
    dialect: "sqlite",
    dbCredentials: {
        url: `${process.env.TURSO_DATABASE_URL}?authToken=${process.env.TURSO_AUTH_TOKEN}`,
    },
});
