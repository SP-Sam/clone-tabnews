import { NextApiRequest, NextApiResponse } from "next";
import { runner, RunnerOption } from "node-pg-migrate";
import { Client } from "pg";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request: NextApiRequest, response: NextApiResponse) {
  const allowedMethods = ["GET", "POST"];
  const requestMethod = request.method;

  if (!allowedMethods.includes(requestMethod)) {
    return response.status(405).json({
      status: "ERROR",
      message: `Method ${requestMethod} not allowed`,
    });
  }

  let dbClient: Client;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions: RunnerOption = {
      dbClient: dbClient,
      dir: join(process.cwd(), "infra", "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
    };

    if (requestMethod === "GET") {
      const pendingMigrations = await runner({
        ...defaultMigrationOptions,
        dryRun: true,
      });

      return response.status(200).json(pendingMigrations);
    }

    if (requestMethod === "POST") {
      const executedMigrations = await runner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (executedMigrations.length > 0) {
        return response.status(201).json(executedMigrations);
      }

      return response.status(200).json(executedMigrations);
    }
  } catch (error) {
    console.error("Error running migrations: ", error);

    throw error;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
