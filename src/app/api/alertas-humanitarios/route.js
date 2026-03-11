import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      "SELECT * FROM alertas_humanitarios ORDER BY created_at DESC",
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      titulo,
      tipo,
      bairro,
      comunidade,
      data_inicio,
      familias_afetadas = 0,
      numero_pessoas = 0,
      criancas_10 = 0,
      criancas_13 = 0,
      adolescentes_18 = 0,
      idosos = 0,
      gestantes = 0,
      gravidade = "Média",
      status = "Ativo",
      descricao = "",
      ajuda_necessaria = "",
      outro_item = "",
    } = body;

    const year = new Date().getFullYear();
    const random = Math.floor(100 + Math.random() * 899);
    const codigo = `AH-${year}-${random}`;

    const { rows } = await query(
      `INSERT INTO alertas_humanitarios (
        codigo, titulo, tipo, bairro, comunidade, data_inicio, 
        familias_afetadas, numero_pessoas, criancas_10, criancas_13, 
        adolescentes_18, idosos, gestantes, gravidade, status, 
        descricao, ajuda_necessaria, outro_item
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        codigo,
        titulo,
        tipo,
        bairro,
        comunidade,
        data_inicio,
        familias_afetadas,
        numero_pessoas,
        criancas_10,
        criancas_13,
        adolescentes_18,
        idosos,
        gestantes,
        gravidade,
        status,
        descricao,
        ajuda_necessaria,
        outro_item,
      ],
    );

    // Sync counts in main tables
    await query(
      `UPDATE bairros SET alertas = (SELECT COUNT(*) FROM alertas_humanitarios WHERE bairro = $1 AND status = 'Ativo') WHERE nome = $1`,
      [bairro],
    );
    await query(
      `UPDATE comunidades SET alertas = (SELECT COUNT(*) FROM alertas_humanitarios WHERE comunidade = $1 AND bairro = $2 AND status = 'Ativo') WHERE nome = $1 AND bairro = $2`,
      [comunidade, bairro],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    return NextResponse.json(
      { message: "Erro interno ao salvar alerta" },
      { status: 500 },
    );
  }
}
