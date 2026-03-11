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

    // Create inventario table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        id_compra VARCHAR(100),
        link_siged TEXT,
        unidade_medida VARCHAR(50),
        categoria VARCHAR(100) NOT NULL,
        subcategoria VARCHAR(100),
        descricao TEXT,
        quantidade INTEGER DEFAULT 0,
        valor_unitario DECIMAL(10, 2) DEFAULT 0.00,
        localizacao VARCHAR(255),
        condicao VARCHAR(50) DEFAULT 'Novo',
        num_tombo VARCHAR(100),
        data_aquisicao DATE,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table inventario ready");

    // Seed data
    const checkExist = await client.query("SELECT COUNT(*) FROM inventario");
    if (parseInt(checkExist.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO inventario (nome, categoria, subcategoria, quantidade, localizacao, condicao)
        VALUES 
          ('Mesa de Escritório', 'Mobiliário', 'Mesas e Escritórios', 12, 'Sede Principal - Andar 1', 'Bom'),
          ('Cadeiras Executivas', 'Mobiliário', 'Cadeiras e Assentos', 25, 'Sede Principal - Todos os andares', 'Novo'),
          ('Estante de Aço', 'Mobiliário', 'Armários e Estantes', 8, 'Almoxarifado Central', 'Bom'),
          ('Kit de Primeiros Socorros', 'Equipamentos', 'Equipamentos Médicos', 50, 'Almoxarifado Central', 'Novo'),
          ('Rádio Comunicador HT', 'Equipamentos', 'Equipamentos de Comunicação', 30, 'Central de Comunicação', 'Ótimo');
      `);
      console.log("Inventory data seeded");
    }

    console.log("Database inventory initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
