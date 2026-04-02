import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

// Helper for audit logging
const createAuditLog = async (userId: string | null, action: string, metadata: any) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata,
      }
    });
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const userBefore = await prisma.user.findUnique({ where: { id } });
    if (!userBefore) return res.status(404).json({ error: "User not found" });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role }
    });

    // Log the action
    await createAuditLog(req.user.id, "UPDATE_USER_ROLE", {
      targetUserId: id,
      targetEmail: userBefore.email,
      oldRole: userBefore.role,
      newRole: role
    });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [userCount, tradeCount, nodeCount] = await Promise.all([
      prisma.user.count(),
      prisma.tradeHistory.count(),
      prisma.botNode.count()
    ]);

    res.json({
      totalUsers: userCount,
      totalTrades: tradeCount,
      activeNodes: nodeCount,
      timestamp: new Date()
    });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { email: true, fullName: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
