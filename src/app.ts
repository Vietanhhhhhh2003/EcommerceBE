import express from "express";
import { healthRoutes } from "./modules/health/health.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";
import { notFoundMiddleware } from "./common/middlewares/not-found.middleware";
import { requestLoggerMiddleware } from "./common/middlewares/request-logger.middleware";

export const app = express();

app.use(express.json());
app.use(requestLoggerMiddleware);

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
