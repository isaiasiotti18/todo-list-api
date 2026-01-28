import type { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";
import type { UserResponseWithoutPassword } from "../types/UserResponseWithoutPassword";

export class UserController {
  constructor() {}

  private userService = new UserService();

  async getAllUsers(req: Request, res: Response) {
    const { page, pageSize, orderBy, filter } = req.query;

    const result = await this.userService.getAllUsers({
      page: Number(page),
      pageSize: Number(pageSize),
      orderBy: orderBy === "asc" ? "asc" : "desc",
      filter: filter as string,
    });

    return res.status(STATUS_CODE.OK).json(result);
  }

  async getUserById(req: Request, res: Response) {
    const { userId } = req.params;
    const result = await this.userService.getUserById(Number(userId));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async getSelf(req: Request, res: Response) {
    const user = req.user as UserResponseWithoutPassword;

    const result = await this.userService.getUserById(user.id);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async createNewUser(req: Request, res: Response) {
    const result = await this.userService.createNewUser(req.body);

    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async softDeleteUserById(req: Request, res: Response) {
    const { userId } = req.params;
    const result = await this.userService.softDeleteUserById(Number(userId));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async updateUser(req: Request, res: Response) {
    const userId = req.user?.id;
    const { body } = req;

    const result = await this.userService.updateUser(Number(userId), body);

    return res.status(STATUS_CODE.OK).json(result);
  }
}
