import { NextApiRequest, NextApiResponse } from "next";
import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  ValidationError,
} from "./errors";

function onNoMatchHandler(_request: NextApiRequest, response: NextApiResponse) {
  const errorObject = new MethodNotAllowedError();

  response.status(errorObject.statusCode).json(errorObject);
}

function onErrorHandler(error, _request: NextApiRequest, response: NextApiResponse) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const errorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(errorObject);

  response.status(errorObject.statusCode).json(errorObject);
}

export default {
  errorHandlers: { onNoMatch: onNoMatchHandler, onError: onErrorHandler },
};
