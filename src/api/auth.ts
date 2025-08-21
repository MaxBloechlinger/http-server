import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserNotAuthenticatedError } from "./errors.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";

import { makeJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
    expiresInSeconds?: number;
  };

  const params: parameters = req.body;

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UserNotAuthenticatedError("invalid username or password");
  }

  const matching = await checkPasswordHash(
    params.password,
    user.hashedPassword
  );
  if (!matching) {
    throw new UserNotAuthenticatedError("invalid username or password");
  }

  const maxExpiration = config.jwt.defaultDuration;
  let expirationTime = maxExpiration;

  if (params.expiresInSeconds) {
    expirationTime = Math.min(params.expiresInSeconds, maxExpiration);
  }
  const token = makeJWT(user.id, expirationTime, config.jwt.secret);

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: token,
  } satisfies UserResponse & { token: string });
}
