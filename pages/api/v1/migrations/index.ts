import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request: NextApiRequest, response: NextApiResponse) {
  const dbClient = await database.getNewClient();

  // Usa pasta compilada em produção, .ts local
  const isProd = process.env.NODE_ENV === "production";
  const migrationsDir = isProd
    ? join("infra", "migrations-js")
    : join("infra", "migrations");

  const defaultMigrationOptions: RunnerOption = {
    dbClient: dbClient,
    dir: migrationsDir,
    direction: "up",
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: true,
    });

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
