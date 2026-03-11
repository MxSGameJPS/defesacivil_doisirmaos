import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login no sistema
 *     description: Autentica um usuário e retorna seus dados.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais incorretas
 */
export async function POST(request) {
  try {
    const { login, senha } = await request.json();

    if (!login || !senha) {
      return NextResponse.json(
        { message: "Login e senha são obrigatórios" },
        { status: 400 },
      );
    }

    const { rows } = await query(
      "SELECT id, nome, login, role FROM usuarios WHERE login = $1 AND senha = $2",
      [login, senha],
    );

    if (rows.length > 0) {
      return NextResponse.json(
        {
          message: "Login realizado com sucesso",
          user: rows[0],
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
