import { Pool } from "pg";

let pool;

if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10, // Limit connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}
pool = global._pgPool;

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}
