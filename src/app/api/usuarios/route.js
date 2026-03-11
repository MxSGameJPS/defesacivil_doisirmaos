import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      "SELECT id, nome, login, role, created_at FROM usuarios ORDER BY id DESC",
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, login, senha, role } = body;

    if (!nome || !login || !senha || !role) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const { rows } = await query(
      "INSERT INTO usuarios (nome, login, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome, login, role",
      [nome, login, senha, role],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint
      return NextResponse.json(
        { message: "Este login já está em uso" },
        { status: 400 },
      );
    }
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
