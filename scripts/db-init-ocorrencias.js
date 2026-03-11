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

    // Create ocorrencias table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ocorrencias (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        bairro VARCHAR(255) NOT NULL,
        comunidade VARCHAR(255) NOT NULL,
        data_ocorrencia DATE NOT NULL,
        familias_afetadas INTEGER DEFAULT 0,
        gravidade VARCHAR(50) DEFAULT 'Baixa',
        status VARCHAR(50) DEFAULT 'Em andamento',
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table ocorrencias ready");

    // Seed ocorrencias
    const checkExist = await client.query("SELECT COUNT(*) FROM ocorrencias");
    if (parseInt(checkExist.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO ocorrencias (codigo, tipo, bairro, comunidade, data_ocorrencia, familias_afetadas, gravidade, status)
        VALUES 
          ('OC-2024-001', 'Alagamento', 'Beira Rio', 'Vila do Arroio', '2024-03-01', 12, 'Alta', 'Em andamento'),
          ('OC-2024-002', 'Deslizamento', 'Industrial', 'Vila Nova', '2024-03-02', 8, 'Crítica', 'Em andamento'),
          ('OC-2024-003', 'Falta de Água', 'Centro', 'Vila São José', '2024-02-28', 15, 'Média', 'Resolvido'),
          ('OC-2024-004', 'Queda de Árvore', 'União', 'Santa Rita', '2024-02-27', 3, 'Alta', 'Resolvido');
      `);
      console.log("Ocorrencias data seeded");
    }

    // Fixed counts update
    await client.query(`
      UPDATE bairros SET ocorrencias = (SELECT COUNT(*) FROM ocorrencias WHERE ocorrencias.bairro = bairros.nome);
    `);
    await client.query(`
      UPDATE comunidades SET ocorrencias = (SELECT COUNT(*) FROM ocorrencias WHERE ocorrencias.comunidade = comunidades.nome AND ocorrencias.bairro = comunidades.bairro);
    `);
    console.log("Counts updated successfully");

    console.log("Database occurrences initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
