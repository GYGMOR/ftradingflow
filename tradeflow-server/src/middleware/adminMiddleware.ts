import { Response, NextFunction } from "express";

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  
  return res.status(403).json({ 
    error: "Forbidden", 
    message: "Admin access required" 
  });
};
