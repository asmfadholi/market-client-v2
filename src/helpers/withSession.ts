import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const sessionOptions = {
  password: process.env.COOKIE_PASSWORD || "",
  cookieName: process.env.COOKIE_NAME || "",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}
