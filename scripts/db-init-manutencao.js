const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function initDb() {
  try {
    await client.connect();
    console.log("Connected to the database");

    // Create manutencoes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS manutencoes (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        item_id INTEGER REFERENCES inventario(id),
        tipo VARCHAR(20) NOT NULL, -- 'Preventiva' or 'Corretiva'
        data_solicitacao DATE DEFAULT CURRENT_DATE,
        data_agendamento DATE,
        tecnico VARCHAR(100),
        prioridade VARCHAR(20), -- 'Baixa', 'Média', 'Alta', 'Urgente'
        status VARCHAR(20) DEFAULT 'Pendente', -- 'Pendente', 'Agendado', 'Em Execução', 'Concluído'
        custo DECIMAL(10, 2) DEFAULT 0.00,
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table manutencoes ready");

    // Seed data like the image
    const checkExist = await client.query("SELECT COUNT(*) FROM manutencoes");
    if (parseInt(checkExist.rows[0].count) === 0) {
      // Get some item IDs from inventario first
      const itemRes = await client.query("SELECT id FROM inventario LIMIT 4");
      const items = itemRes.rows;

      if (items.length >= 1) {
        await client.query(
          `
          INSERT INTO manutencoes (codigo, item_id, tipo, data_solicitacao, data_agendamento, tecnico, prioridade, status, custo)
          VALUES 
            ('MAN-2024-0001', $1, 'Preventiva', '2024-03-01', '2024-03-14', 'João Mecânico', 'Média', 'Agendado', 350.00),
            ('MAN-2024-0002', $2, 'Corretiva', '2024-03-05', '2024-03-07', 'Santos Elétrica', 'Urgente', 'Em Execução', 0.00),
            ('MAN-2024-0003', $3, 'Preventiva', '2024-03-10', '2024-03-15', 'Pedro Técnico', 'Baixa', 'Concluído', 180.00),
            ('MAN-2024-0004', $4, 'Corretiva', '2024-03-12', NULL, NULL, 'Alta', 'Pendente', 0.00);
        `,
          [
            items[0].id,
            items[1]?.id || items[0].id,
            items[2]?.id || items[0].id,
            items[3]?.id || items[0].id,
          ],
        );
        console.log("Maintenance data seeded");
      }
    }

    console.log("Database maintenance system initialized!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
