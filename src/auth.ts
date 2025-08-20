import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;
  const payload = {
    iss: "chirpy",
    sub: userID,
    iat,
    exp,
  };
  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret) as JwtPayload;
    if (!decoded.sub) {
      throw new Error("No subject in token");
    }
    return decoded.sub as string;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
