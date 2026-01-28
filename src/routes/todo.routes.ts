import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { TodoController } from "../controllers/TodoController";
import { authUser } from "../middlewares/auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.TODO;

const todoRoutes = Router();

export const makeTodoController = () => {
  return new TodoController();
};

const todoController = makeTodoController();

todoRoutes.post(`${BASE_PATH}/create`, authUser, async (req, res) => {
  await todoController.createNewTodo(req, res);
});

todoRoutes.get(`${BASE_PATH}/get`, authUser, async (req, res) => {
  await todoController.getAllTodos(req, res);
});

todoRoutes.get(`${BASE_PATH}/get/:todoId`, authUser, async (req, res) => {
  await todoController.getTodoById(req, res);
});

todoRoutes.put(`${BASE_PATH}/update/:todoId`, authUser, async (req, res) => {
  await todoController.updateTodoById(req, res);
});

todoRoutes.delete(`${BASE_PATH}/delete/:todoId`, authUser, async (req, res) => {
  await todoController.softDeleteTodoById(req, res);
});

export default todoRoutes;
