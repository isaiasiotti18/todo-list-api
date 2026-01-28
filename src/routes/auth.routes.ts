import { Router, type Request, type Response } from "express";
import { authUser } from "../middlewares/auth/authUser";
import { AuthController } from "../controllers/AuthController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.AUTH;

const authRoutes = Router();

const makeAuthController = () => {
  return new AuthController();
};

const authController = makeAuthController();

authRoutes.post(`${BASE_PATH}/login`, async (req: Request, res: Response) => {
  await authController.login(req, res);
});

authRoutes.post(
  `${BASE_PATH}/register`,
  async (req: Request, res: Response) => {
    await authController.register(req, res);
  },
);

authRoutes.get(`${BASE_PATH}/token/:idUser`, async (req, res) => {
  await authController.getNewToken(req, res);
});

// authRoutes.post(`${BASE_PATH}/logout`, authUser, async (req, res) => {
//   await authController.logout(req, res);
// });

export default authRoutes;
