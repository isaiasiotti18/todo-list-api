import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "./appError";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, STATUS_CODE.NOT_FOUND);
  }
}
