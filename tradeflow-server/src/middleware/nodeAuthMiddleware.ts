import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const NODE_JWT_SECRET = process.env.NODE_JWT_SECRET || "node-secret-tradeflow-2026-v1";

export const authenticateNodeJWT = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, NODE_JWT_SECRET, (err: any, node: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired node token" });
      }

      req.node = node; // { nodeId, userId }
      next();
    });
  } else {
    res.status(401).json({ error: "Node authorization required" });
  }
};
