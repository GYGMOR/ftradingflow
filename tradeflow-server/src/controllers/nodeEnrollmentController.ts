import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const NODE_JWT_SECRET = process.env.NODE_JWT_SECRET || "node-secret-tradeflow-2026-v1";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

// Helper to generate a 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createPairingCode = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const code = generateCode();
    
    // Default expiry: 5 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await prisma.nodePairingToken.create({
      data: {
        userId,
        code,
        expiresAt
      }
    });

    res.json({ code, expiresAt });
  } catch (err) {
    next(err);
  }
};

export const enrollVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, hostname, os, nodeType, cpuModel, totalRamGb } = req.body;

    if (!code) return res.status(400).json({ error: "Pairing code required" });

    // 1. Validate Pairing Code
    const pairingToken = await prisma.nodePairingToken.findUnique({
      where: { code },
      include: { user: true }
    });

    if (!pairingToken || pairingToken.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired pairing code" });
    }

    // 2. Create or Update Node
    const node = await prisma.botNode.create({
      data: {
        userId: pairingToken.userId,
        nodeName: hostname || "New Agent Node",
        hostname,
        os,
        nodeType: nodeType || "AGENT",
        cpuModel,
        totalRamGb: totalRamGb ? parseFloat(totalRamGb) : null,
        status: "IDLE",
        enrolledAt: new Date(),
        lastHeartbeat: new Date()
      }
    });

    // 3. Generate Tokens
    const accessToken = jwt.sign({ nodeId: node.id, userId: node.userId }, NODE_JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = crypto.randomUUID();
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await prisma.nodeToken.create({
      data: {
        nodeId: node.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
      }
    });

    // 4. Burn Pairing Code
    await prisma.nodePairingToken.delete({ where: { id: pairingToken.id } });

    res.json({
      success: true,
      nodeId: node.id,
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

export const refreshNodeToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const storedToken = await prisma.nodeToken.findFirst({
      where: { tokenHash }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    const node = await prisma.botNode.findUnique({ where: { id: storedToken.nodeId } });
    if (!node) return res.status(404).json({ error: "Node not found" });

    // 1. Generate new pair (Rotated Refresh Token)
    const newAccessToken = jwt.sign({ nodeId: node.id, userId: node.userId }, NODE_JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const newRefreshToken = crypto.randomUUID();
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    await prisma.$transaction([
      prisma.nodeToken.delete({ where: { id: storedToken.id } }),
      prisma.nodeToken.create({
        data: {
          nodeId: node.id,
          tokenHash: newRefreshTokenHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
        }
      })
    ]);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
};
