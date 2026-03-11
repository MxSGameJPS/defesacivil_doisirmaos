import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT m.*, i.nome as item_nome, i.num_tombo as item_tombo
      FROM manutencoes m
      JOIN inventario i ON m.item_id = i.id
      ORDER BY m.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error);
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
      item_id,
      tipo,
      prioridade,
      descricao = "",
      data_solicitacao = new Date().toISOString().split("T")[0],
      custo = 0,
    } = body;

    if (!item_id || !tipo || !prioridade) {
      return NextResponse.json(
        { message: "Campos obrigatórios ausentes" },
        { status: 400 },
      );
    }

    // Generate unique code like MAN-2024-XXXX
    const year = new Date().getFullYear();
    const countRes = await query(`SELECT COUNT(*) FROM manutencoes`);
    const count = parseInt(countRes.rows[0].count) + 1;
    const codigo = `MAN-${year}-${count.toString().padStart(4, "0")}`;

    const { rows } = await query(
      `INSERT INTO manutencoes (codigo, item_id, tipo, prioridade, descricao, data_solicitacao, custo, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pendente') RETURNING *`,
      [codigo, item_id, tipo, prioridade, descricao, data_solicitacao, custo],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar manutenção:", error);
    return NextResponse.json(
      { message: "Erro ao processar solicitação" },
      { status: 500 },
    );
  }
}
