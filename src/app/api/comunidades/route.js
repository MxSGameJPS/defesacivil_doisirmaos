import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/comunidades:
 *   get:
 *     summary: Retorna a lista de comunidades
 *     description: Retorna todas as comunidades com seus respectivos indicadores.
 *     tags: [Comunidades]
 *     responses:
 *       200:
 *         description: Lista de comunidades obtida com sucesso
 *   post:
 *     summary: Cria uma nova comunidade
 *     description: Adiciona uma nova comunidade ao banco de dados SISPDEC.
 *     tags: [Comunidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               bairro:
 *                 type: string
 *               lider_comunitario:
 *                 type: string
 *               contato:
 *                 type: string
 *               nucleos_familiares:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comunidade criada com sucesso
 */

export async function GET() {
  try {
    const { rows } = await query("SELECT * FROM comunidades ORDER BY nome ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar comunidades:", error);
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
      nome,
      bairro,
      lider_comunitario,
      contato,
      nucleos_familiares = 0,
    } = body;

    if (!nome || !bairro) {
      return NextResponse.json(
        { message: "Nome e Bairro são obrigatórios para registrar comunidade" },
        { status: 400 },
      );
    }

    const { rows } = await query(
      `INSERT INTO comunidades (nome, bairro, lider_comunitario, contato, nucleos_familiares)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, bairro, lider_comunitario, contato, nucleos_familiares],
    );

    return NextResponse.json(
      { message: "Comunidade criada com sucesso", comunidade: rows[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar comunidade:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
