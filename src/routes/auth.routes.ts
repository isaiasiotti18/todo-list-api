import { Router, type Request, type Response } from "express";
import { authUser } from "../middlewares/auth/authUser";
import { AuthController } from "../controllers/AuthController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import rateLimit from "express-rate-limit";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.AUTH;

const authRoutes = Router();

// Rate Limiting mais restritivo para rotas de autenticação
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // apenas 5 tentativas
  message: "Muitas tentativas de login, tente novamente mais tarde",
  skipSuccessfulRequests: true, // não conta requisições bem-sucedidas
});

authRoutes.use(authLimiter);

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
