import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import dotenv from "dotenv";
import connectDB from "./src/config/db";

// Import routes
import aboutRoutes from "./src/routes/about.routes";
import authRoutes from "./src/routes/auth.routes";
import contactRouets from "./src/routes/contact.routes";
import educationRoutes from "./src/routes/education.routes";
import userRoutes from "./src/routes/user.routes";
import skillsRoutes from "./src/routes/skills.routes";
import contactRoutes from "./src/routes/contact.routes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillsRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

app.use(
  (
    err: ErrorWithStatusCode,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "error",
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
