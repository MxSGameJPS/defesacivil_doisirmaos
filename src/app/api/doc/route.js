import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const spec = createSwaggerSpec({
      apiFolder: "src/app/api",
      definition: {
        openapi: "3.0.0",
        info: {
          title: "API Defesa Civil Dois Irmãos / SISPDEC",
          version: "1.0.0",
          description: "Documentação da API para uso web e mobile.",
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [],
      },
    });

    // Fallback completo para todos os endpoints do sistema
    // Isso garante que a documentação funcione 100% na Vercel
    if (!spec.paths || Object.keys(spec.paths).length === 0) {
      spec.paths = {
        "/api/auth/login": {
          post: {
            summary: "Realiza login no sistema",
            tags: ["Autenticação"],
            responses: { 200: { description: "Sucesso" } }
          }
        },
        "/api/chamados": {
          get: { summary: "Lista chamados de ajuda", tags: ["Mobile/Comunidade"] },
          post: { 
            summary: "Envia pedido de ajuda", 
            tags: ["Mobile/Comunidade"],
            requestBody: {
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        },
        "/api/alertas-humanitarios": {
          get: { summary: "Lista alertas ativos", tags: ["Operacional"] },
          post: { summary: "Cria novo alerta", tags: ["Operacional"] }
        },
        "/api/ocorrencias": {
          get: { summary: "Lista ocorrências registradas", tags: ["Operacional"] },
          post: { summary: "Registra nova ocorrência", tags: ["Operacional"] }
        },
        "/api/inventario": {
          get: { summary: "Lista itens do inventário", tags: ["Logística/Inventário"] },
          post: { summary: "Cadastra novo material", tags: ["Logística/Inventário"] }
        },
        "/api/inventario/movimentacao": {
          post: { summary: "Registra entrada/saída de material", tags: ["Logística/Inventário"] }
        },
        "/api/manutencoes": {
          get: { summary: "Lista chamados de manutenção", tags: ["Logística/Manutenção"] },
          post: { summary: "Solicita manutenção", tags: ["Logística/Manutenção"] }
        },
        "/api/usuarios": {
          get: { summary: "Lista todos os usuários (Admin)", tags: ["Administração"] },
          post: { summary: "Cria novo usuário", tags: ["Administração"] }
        },
        "/api/bairros": {
          get: { summary: "Lista bairros da cidade", tags: ["Cadastros"] },
          post: { summary: "Cadastra novo bairro", tags: ["Cadastros"] }
        },
        "/api/comunidades": {
          get: { summary: "Lista comunidades cadastradas", tags: ["Cadastros"] },
          post: { summary: "Cadastra nova comunidade", tags: ["Cadastros"] }
        },
        "/api/nucleos-familiares": {
          get: { summary: "Lista núcleos familiares", tags: ["Censo"] },
          post: { summary: "Cadastra núcleo familiar", tags: ["Censo"] }
        }
      };
    }

    return NextResponse.json(spec);
  } catch (error) {
    console.error("Swagger generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
