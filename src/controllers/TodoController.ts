import type { Request, Response } from "express";
import { STATUS_CODE } from "../constants/statusCode";
import { TodoService } from "../services/TodoService";
import type { FilterAndPaginationTodo } from "../types/FilterAndPagination";

export class TodoController {
  constructor() {}

  private todoService = new TodoService();

  async createNewTodo(req: Request, res: Response) {
    const result = await this.todoService.createNewTodo(req.body);

    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async getAllTodos(req: Request, res: Response) {
    const filters: FilterAndPaginationTodo = {
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      orderBy: (req.query.orderBy as "asc" | "desc") || undefined,
      filter: (req.query.filter as string) || "",
      categoryId: req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined,
    };

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
    const { todoId } = req.params;
    const { body } = req;

    const result = await this.todoService.updateTodoById(Number(todoId), body);

    return res.status(STATUS_CODE.OK).json(result);
  }

  async softDeleteTodoById(req: Request, res: Response) {
    const { todoId } = req.params;
    const result = await this.todoService.softDeleteTodoById(Number(todoId));
    return res.status(STATUS_CODE.OK).json(result);
  }
}
