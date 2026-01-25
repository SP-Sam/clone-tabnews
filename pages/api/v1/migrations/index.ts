import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request: NextApiRequest, response: NextApiResponse) {
  const dbClient = await database.getNewClient();

  console.log("dbClient instanciado");

  // Em produção, usar migrations compiladas; em dev, usar infra/migrations
  const migrationsDir =
    process.env.NODE_ENV === "production"
      ? join(process.cwd(), ".next", "migrations")
      : join("infra", "migrations");

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: migrationsDir,
    direction: "up",
    migrationsTable: "pgmigrations",
  } as RunnerOption;

  console.log("migrationOptions criada");

  if (request.method === "GET") {
    console.log("Rodando migrations no modo dryRun");

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: true,
    });

    console.log(`Migrations pendentes: ${pendingMigrations}`);

    dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const executedMigrations = await migrationRunner({
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
