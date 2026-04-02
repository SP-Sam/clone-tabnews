import { Client } from "pg";
import { runner, RunnerOption } from "node-pg-migrate";
import { join } from "node:path";

import database from "infra/database";

let dbClient: Client;

const defaultMigrationOptions: RunnerOption = {
  dbClient: dbClient,
  dir: join(process.cwd(), "infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: true,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  try {
    dbClient = await database.getNewClient();

    const executedMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return executedMigrations;
  } finally {
    await dbClient?.end();
  }
}

export default { listPendingMigrations, runPendingMigrations };
