import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { routes } from "./routes";

const app = express();

app.use(morgan("tiny"));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(helmet());

app.use(routes);

app.use(express.json());

export default app;
