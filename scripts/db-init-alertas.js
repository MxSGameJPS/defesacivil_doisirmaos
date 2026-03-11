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

    // Create alertas_humanitarios table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alertas_humanitarios (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        bairro VARCHAR(255) NOT NULL,
        comunidade VARCHAR(255) NOT NULL,
        data_inicio DATE NOT NULL,
        familias_afetadas INTEGER DEFAULT 0,
        pessoas_afetadas INTEGER DEFAULT 0,
        criancas_afetadas INTEGER DEFAULT 0,
        gravidade VARCHAR(50) DEFAULT 'Média',
        status VARCHAR(50) DEFAULT 'Ativo',
        descricao TEXT,
        itens_necessarios TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table alertas_humanitarios ready");

    // Seed alertas
    const checkExist = await client.query(
      "SELECT COUNT(*) FROM alertas_humanitarios",
    );
    if (parseInt(checkExist.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO alertas_humanitarios (codigo, titulo, tipo, bairro, comunidade, data_inicio, familias_afetadas, pessoas_afetadas, criancas_afetadas, gravidade, status, descricao, itens_necessarios)
        VALUES 
          ('AH-2024-001', 'Alagamento com famílias desabrigadas', 'Inundação', 'Beira Rio', 'Vila do Arroio', '2024-03-05', 15, 52, 12, 'Crítica', 'Ativo', 'Níveis do rio subiram rápido após fortes chuvas no final de semana.', 'Cestas Básicas, Kits de Higiene, Colchões, Cobertores'),
          ('AH-2024-002', 'Seca prolongada afetando abastecimento', 'Seca', 'Centro', 'Vila São José', '2024-02-15', 24, 86, 8, 'Alta', 'Ativo', 'Redução drástica no nível dos reservatórios comunitários.', 'Água Potável, Filtros, Cestas Básicas'),
          ('AH-2024-003', 'Surtos de arboviroses na região', 'Epidemia', 'Industrial', 'Vila Nova', '2024-03-01', 12, 45, 15, 'Média', 'Finalizado', 'Aumento significativo de casos de dengue na área periférica.', 'Repelentes, Medicamentos, Kits de Higiene');
      `);
      console.log("Alertas data seeded");
    }

    // Sync counts in bairros/comunidades
    await client.query(`
      UPDATE bairros SET alertas = (SELECT COUNT(*) FROM alertas_humanitarios WHERE bairro = bairros.nome AND status = 'Ativo');
      UPDATE comunidades SET alertas = (SELECT COUNT(*) FROM alertas_humanitarios WHERE comunidade = comunidades.nome AND bairro = comunidades.bairro AND status = 'Ativo');
    `);
    console.log("Alert counts synced");

    console.log("Database alert system initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
