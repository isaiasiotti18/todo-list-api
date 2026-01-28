import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/erroHandler";

const app = express();

app.use(morgan("tiny"));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorHandler);

export default app;
