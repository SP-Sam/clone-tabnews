import database from "infra/database.js";

const status = async (request, response) => {
  const updateAt = new Date().toISOString();

  const dbVersionQuery = await database.query("SHOW server_version;");
  const dbVersion = dbVersionQuery.rows[0].server_version;

  const dbMaxConnectionsQuery = await database.query("SHOW max_connections;");
  const dbMaxConnections = dbMaxConnectionsQuery.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;

  const dbOpenedConnectionsQuery = await database.query({
    text: `SELECT COUNT(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;`,
    values: [dbName],
  });

  const dbOpenedConnections =
    dbOpenedConnectionsQuery.rows[0].opened_connections;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: parseInt(dbMaxConnections),
        opened_connections: dbOpenedConnections,
      },
    },
  });
};

export default status;
