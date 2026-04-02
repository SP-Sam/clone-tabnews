import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import controller from "infra/controller";
import migrator from "models/migrator";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_request: NextApiRequest, response: NextApiResponse) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return response.status(200).json(pendingMigrations);
}

async function postHandler(_request: NextApiRequest, response: NextApiResponse) {
  const executedMigrations = await migrator.runPendingMigrations();

  if (executedMigrations.length > 0) {
    return response.status(201).json(executedMigrations);
  }

  return response.status(200).json(executedMigrations);
}
