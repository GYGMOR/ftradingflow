import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

export const getLayouts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const layouts = await prisma.userDashboardLayout.findMany({
      where: { userId }
    });
    res.json(layouts);
  } catch (err) {
    next(err);
  }
};

export const saveLayout = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { sceneName, layoutData } = req.body;

    if (!sceneName || !layoutData) {
      return res.status(400).json({ error: "Missing sceneName or layoutData" });
    }

    const layout = await prisma.userDashboardLayout.upsert({
      where: {
        // We need a unique constraint on (userId, sceneName) to use upsert easily
        // If not present in schema, we have to find and update/create
        id: (await prisma.userDashboardLayout.findFirst({
          where: { userId, sceneName }
        }))?.id || "00000000-0000-0000-0000-000000000000" // Dummy UUID if not found
      },
      update: {
        layoutData,
        updatedAt: new Date()
      },
      create: {
        userId,
        sceneName,
        layoutData,
      }
    });

    res.json(layout);
  } catch (err) {
    next(err);
  }
};
