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

    // Table for inventory movements (history)
    await client.query(`
      CREATE TABLE IF NOT EXISTS movimentacoes_inventario (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES inventario(id),
        tipo VARCHAR(20) NOT NULL, -- 'Entrada' or 'Saida'
        origem_destino VARCHAR(255), -- 'Uso Interno' or Alerta ID/Code
        quantidade INTEGER NOT NULL,
        descricao TEXT,
        data_movimentacao DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table movimentacoes_inventario ready");

    console.log("Database inventory movement system initialized!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
