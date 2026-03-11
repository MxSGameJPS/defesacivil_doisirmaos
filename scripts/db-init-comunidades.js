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

    // Create Comunidades table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comunidades (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        bairro VARCHAR(255) NOT NULL,
        nucleos_familiares INTEGER DEFAULT 0,
        lider_comunitario VARCHAR(255),
        contato VARCHAR(50),
        ocorrencias INTEGER DEFAULT 0,
        alertas INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table comunidades ready");

    // Seed Comunidades based on the design mock
    const seedComunidades = `
      INSERT INTO comunidades (nome, bairro, nucleos_familiares, lider_comunitario, contato, ocorrencias, alertas)
      SELECT * FROM (VALUES
        ('Vila São José', 'Centro', 125, 'João Silva', '(51) 98765-4321', 0, 0),
        ('Santa Rita', 'União', 92, 'Maria Santos', '(51) 98123-4567', 0, 0),
        ('Vila Nova', 'Industrial', 154, 'Pedro Oliveira', '(51) 98234-5678', 4, 1),
        ('Jardim das Flores', 'Bela Vista', 78, 'Ana Paula Costa', '(51) 99876-5432', 0, 0),
        ('Vila do Arroio', 'Beira Rio', 112, 'Carlos Pereira', '(51) 98987-1234', 2, 0)
      ) AS t(nome, bairro, nucleos_familiares, lider_comunitario, contato, ocorrencias, alertas)
      WHERE NOT EXISTS (SELECT 1 FROM comunidades);
    `;
    await client.query(seedComunidades);
    console.log("Comunidades data seeded");

    console.log("Database communities initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
