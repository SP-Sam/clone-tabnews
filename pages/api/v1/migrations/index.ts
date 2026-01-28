import { NextApiRequest, NextApiResponse } from "next";
import { runner, RunnerOption } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request: NextApiRequest, response: NextApiResponse) {
  const dbClient = await database.getNewClient();

  console.log("dbClient instanciado");

  const defaultMigrationOptions: RunnerOption = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
  };

  console.log("migrationOptions criada");

  if (request.method === "GET") {
    console.log("Rodando migrations no modo dryRun");

    const pendingMigrations = await runner({
      ...defaultMigrationOptions,
      dryRun: true,
    });

    console.log(`Migrations pendentes: ${pendingMigrations}`);

    dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const executedMigrations = await runner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    dbClient.end();

    if (executedMigrations.length > 0) {
      return response.status(201).json(executedMigrations);
    }

    return response.status(200).json(executedMigrations);
  }

  return response.status(405).end();
}

export default migrations;
