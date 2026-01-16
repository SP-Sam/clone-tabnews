import { NextApiRequest, NextApiResponse } from "next";

function status(_request: NextApiRequest, response: NextApiResponse) {
  response.status(200).json({ message: "O servidor está de pé!" });
}

export default status;
