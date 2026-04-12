import { Client } from "pg";
import { runner, type RunnerOption } from "node-pg-migrate";
import { join } from "node:path";

import database from "infra/database";

function createMigrationOptions(dbClient: Client): RunnerOption {
  return {
    dbClient,
    dir: join(process.cwd(), "infra", "migrations"),
    direction: "up",
    log: () => {},
    migrationsTable: "pgmigrations",
  };
}

async function listPendingMigrations() {
  let dbClient: Client;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...createMigrationOptions(dbClient),
      dryRun: true,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient: Client;

  try {
    dbClient = await database.getNewClient();

    const executedMigrations = await runner({
      ...createMigrationOptions(dbClient),
      dryRun: false,
    });

    return executedMigrations;
  } finally {
    await dbClient?.end();
  }
}

export default { listPendingMigrations, runPendingMigrations };
