import { Client, QueryConfig } from "pg";

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD } =
  process.env;

async function query(queryObject: string | QueryConfig) {
  let client: Client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error("Database error: ", error);

    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();

  return client;
}

export default {
  query,
  getNewClient,
};
