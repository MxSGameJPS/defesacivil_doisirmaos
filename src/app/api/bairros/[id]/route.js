import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/bairros/{id}:
 *   put:
 *     summary: Atualiza um bairro
 *     description: Atualiza a área (km²) de um bairro específico.
 *     tags: [Bairros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               area_km2:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bairro atualizado com sucesso
 *       404:
 *         description: Bairro não encontrado
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    // We expect { area_km2: 12.3 }
    const { area_km2 } = await request.json();

    if (area_km2 === undefined) {
      return NextResponse.json(
        {
          message: "A propriedade area_km2 é obrigatória para esta atualização",
        },
        { status: 400 },
      );
    }

    const { rows } = await query(
      `UPDATE bairros 
       SET area_km2 = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [area_km2, id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Bairro não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Área do bairro atualizada com sucesso",
      bairro: rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar bairro:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
