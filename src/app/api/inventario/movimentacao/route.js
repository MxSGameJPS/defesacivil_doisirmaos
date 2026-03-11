import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      item_id,
      tipo, // 'Entrada' or 'Saida'
      origem_destino = "Uso Interno",
      quantidade,
      descricao = "",
      data_movimentacao = new Date().toISOString().split("T")[0],
    } = body;

    if (!item_id || !tipo || !quantidade) {
      return NextResponse.json(
        { message: "Campos obrigatórios ausentes" },
        { status: 400 },
      );
    }

    // Begin Transaction (not strictly necessary for this query but good practice)
    // 1. Record the movement
    await query(
      `INSERT INTO movimentacoes_inventario (item_id, tipo, origem_destino, quantidade, descricao, data_movimentacao) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [item_id, tipo, origem_destino, quantidade, descricao, data_movimentacao],
    );

    // 2. Update the main inventory quantity
    if (tipo === "Entrada") {
      await query(
        `UPDATE inventario SET quantidade = quantidade + $1 WHERE id = $2`,
        [quantidade, item_id],
      );
    } else {
      // Check if enough stock
      const stockRes = await query(
        `SELECT quantidade FROM inventario WHERE id = $1`,
        [item_id],
      );
      if (stockRes.rows[0].quantidade < quantidade) {
        return NextResponse.json(
          { message: "Estoque insuficiente" },
          { status: 400 },
        );
      }
      await query(
        `UPDATE inventario SET quantidade = quantidade - $1 WHERE id = $2`,
        [quantidade, item_id],
      );
    }

    return NextResponse.json(
      { message: "Movimentação concluída" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro na movimentação:", error);
    return NextResponse.json(
      { message: "Erro interno ao processar baixa" },
      { status: 500 },
    );
  }
}
