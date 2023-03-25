import { withSessionRoute } from "@/helpers/withSession";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
  interface IronSessionData {
    jwt?: string;
  }
}

async function authAccount(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bodyData = req.body;
    req.session.jwt = bodyData.jwt;
    await req.session.save();
    return res.status(200).send({ success: true });
  } catch {
    return res.status(200).send({ success: false });
  }
}

export default withSessionRoute(authAccount);
