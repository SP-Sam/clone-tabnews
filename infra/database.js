import { Client } from "pg";
import fs from "fs";

const query = async (queryObject) => {
  const caCertificate = fs.readFileSync("certificates/ca.pem").toString();

  console.log("CA Certificate: ", caCertificate);

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" && {
      rejectUnauthorized: true,
      ca: caCertificate,
    },
  });

  console.log("DB Credentials: ", {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();

    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};

export default {
  query: query,
};
