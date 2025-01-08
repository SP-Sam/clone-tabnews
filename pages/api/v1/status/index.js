import database from "infra/database.js";

const status = async (request, response) => {
  const result = await database.query("SELECT 1 + 1 as sum;");

  response.status(200).json({ message: "API em funcionamento!" });
};

export default status;
