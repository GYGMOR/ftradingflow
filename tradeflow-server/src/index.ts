import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import passport from "passport";
import prisma from "./lib/prisma.js";

// Load strategies
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import layoutRoutes from "./routes/layout.js";
import storeRoutes from "./routes/store.js";
import botNodeRoutes from "./routes/botNode.js";
import nodeRoutes from "./routes/nodeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ 
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ], 
  credentials: true 
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

// Static Files (Downloads, Icons, Assets)
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/layouts", layoutRoutes);
app.use("/admin/store", storeRoutes);
app.use("/admin/nodes", botNodeRoutes);
app.use("/api/nodes", nodeRoutes);

// Trigger reload: 2026-04-02T13:15:00
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 TradeFlow Backend running on http://localhost:${PORT}`);
});

export { prisma };
