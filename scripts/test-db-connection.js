const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres.orgfrguxffcflgghdxjt:defesaCivilDoisIrmaos@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  console.log("Testing connection...");
  try {
    const start = Date.now();
    const res = await pool.query("SELECT 1");
    const duration = Date.now() - start;
    console.log(
      "Connection successful!",
      res.rows,
      "duration:",
      duration,
      "ms",
    );
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
