import { NextApiRequest, NextApiResponse } from "next";
import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(_request: NextApiRequest, response: NextApiResponse) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseMaxConnectionsResult = await database.query("SHOW max_connections;");
    const databaseMaxConnections = databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT COUNT(datid)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const databaseOpenedConnections = databaseOpenedConnectionsResult.rows[0].count;

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersion = databaseVersionResult.rows[0].server_version;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          max_connections: parseInt(databaseMaxConnections),
          opened_connections: databaseOpenedConnections,
          version: databaseVersion,
        },
      },
    });
  } catch (error) {
    console.log("Error on api/v1/status: ");

    const errorObject = new InternalServerError({ cause: error });

    console.log(errorObject);

    response.status(500).json(errorObject);
  }
}

export default status;
