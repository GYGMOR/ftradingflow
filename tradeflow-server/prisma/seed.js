import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

async function main() {
  const adminEmail = "admin@tradeflow.io";
  
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("Admin1234!", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        fullName: "System Admin",
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Default Admin User created: admin@tradeflow.io / Admin1234!");
  } else {
    console.log("ℹ️ Admin User already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
