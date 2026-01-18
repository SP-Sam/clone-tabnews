import { Client } from "pg";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
} = process.env;

async function query(queryObject: string) {
  const client = new Client({
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
  });

  await client.connect();

  const result = await client.query(queryObject);

  await client.end();

  return result;
}

export default {
  query: query,
};
