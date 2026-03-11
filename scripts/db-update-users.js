const { Client } = require("pg");

const connectionString =
  "postgresql://postgres.orgfrguxffcflgghdxjt:defesaCivilDoisIrmaos@aws-1-sa-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString,
});

async function initDb() {
  try {
    await client.connect();
    console.log("Connected to the database");

    // Ensure role column exists and is VARCHAR
    // The previous init already created the table.

    // Update the default user to role 'Secretario' to match current requirements
    await client.query(`
      UPDATE usuarios SET role = 'Secretario' WHERE login = 'Secretario';
    `);
    console.log("Updated default user role to 'Secretario'");

    console.log("Database user system updated!");
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    await client.end();
  }
}

initDb();
