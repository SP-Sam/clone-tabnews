import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../infra/database";

async function status(_request: NextApiRequest, response: NextApiResponse) {
  const result = await database.query("SELECT 2 + 2 as sum;");

  console.log(result.rows);

  response.status(200).json({ message: "O servidor está de pé!" });
}

export default status;
