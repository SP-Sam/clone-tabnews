import { Client, QueryConfig } from "pg";

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD } =
  process.env;

async function query(queryObject: string | QueryConfig) {
  const client = new Client({
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
  });

  await client.connect();

  try {
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error("Database error: ", error);
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
