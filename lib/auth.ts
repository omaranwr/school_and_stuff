import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./auth-schema";
import Database from "better-sqlite3";

const db = drizzle(new Database("database.sqlite"), { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  baseURL: process.env.BASR_URL || "http://localhost:3000/",
  emailAndPassword: { enabled: true },
});
