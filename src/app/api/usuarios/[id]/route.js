import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Prevent deleting the main Secretario user (assuming login 'Secretario')
    const userRes = await query("SELECT login FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (userRes.rows.length > 0 && userRes.rows[0].login === "Secretario") {
      return NextResponse.json(
        { message: "O usuário Secretário principal não pode ser excluído" },
        { status: 403 },
      );
    }

    await query("DELETE FROM usuarios WHERE id = $1", [id]);
    return NextResponse.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { message: "Erro ao processar exclusão" },
      { status: 500 },
    );
  }
}
