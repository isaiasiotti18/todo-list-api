import type { Response } from "express";
import { UserService } from "../services/UserService";
import type { UserRequest } from "../types/UserRequest";
import { STATUS_CODE } from "../constants/statusCode";

export class UserController {
  constructor() {}

  private userService = new UserService();

  async getAllUsers(req: UserRequest, res: Response) {
    const result = await this.userService.getAllUsers();
    return res.status(STATUS_CODE.OK).json(result);
  }

  async getUserById(req: UserRequest, res: Response) {
    const { userId } = req.params;
    const result = await this.userService.getUserById(Number(userId));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async createNewUser(req: UserRequest, res: Response) {
    const { body } = req;
    const result = await this.userService.createNewUser(body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async softDeleteUserById(req: UserRequest, res: Response) {
    const { userId } = req.params;
    const result = await this.userService.softDeleteUserById(Number(userId));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async updateUserById(req: UserRequest, res: Response) {
    const { userId } = req.params;
    const { body } = req;

    const result = await this.userService.updateUserById(Number(userId), body);

    return res.status(STATUS_CODE.OK).json(result);
  }
}
