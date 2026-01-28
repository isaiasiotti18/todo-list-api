import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { UserController } from "../controllers/UserController";
import { authUser } from "../middlewares/auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER;

const userRoutes = Router();

export const makeUserController = () => {
  return new UserController();
};

const userController = makeUserController();

userRoutes.post(`${BASE_PATH}/create`, async (req, res) => {
  await userController.createNewUser(req, res);
});

userRoutes.get(`${BASE_PATH}/get`, async (req, res) => {
  await userController.getAllUsers(req, res);
});

userRoutes.get(`${BASE_PATH}/get/self`, authUser, async (req, res) => {
  await userController.getSelf(req, res);
});

userRoutes.put(`${BASE_PATH}/update`, authUser, async (req, res) => {
  await userController.updateUser(req, res);
});

userRoutes.delete(`${BASE_PATH}/delete/:userId`, authUser, async (req, res) => {
  await userController.softDeleteUserById(req, res);
});

userRoutes.get(`${BASE_PATH}/get/:userId`, authUser, async (req, res) => {
  userController.getUserById(req, res);
});

export default userRoutes;
