import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import keyloggerRouter from "./routes/keyloggerRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Database connection
connectDB();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : process.env.PRODUCTION_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/keylogger", keyloggerRouter);
app.use("/api/admin", adminRouter);

// Health check endpoint
app.get("/", (req, res) => res.send("API is running"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
