import type { CreateNewUserDTO } from "../dtos/CreateNewUser.dto";
import { UserModel } from "../models/UserModel";

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

    return user;
  }

  async createNewUser(data: CreateNewUserDTO) {
    if (!data) {
      throw new Error("Dados não informados");
    }

    const result = await this.userModel.createNewUser(data);

    if (!result) {
      throw new Error("Erro ao criar usuário");
    }

    return;
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
