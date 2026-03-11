import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/ocorrencias:
 *   get:
 *     summary: Retorna a lista de ocorrências
 *     tags: [Ocorrências]
 */
export async function GET() {
  try {
    const { rows } = await query(
      "SELECT * FROM ocorrencias ORDER BY data_ocorrencia DESC, created_at DESC",
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/ocorrencias:
 *   post:
 *     summary: Registra uma nova ocorrência
 *     tags: [Ocorrências]
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      tipo,
      bairro,
      comunidade,
      data_ocorrencia,
      familias_afetadas = 0,
      gravidade = "Baixa",
      status = "Em andamento",
      descricao = "",
    } = body;

    if (!tipo || !bairro || !comunidade || !data_ocorrencia) {
      return NextResponse.json(
        { message: "Tipo, Bairro, Comunidade e Data são obrigatórios" },
        { status: 400 },
      );
    }

    // Gerar código único OC-YYYY-XXXX
    const year = new Date().getFullYear();
    const random = Math.floor(100 + Math.random() * 899);
    const codigo = `OC-${year}-${random}`;

    const { rows } = await query(
      `INSERT INTO ocorrencias (codigo, tipo, bairro, comunidade, data_ocorrencia, familias_afetadas, gravidade, status, descricao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        codigo,
        tipo,
        bairro,
        comunidade,
        data_ocorrencia,
        familias_afetadas,
        gravidade,
        status,
        descricao,
      ],
    );

    // Update global counts
    await query(
      `UPDATE bairros SET ocorrencias = (SELECT COUNT(*) FROM ocorrencias WHERE bairro = $1) WHERE nome = $1`,
      [bairro],
    );
    await query(
      `UPDATE comunidades SET ocorrencias = (SELECT COUNT(*) FROM ocorrencias WHERE comunidade = $1 AND bairro = $2) WHERE nome = $1 AND bairro = $2`,
      [comunidade, bairro],
    );

    return NextResponse.json(
      { message: "Ocorrência registrada com sucesso", ocorrencia: rows[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao registrar ocorrência:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
