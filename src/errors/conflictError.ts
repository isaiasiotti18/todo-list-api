import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "./appError";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODE.CONFLICT);
  }
}
