import { withSessionRoute } from "@/helpers/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function logoutAccount(req: NextApiRequest, res: NextApiResponse) {
  try {
    await req.session.destroy();
    return res.status(200).send({ success: true, message: "Logout berhasil" });
  } catch {
    return res.status(200).send({
      success: false,
      error: { message: "Logout gagal, silahkan coba kembali!" },
    });
  }
}

export default withSessionRoute(logoutAccount);
