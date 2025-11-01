import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "../db/schema"

config({ path: ".env" }); // or .env.local
if (!process.env.DATABASE_URL) {
    throw new Error("Database string is missing")
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
