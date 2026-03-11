import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/chamados:
 *   get:
 *     summary: Lista todos os chamados de ajuda (Dashboard)
 *     tags: [Chamados]
 *     responses:
 *       200:
 *         description: Lista de chamados
 *   post:
 *     summary: Envia um novo pedido de ajuda (Mobile App)
 *     tags: [Chamados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, endereco, bairro, telefone, tipo_ocorrencia]
 *             properties:
 *               nome: { type: string }
 *               endereco: { type: string }
 *               bairro: { type: string }
 *               telefone: { type: string }
 *               tipo_ocorrencia: { type: string }
 */

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM chamados ORDER BY data_solicitacao DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    return NextResponse.json({ message: 'Erro ao buscar dados' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      nome, 
      endereco, 
      bairro, 
      telefone, 
      tipo_ocorrencia,
      prioridade = 'Média'
    } = body;

    if (!nome || !endereco || !bairro || !telefone || !tipo_ocorrencia) {
      return NextResponse.json({ message: 'Todos os campos obrigatórios devem ser preenchidos' }, { status: 400 });
    }

    const { rows } = await query(
      `INSERT INTO chamados (nome, endereco, bairro, telefone, tipo_ocorrencia, prioridade, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Pendente') RETURNING *`,
      [nome, endereco, bairro, telefone, tipo_ocorrencia, prioridade]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar chamado:', error);
    return NextResponse.json({ message: 'Erro ao processar solicitação de ajuda' }, { status: 500 });
  }
}
