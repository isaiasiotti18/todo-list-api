import { Router } from "express";
import todoRoutes from "./todo.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

export const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(todoRoutes);
