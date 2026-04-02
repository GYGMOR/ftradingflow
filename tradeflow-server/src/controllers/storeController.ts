import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

export const checkout = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Invalid cart" });
    }

    // 1. Fetch User to check current role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Perform checkout in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main purchase record
      const purchase = await tx.userPurchase.create({
        data: {
          userId,
          totalAmount: 99.00, // Dummy amount for this build
          status: "COMPLETED",
        }
      });

      // Create each purchase item
      for (const skuOrId of cart) {
        // Try to find the product by SKU first
        const product = await tx.storeProduct.findUnique({ where: { sku: skuOrId } });
        
        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            productId: product?.id || skuOrId,
            priceAtPurchase: product?.priceChf || 29.00
          }
        });
      }

      // 3. Grant official role if a bundle is in the cart
      const hasAdminUpgrade = cart.includes("upgrade_elite_control");
      const hasPremiumUpgrade = cart.includes("bundle_ai_elite");

      if (hasAdminUpgrade) {
        await tx.user.update({
          where: { id: userId },
          data: { role: "ADMIN" }
        });
      } else if (hasPremiumUpgrade && user.role !== "ADMIN") {
        await tx.user.update({
          where: { id: userId },
          data: { role: "PREMIUM" }
        });
      }

      return purchase;
    });

    res.json({ success: true, message: "Purchase completed and entitlements granted.", purchase: result });
  } catch (err) {
    next(err);
  }
};
