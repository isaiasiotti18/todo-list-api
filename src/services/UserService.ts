import {
  createNewUserSchema,
  type CreateNewUserDTO,
} from "../dtos/users/CreateNewUser.dto";
import {
  updateUserSchema,
  type UpdateUserDTO,
} from "../dtos/users/UpdateUser.dto";
import { UserModel } from "../models/UserModel";
import bcryptjs from "bcryptjs";
import { NotFoundError } from "../errors/notFoundError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import type { FilterAndPagination } from "../types/FilterAndPagination";
import { AppError } from "../errors/appError";
import { ConflictError } from "../errors/conflictError";
import type { UserResponseWithoutPassword } from "../types/UserResponseWithoutPassword";

export class UserService {
  constructor() {}
  private userModel = new UserModel();

  async createNewUser(data: CreateNewUserDTO) {
    if (!data) {
      throw new NotFoundError("Dados não informados");
    }

    const userExists = await this.userModel.getUserByEmail(data.email);

    if (userExists) {
      throw new ConflictError("Usuário já cadastrado");
    }

    const validData = createNewUserSchema.parse(data);

    const hashedPassword = await bcryptjs.hash(validData.password, 10);

    const result = await this.userModel.createNewUser({
      ...validData,
      password: hashedPassword,
    });

    if (!result) {
      throw new Error("Erro ao criar usuário");
    }

    return;
  }

  async getAllUsers({ page, pageSize, orderBy, filter }: FilterAndPagination) {
    return await this.userModel.getAllUsers({
      page,
      pageSize,
      orderBy,
      filter,
    });
  }

  async getUserById(id: number): Promise<UserResponseWithoutPassword> {
    if (!id) {
      throw new Error("Id não informado");
    }

    const user = await this.userModel.getUserById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUser(userId: number, data: UpdateUserDTO) {
    const user = await this.userModel.getUserById(userId);

    if (!user) throw new NotFoundError("User not found");

    const payload = updateUserSchema.parse(data);

    if (payload.password) {
      const valid = await bcryptjs.compare(
        payload.currentPassword!,
        user.password,
      );

      if (!valid) {
        throw new UnauthorizedError("Invalid current password");
      }

      payload.password = await bcryptjs.hash(payload.password, 10);
      delete payload.currentPassword;
    }

    await this.userModel.updateUser(userId, payload);
  }

  async softDeleteUserById(id: number) {
    if (!id) {
      throw new Error("Id não informado");
    }

    const result = await this.userModel.softDeleteUser(id);

    if (!result) {
      throw new Error("Erro ao deletar usuário");
    }

    return;
  }
}
