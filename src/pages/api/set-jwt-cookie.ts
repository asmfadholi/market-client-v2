import { withSessionRoute } from "@/helpers/withSession";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
  interface IronSessionData {
    jwt?: string;
  }
}

async function SetJwtCookie(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bodyData = req.body;
    req.session.jwt = bodyData.jwt;
    await req.session.save();
    return res.status(200).send({ success: true, message: "Login berhasil" });
  } catch {
    return res.status(500).send({
      success: false,
      error: { message: "Login gagal, silahkan coba kembali!" },
    });
  }
}

export default withSessionRoute(SetJwtCookie);
