import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { runner, RunnerOption } from "node-pg-migrate";
import { Client } from "pg";
import { join } from "node:path";

import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

let dbClient: Client;

const defaultMigrationOptions: RunnerOption = {
  dbClient: dbClient,
  dir: join(process.cwd(), "infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
};

async function getHandler(_request: NextApiRequest, response: NextApiResponse) {
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: true,
    });

    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(_request: NextApiRequest, response: NextApiResponse) {
  try {
    dbClient = await database.getNewClient();

    const executedMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (executedMigrations.length > 0) {
      return response.status(201).json(executedMigrations);
    }

    return response.status(200).json(executedMigrations);
  } finally {
    await dbClient.end();
  }
}
