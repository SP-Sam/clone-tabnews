import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";

import controller from "infra/controller";
import auth from "models/auth";
import session from "models/session";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userInputValues = request.body;

  const authenticatedUser = await auth.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  const setCookie = cookie.stringifySetCookie({
    name: "session_id",
    value: newSession.token,
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV == "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);

  return response.status(201).json(newSession);
}
