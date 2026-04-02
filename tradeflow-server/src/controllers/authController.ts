import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma.js";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-tradeflow-key-2026-v1";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    // Check if this is the first user
    const userCount = await prisma.user.count();
    const role: UserRole = userCount === 0 ? "ADMIN" : "TRIAL";

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, role },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message || "Login failed" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  })(req, res, next);
};

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { session: false }, (err: any, user: any) => {
    if (err || !user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=sso_failed`);
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  })(req, res, next);
};

export const microsoftCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("microsoft", { session: false }, (err: any, user: any) => {
    if (err || !user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=sso_failed`);
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  })(req, res, next);
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        entitlements: { include: { entitlement: true } },
      }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

