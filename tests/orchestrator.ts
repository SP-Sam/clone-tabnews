import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database";
import user, { UserDTO } from "models/user";

async function waitFowAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, { retries: 100, maxTimeout: 1000 });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Nao foi possível executar as migrations pendentes.");
  }
}

async function createUser(userObject: UserDTO): Promise<UserDTO> {
  return await user.create({
    username: userObject.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validpassword",
  });
}

export default {
  waitFowAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};
