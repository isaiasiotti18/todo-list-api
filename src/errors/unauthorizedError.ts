import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "./appError";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, STATUS_CODE.UNAUTHORIZED);
  }
}
