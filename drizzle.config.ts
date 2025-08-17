import { defineConfig } from "drizzle-kit";
import type { MigrationConfig } from "drizzle-orm/migrator";
import { config } from "./src/config";
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};
