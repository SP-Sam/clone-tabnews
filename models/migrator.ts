import { Client } from "pg";
import type { RunnerOption } from "node-pg-migrate";
import { join } from "node:path";

import database from "infra/database";

// import dinâmico indireto para o Jest conseguir carregar um pacote ESM.
const importModule = new Function("moduleName", "return import(moduleName);") as (
  moduleName: string,
) => Promise<typeof import("node-pg-migrate")>;

async function getRunner() {
  const migrationModule = await importModule("node-pg-migrate");

  return migrationModule.runner;
}

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
    const runner = await getRunner();

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
    const runner = await getRunner();

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
