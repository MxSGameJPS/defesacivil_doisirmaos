import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query("SELECT * FROM inventario ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar inventário:", error);
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
      id_compra = "",
      link_siged = "",
      unidade_medida = "Unidade",
      categoria,
      subcategoria = "",
      descricao = "",
      quantidade = 0,
      valor_unitario = 0,
      localizacao = "",
      condicao = "Bom",
      num_tombo = "",
      data_aquisicao = null,
      tags = "",
    } = body;

    if (!nome || !categoria) {
      return NextResponse.json(
        { message: "Nome e Categoria são obrigatórios" },
        { status: 400 },
      );
    }

    const { rows } = await query(
      `INSERT INTO inventario (
        nome, id_compra, link_siged, unidade_medida, categoria, subcategoria, 
        descricao, quantidade, valor_unitario, localizacao, condicao, num_tombo, 
        data_aquisicao, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        nome,
        id_compra,
        link_siged,
        unidade_medida,
        categoria,
        subcategoria,
        descricao,
        quantidade,
        valor_unitario,
        localizacao,
        condicao,
        num_tombo,
        data_aquisicao,
        tags,
      ],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar item no inventário:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao salvar" },
      { status: 500 },
    );
  }
}
