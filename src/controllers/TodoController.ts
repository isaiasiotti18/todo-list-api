import type { Request, Response } from "express";
import { STATUS_CODE } from "../constants/statusCode";
import { getTodosQuerySchema } from "../dtos/todo/GetTodosQuery.dto";
import { TodoService } from "../services/TodoService";

export class TodoController {
  constructor() {}

  private todoService = new TodoService();

  async createNewTodo(req: Request, res: Response) {
    const user = req.user;
    const userId = user?.id;

    console.log("User ID from request:", userId);
    const result = await this.todoService.createNewTodo({
      ...req.body,
      userId,
    });

    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async getAllTodos(req: Request, res: Response) {
    const parseResult = getTodosQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: "Parâmetros de consulta inválidos",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const filters = parseResult.data;
    const user = req.user;
    const userId = user?.id;

    const result = await this.todoService.getAllTodosByUserId(
      Number(userId),
      filters,
    );

    return res.status(STATUS_CODE.OK).json(result);
  }

  async getTodoById(req: Request, res: Response) {
    const result = await this.todoService.getTodoById(
      Number(req.params.todoId),
    );

    return res.status(STATUS_CODE.OK).json(result);
  }

  async updateTodoById(req: Request, res: Response) {
    const user = req.user;
    const userId = user?.id;

    const { todoId } = req.params;
    const { body } = req;

    const result = await this.todoService.updateTodoById(Number(todoId), {
      ...body,
      userId: Number(userId),
    });

    return res.status(STATUS_CODE.OK).json(result);
  }

  async softDeleteTodoById(req: Request, res: Response) {
    const { todoId } = req.params;
    const result = await this.todoService.softDeleteTodoById(Number(todoId));
    return res.status(STATUS_CODE.OK).json(result);
  }
}
