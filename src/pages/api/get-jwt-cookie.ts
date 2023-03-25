import { withSessionRoute } from "@/helpers/withSession";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
  interface IronSessionData {
    jwt?: string;
  }
}

async function getJwtCookie(req: NextApiRequest, res: NextApiResponse) {
  try {
    const getJwt = req.session.jwt;
    return res.status(200).send({ success: true, jwt: getJwt });
  } catch {
    return res.status(500).send({
      success: false,
      error: { message: "Gagal mendapatkan jwt, silahkan coba lagi" },
    });
  }
}

export default withSessionRoute(getJwtCookie);
