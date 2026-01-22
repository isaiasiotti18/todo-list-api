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
import type { User } from "../types/User";
import { NotFoundError } from "../errors/notFoundError";
import { UnauthorizedError } from "../errors/unauthorizedError";

export class UserService {
  constructor() {}
  private userModel = new UserModel();

  async getAllUsers() {
    return await this.userModel.getAllUsers();
  }

  async getUserById(id: number) {
    if (!id) {
      throw new Error("Id não informado");
    }

    const user = await this.userModel.getUserById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user[0];
  }

  async createNewUser(data: CreateNewUserDTO) {
    if (!data) {
      throw new Error("Dados não informados");
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

  async updateUser(userId: number, data: UpdateUserDTO) {
    const user = await this.userModel.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");

    const payload = updateUserSchema.parse(data);

    if (payload.password) {
      const valid = await bcryptjs.compare(
        payload.currentPassword!,
        user[0].password,
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

    const result = await this.userModel.softDeleteUserById(id);

    if (!result) {
      throw new Error("Erro ao deletar usuário");
    }

    return;
  }
}
