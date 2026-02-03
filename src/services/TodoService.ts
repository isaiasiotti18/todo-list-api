import {
  createNewTodoSchema,
  type CreateNewTodoDTO,
} from "../dtos/todo/CreateNewTodo.dto";
import {
  updateTodoSchema,
  type UpdateTodoDTO,
} from "../dtos/todo/UpdateTodo.dto";
import { ConflictError } from "../errors/conflictError";
import { NotFoundError } from "../errors/notFoundError";
import { TodoModel } from "../models/todo/TodoModel";
import type { FilterAndPaginationTodo } from "../types/FilterAndPagination";

export class TodoService {
  constructor() {}

  private todoModel = new TodoModel();

  async createNewTodo(data: CreateNewTodoDTO) {
    if (!data) {
      throw new NotFoundError("Dados não informados");
    }

    const validData = createNewTodoSchema.parse(data);

    const result = await this.todoModel.createNewTodo(validData);

    if (!result) {
      throw new ConflictError("Erro ao criar todo");
    }

    return await this.todoModel.getTodoById(result[0].insertId);
  }

  async updateTodoById(id: number, data: UpdateTodoDTO) {
    const todo = await this.todoModel.getTodoById(id);

    if (!todo) {
      throw new NotFoundError("Todo não encontrado");
    }

    const payload = updateTodoSchema.parse(data);

    await this.todoModel.updateTodoById(id, payload);
  }

  async getTodoById(id: number) {
    const todo = await this.todoModel.getTodoById(id);

    if (!todo) {
      throw new NotFoundError("Todo não encontrado");
    }

    return todo;
  }

  async getAllTodosByUserId(
    userId: number,
    {
      page,
      pageSize,
      orderBy,
      filter,
      categoryId,
      status,
    }: FilterAndPaginationTodo,
  ) {
    const todos = await this.todoModel.getAllTodosByUserId(userId, {
      page,
      pageSize,
      orderBy,
      filter,
      categoryId,
      status,
    });

    return todos;
  }

  async softDeleteTodoById(id: number) {
    const todo = await this.todoModel.getTodoById(id);

    if (!todo) {
      throw new NotFoundError("Todo não encontrado");
    }

    if (todo[0].deletedAt !== null) {
      throw new ConflictError("Todo ja deletado");
    }

    const result = await this.todoModel.softDeleteTodoById(id);

    if (!result) {
      throw new ConflictError("Erro ao deletar todo");
    }

    return;
  }
}
