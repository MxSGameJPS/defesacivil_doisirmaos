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

    // Create nucleos_familiares table
    await client.query(`
      CREATE TABLE IF NOT EXISTS nucleos_familiares (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        responsavel VARCHAR(255) NOT NULL,
        comunidade VARCHAR(255) NOT NULL,
        bairro VARCHAR(255) NOT NULL,
        membros INTEGER DEFAULT 1,
        criancas INTEGER DEFAULT 0,
        idosos INTEGER DEFAULT 0,
        pcd INTEGER DEFAULT 0,
        vulnerabilidade VARCHAR(50) DEFAULT 'Baixa',
        recebeu_ajuda BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table nucleos_familiares ready");

    // Seed nucleos_familiares based on the design mock
    const seedNucleos = `
      INSERT INTO nucleos_familiares (codigo, responsavel, comunidade, bairro, membros, criancas, idosos, pcd, vulnerabilidade, recebeu_ajuda)
      SELECT * FROM (VALUES
        ('NF-2024-0012', 'Ana Maria Silva', 'Vila São José', 'Centro', 6, 3, 2, 0, 'Baixa', true),
        ('NF-2024-0042', 'José Carlos Oliveira', 'Santa Rita', 'União', 4, 2, 1, 0, 'Média', true),
        ('NF-2024-0023', 'Maria do Carmo Pereira', 'Vila Nova', 'Industrial', 2, 1, 1, 1, 'Alta', false),
        ('NF-2024-0094', 'Antônio da Silva Costa', 'Jardim das Flores', 'Bela Vista', 9, 5, 1, 2, 'Crítica', true)
      ) AS t(codigo, responsavel, comunidade, bairro, membros, criancas, idosos, pcd, vulnerabilidade, recebeu_ajuda)
      WHERE NOT EXISTS (SELECT 1 FROM nucleos_familiares);
    `;
    await client.query(seedNucleos);
    console.log("Nucleos_familiares data seeded");

    console.log("Database nucleos initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
