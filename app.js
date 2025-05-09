import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import HttpError from "./helpers/HttpError.js";
import { globalErrorHandler } from "./helpers/globalErrorHandler.js";
import userRouter from "./routes/userRouter.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./helpers/swagger.js";
import projectRouter from "./routes/projectRouter.js";
import workRouter from "./routes/workRouter.js";
import deliverableRouter from "./routes/deliverableRouter.js";
import activityRouter from "./routes/activityRouter.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const pathPrefix = "/api";
app.use(`${pathPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(`${pathPrefix}/users`, userRouter);
app.use(`${pathPrefix}/projects`, projectRouter);
app.use(`${pathPrefix}/works`, workRouter);
app.use(`${pathPrefix}/deliverables`, deliverableRouter);
app.use(`${pathPrefix}/activities`, activityRouter);

app.use((_, res, next) => {
  next(HttpError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const port = +process.env.PORT || 3000;

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
