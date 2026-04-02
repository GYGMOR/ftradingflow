import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    await client.connect();
    const adminEmail = "admin@tradeflow.io";
    
    // Check if admin exists
    const res = await client.query("SELECT * FROM users WHERE email = $1", [adminEmail]);
    if (res.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("Admin1234!", 12);
      await client.query(
        "INSERT INTO users (email, full_name, password_hash, role) VALUES ($1, $2, $3, $4)",
        [adminEmail, "System Admin", hashedPassword, "ADMIN"]
      );
      console.log("✅ Default Admin User created: admin@tradeflow.io / Admin1234!");
    } else {
      console.log("ℹ️ Admin User already exists.");
    }
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.end();
  }
}

main();
