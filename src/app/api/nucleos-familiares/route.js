import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/nucleos-familiares:
 *   get:
 *     summary: Retorna a lista de núcleos familiares
 *     tags: [Núcleos Familiares]
 *     responses:
 *       200:
 *         description: Lista obtida com sucesso
 */
export async function GET() {
  try {
    const { rows } = await query(
      "SELECT * FROM nucleos_familiares ORDER BY created_at DESC",
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar núcleos familiares:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/nucleos-familiares:
 *   post:
 *     summary: Cria um novo núcleo familiar
 *     tags: [Núcleos Familiares]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responsavel:
 *                 type: string
 *               comunidade:
 *                 type: string
 *               bairro:
 *                 type: string
 *               membros:
 *                 type: integer
 *               criancas:
 *                 type: integer
 *               idosos:
 *                 type: integer
 *               pcd:
 *                 type: integer
 *               vulnerabilidade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Criado com sucesso
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      responsavel,
      comunidade,
      bairro,
      membros = 1,
      criancas = 0,
      idosos = 0,
      pcd = 0,
      vulnerabilidade = "Baixa",
    } = body;

    if (!responsavel || !comunidade || !bairro) {
      return NextResponse.json(
        { message: "Responsável, Comunidade e Bairro são obrigatórios" },
        { status: 400 },
      );
    }

    // Gerar código único simples ex: NF-2024-XXXX
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const codigo = `NF-${year}-${random}`;

    const { rows } = await query(
      `INSERT INTO nucleos_familiares (codigo, responsavel, comunidade, bairro, membros, criancas, idosos, pcd, vulnerabilidade)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        codigo,
        responsavel,
        comunidade,
        bairro,
        membros,
        criancas,
        idosos,
        pcd,
        vulnerabilidade,
      ],
    );

    return NextResponse.json(
      { message: "Núcleo familiar criado com sucesso", nucleo: rows[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar núcleo familiar:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
