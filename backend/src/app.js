import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authOtpRoutes from "./routes/authOtpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authGstRoutes from "./routes/authGstRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1 && !process.env.FRONTEND_URL) {
        var msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: "Too many requests. Please try again later." },
});

// Stricter rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 mins for auth routes
  message: { message: "Too many authentication attempts, please try again after 15 minutes." },
});

app.use(globalLimiter);
app.use("/api/auth", authLimiter);

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authOtpRoutes);
app.use("/api/auth/seller", authGstRoutes);
app.use("/api/auth/legacy", authRoutes); // keep legacy routes available just in case
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

export default app;
