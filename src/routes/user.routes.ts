import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { UserController } from "../controllers/UserController";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER;

const userRoutes = Router();

export const makeUserController = () => {
  return new UserController();
};

const userController = makeUserController();

userRoutes.get(`${BASE_PATH}/get`, async (req, res) => {
  await userController.getAllUsers(req, res);
});

userRoutes.post(`${BASE_PATH}/create`, (req, res) => {
  res.send("user created");
});

userRoutes.put(`${BASE_PATH}/update`, (req, res) => {
  res.send("user updated");
});

userRoutes.delete(`${BASE_PATH}/delete`, (req, res) => {
  res.send("user deleted");
});

userRoutes.get(`${BASE_PATH}/get/:userId`, (req, res) => {
  userController.getUserById(req, res);
});

export default userRoutes;
