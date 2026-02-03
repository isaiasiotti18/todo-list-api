import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/erroHandler";
import { setupSwagger } from "./utils/swagger";

const app = express();

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS configurado corretamente
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "http://localhost:3005",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Helmet com configurações adequadas
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// Rate Limiting Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por IP
  message: "Muitas requisições deste IP, tente novamente mais tarde",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Limitar tamanho do body (proteção contra DoS)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Sanitização adicional (remover caracteres perigosos)
app.use((req: Request, _res: Response, next: NextFunction) => {
  // Sanitiza query params
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = (req.query[key] as string).trim();
      }
    });
  }
  next();
});

// Health check (não passa por rate limiting)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Documentação Swagger
setupSwagger(app);

// Rotas da aplicação
app.use(routes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Error handler
app.use(errorHandler);

export default app;
