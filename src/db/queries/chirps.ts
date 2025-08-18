import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [rows] = await db.insert(chirps).values(chirp).returning();
  return rows;
}

export async function getAllChirps() {
  const rows = await db.select().from(chirps).orderBy(asc(chirps.createdAt));

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    userId: row.userId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getChirpById(id: string) {
  const [row] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id))
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    body: row.body,
    userId: row.userId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
