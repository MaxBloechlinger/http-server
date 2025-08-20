import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";

describe("JWT", () => {
  it("should create and validate a token", () => {
    const secret = "shh";
    const token = makeJWT("user123", 60, secret);
    const userId = validateJWT(token, secret);
    expect(userId).toBe("user123");
  });
});

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
  it("should return false for the wrong password", async () => {
    const result = await checkPasswordHash("wrongPassword", hash1);
    expect(result).toBe(false);
  });
});

describe("Expired Token", () => {
  it("should throw for an expired token", () => {
    const secret = "shh";
    // Expiration time is 0 seconds, so it's expired immediately
    const token = makeJWT("user123", 0, secret);
    expect(() => validateJWT(token, secret)).toThrow();
  });
});

describe("Token with wrong secret", () => {
  it("should throw for a token signed with the wrong secret", () => {
    const token = makeJWT("user123", 60, "correct_secret");
    // Try validating with a different secret
    expect(() => validateJWT(token, "wrong_secret")).toThrow();
  });
});
