import { loginUserSchema, type LoginUserDTO } from "../dtos/auth/Login.dto";
import {
  registerUserSchema,
  type RegisterUserDTO,
} from "../dtos/auth/Register.dto";
import { ConflictError } from "../errors/conflictError";
import { UserModel } from "../models/user/UserModel";

import bcrypt from "bcryptjs";
import { genToken } from "../utils/jwt";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { NotFoundError } from "../errors/notFoundError";

export class AuthService {
  constructor() {}
  private userModel = new UserModel();

  async login(data: LoginUserDTO) {
    const { email, password } = loginUserSchema.parse(data);

    const user = await this.userModel.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError();
    }

    const token = genToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }

  async register(data: RegisterUserDTO) {
    const validData = registerUserSchema.parse(data);

    const user = await this.userModel.getUserByEmail(validData.email);

    if (user) {
      throw new ConflictError("Usuário já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(validData.password, 10);

    const newUser = await this.userModel.createNewUser({
      name: validData.name,
      username: validData.username,
      email: validData.email,
      password: hashedPassword,
    });

    const userCreated = await this.userModel.getUserById(newUser[0].insertId);

    const token = genToken({
      userId: userCreated.id,
      email: userCreated.email,
    });

    return {
      user: {
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
        username: userCreated.username,
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
      },
      token,
    };
  }

  async getNewToken(id: number) {
    const user = await this.userModel.getUserById(id);

    if (!user) {
      throw new NotFoundError();
    }

    const token = genToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }
}
