const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function initDb() {
  try {
    await client.connect();
    console.log("Connected to the database");

    // Create Usuarios table
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        login VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table usuarios ready");

    // Insert Default admin user "Secretario" if not exists
    await client.query(`
      INSERT INTO usuarios (nome, login, senha, role)
      VALUES ('Administrador SISPDEC', 'Secretario', 'DefesaCivil', 'admin')
      ON CONFLICT (login) DO NOTHING;
    `);
    console.log("Default user seeded");

    // Create Bairros table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bairros (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        populacao INTEGER DEFAULT 0,
        area_km2 DECIMAL(10,2) DEFAULT 0,
        nucleos_familiares INTEGER DEFAULT 0,
        ocorrencias INTEGER DEFAULT 0,
        alertas INTEGER DEFAULT 0,
        nivel_risco VARCHAR(50) DEFAULT 'Baixo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table bairros ready");

    // Seed Bairros based on the design mock
    const seedBairros = `
      INSERT INTO bairros (nome, descricao, populacao, area_km2, nucleos_familiares, ocorrencias, alertas, nivel_risco)
      SELECT * FROM (VALUES
        ('Centro', 'Área comercial e administrativa', 3200, 1.8, 980, 0, 0, 'Baixo'),
        ('União', 'Bairro residencial de alto padrão', 2800, 2.1, 750, 0, 0, 'Baixo'),
        ('Industrial', 'Bairro com perfil misto', 2600, 3.5, 680, 0, 0, 'Baixo'),
        ('Bela Vista', 'Área residencial de alto padrão', 1900, 1.5, 520, 0, 0, 'Baixo'),
        ('Travessão', 'Bairro tradicional', 2400, 2.0, 620, 0, 0, 'Baixo'),
        ('Beira Rio', 'Localização residencial próxima a áreas naturais', 1600, 1.3, 420, 0, 1, 'Médio'),
        ('Moinho Velho', 'Área com fácil acesso à parte central', 2100, 1.7, 550, 0, 0, 'Baixo'),
        ('Primavera', 'Residencial e tranquilo', 1800, 1.6, 480, 0, 0, 'Baixo'),
        ('São João', 'Bairro residencial com localização central', 2200, 1.9, 590, 0, 0, 'Baixo'),
        ('Vale Verde', 'Área com novos loteamentos', 1400, 2.2, 360, 0, 0, 'Baixo'),
        ('Vale Direito', 'Área em desenvolvimento', 1500, 2.0, 380, 0, 0, 'Baixo')
      ) AS t(nome, descricao, populacao, area_km2, nucleos_familiares, ocorrencias, alertas, nivel_risco)
      WHERE NOT EXISTS (SELECT 1 FROM bairros);
    `;
    await client.query(seedBairros);
    console.log("Bairros data seeded");

    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
