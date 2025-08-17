import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";
import { error } from "console";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw error;
  }

  const words = params.body.split(" ");
  const bad = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    if (bad.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }
  const clean = words.join(" ");
  respondWithJSON(res, 200, {
    cleanedBody: clean,
  });
}
