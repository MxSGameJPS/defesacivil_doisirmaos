const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function initDb() {
  try {
    await client.connect();
    console.log("Connected to the database");

    // Create chamados table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chamados (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        endereco VARCHAR(255) NOT NULL,
        bairro VARCHAR(100) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        tipo_ocorrencia VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pendente', -- 'Pendente', 'Em Atendimento', 'Concluído', 'Cancelado'
        data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        observacoes TEXT,
        prioridade VARCHAR(20) DEFAULT 'Média'
      );
    `);
    console.log("Table chamados ready");

    // Seed some initial data for visual testing
    const checkExist = await client.query("SELECT COUNT(*) FROM chamados");
    if (parseInt(checkExist.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO chamados (nome, endereco, bairro, telefone, tipo_ocorrencia, prioridade, status)
        VALUES 
          ('Carlos Andrade', 'Rua das Flores, 123', 'Centro', '(51) 98888-1111', 'Deslizamento de Terra', 'Alta', 'Pendente'),
          ('Maria Oliveira', 'Av. das Palmeiras, 45', 'Beira Rio', '(51) 97777-2222', 'Alagamento', 'Urgente', 'Em Atendimento'),
          ('Ricardo Souza', 'Beco dos Passarinhos, s/n', 'Vale Verde', '(51) 96666-3333', 'Arvore caindo sobre construção', 'Média', 'Pendente');
      `);
      console.log("Seed data for chamados added");
    }

    console.log("Database help request system initialized!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.end();
  }
}

initDb();
