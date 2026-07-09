import { NotFoundError, UnauthorizedError } from "infra/errors";
import password from "./password";
import user from "./user";

async function getAuthenticatedUser(providedEmail: string, providedPassword: string) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }
}

async function findUserByEmail(providedEmail: string) {
  try {
    const storedUser = await user.findOneByEmail(providedEmail);

    return storedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Email não confere.",
        action: "Verifique se este dado está correto.",
      });
    }

    throw error;
  }
}

async function validatePassword(providedPassword: string, storedPassword: string) {
  const isPasswordCorrect = await password.compare(providedPassword, storedPassword);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se este dado está correto.",
    });
  }
}

export default { getAuthenticatedUser };
