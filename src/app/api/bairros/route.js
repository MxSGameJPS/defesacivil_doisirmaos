import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/bairros:
 *   get:
 *     summary: Retorna a lista de bairros
 *     description: Retorna todos os bairros e suas estatísticas.
 *     tags: [Bairros]
 *     responses:
 *       200:
 *         description: Lista de bairros
 *   post:
 *     summary: Adiciona um novo bairro
 *     tags: [Bairros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               populacao:
 *                 type: integer
 *               area_km2:
 *                 type: number
 *               nivel_risco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bairro criado
 */
export async function GET() {
  try {
    const { rows } = await query("SELECT * FROM bairros ORDER BY id ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar bairros:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { nome, descricao, populacao, area_km2, nivel_risco } = data;

    const { rows } = await query(
      `INSERT INTO bairros (nome, descricao, populacao, area_km2, nivel_risco)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, descricao, populacao || 0, area_km2 || 0, nivel_risco || "Baixo"],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar bairro:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
