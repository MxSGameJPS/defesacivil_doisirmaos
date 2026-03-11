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

    // Drop and recreate alertas_humanitarios with all requested fields
    await client.query(`DROP TABLE IF EXISTS alertas_humanitarios CASCADE;`);

    await client.query(`
      CREATE TABLE alertas_humanitarios (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        bairro VARCHAR(255) NOT NULL,
        comunidade VARCHAR(255) NOT NULL,
        data_inicio DATE NOT NULL,
        familias_afetadas INTEGER DEFAULT 0,
        numero_pessoas INTEGER DEFAULT 0,
        criancas_10 INTEGER DEFAULT 0,
        criancas_13 INTEGER DEFAULT 0,
        adolescentes_18 INTEGER DEFAULT 0,
        idosos INTEGER DEFAULT 0,
        gestantes INTEGER DEFAULT 0,
        gravidade VARCHAR(50) DEFAULT 'Média',
        status VARCHAR(50) DEFAULT 'Ativo',
        descricao TEXT,
        ajuda_necessaria TEXT, -- Comma separated values from checkbox
        outro_item TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table alertas_humanitarios recreated with full census fields");

    // Seed initial data
    await client.query(`
      INSERT INTO alertas_humanitarios (
        codigo, titulo, tipo, bairro, comunidade, data_inicio, 
        familias_afetadas, numero_pessoas, criancas_10, idosos, gestantes, 
        gravidade, status, ajuda_necessaria, descricao
      ) VALUES (
        'AH-2024-001', 'Alagamento Grave', 'Inundação', 'Beira Rio', 'Vila do Arroio', '2024-03-05', 
        15, 52, 12, 4, 1, 'Crítica', 'Ativo', 'Cesta Básica, Kit de higiene, Colchões, Cobertores', 
        'Níveis do rio subiram rápido após fortes chuvas.'
      );
    `);
    console.log("Initial alert seeded");

    // Sync counts in bairros/comunidades
    await client.query(`
      UPDATE bairros SET alertas = (SELECT COUNT(*) FROM alertas_humanitarios WHERE bairro = bairros.nome AND status = 'Ativo');
      UPDATE comunidades SET alertas = (SELECT COUNT(*) FROM alertas_humanitarios WHERE comunidade = comunidades.nome AND bairro = comunidades.bairro AND status = 'Ativo');
    `);
    console.log("Alert counts synced");

    console.log("Database alert system RE-initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
