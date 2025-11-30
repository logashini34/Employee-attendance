import { ApiMessage } from "./apiMessages";

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(apiMessage: ApiMessage) {
    super(apiMessage.message);
    this.statusCode = apiMessage.statusCode;
    this.code = apiMessage.code;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
