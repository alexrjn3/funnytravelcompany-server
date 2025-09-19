import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import dotenv from "dotenv";
import compression from "compression";

import oferteRouter from "./routes/oferteRoutes.js";
import userRouter from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import authController from "./controllers/authController.js";
import globalErrorHandler from "./controllers/errorController.js";

export const app = express();
app.set("trust proxy", 1); // trust first proxy
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "https://funnytravelcompany-client.vercel.app", // frontend dev server
    credentials: true, // permite trimiterea cookie-urilor
  })
);

app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(
  hpp() // fără whitelist
);

app.use(compression());

app.use("/posters", (req, res, next) => {
  const fileName = req.params[0];

  if (!fileName) {
    console.warn("Poster not specified, sending default");
    return res.sendFile(path.join(__dirname, "public/posters/default.jpg"));
  }

  const filePath = path.join(__dirname, "public/posters", fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.warn(`Poster not found: ${fileName}`);
      return res.sendFile(path.join(__dirname, "public/posters/default.jpg"));
    }
    res.sendFile(filePath);
  });
});

// === PROTECTED PAGE ===
app.get("/admin/dashboard", authController.protectPage, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ROUTES

app.use("/api/v1/oferte", oferteRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
