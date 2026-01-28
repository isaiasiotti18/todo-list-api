import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { STATUS_CODE } from "../constants/statusCode";

export class AuthController {
  constructor() {}

  private authService = new AuthService();

  async login(req: Request, res: Response) {
    const result = await this.authService.login(req.body);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async register(req: Request, res: Response) {
    const result = await this.authService.register(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  // async logout(req: Request, res: Response) {

  // }

  async getNewToken(req: Request, res: Response) {
    const { userId } = req.params;

    const result = await this.authService.getNewToken(Number(userId));

    return res.status(STATUS_CODE.OK).json(result);
  }
}
