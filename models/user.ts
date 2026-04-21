import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

async function create(userInputValues: CreateUserDTO) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email: string) {
    const result = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username: string) {
    const result = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery(userInputValues: CreateUserDTO) {
    const result = await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [userInputValues.username, userInputValues.email, userInputValues.password],
    });

    return result.rows[0];
  }
}

async function findOneByUsername(username: string) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username: string) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT 1
        ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username digitado está correto",
      });
    }

    return result.rows[0];
  }
}

export default {
  create,
  findOneByUsername,
};
