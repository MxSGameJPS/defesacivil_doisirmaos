import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const spec = createSwaggerSpec({
      apiFolder: "src/app/api", // O scanner do next-swagger-doc procura por anotações JSDoc
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

    // Fallback: Se o spec.paths estiver vazio (comum na Vercel devido ao bundle), 
    // definimos manualmente os endpoints principais para garantir que apareçam.
    if (!spec.paths || Object.keys(spec.paths).length === 0) {
      spec.paths = {
        "/api/auth/login": {
          post: {
            summary: "Realiza login no sistema",
            tags: ["Autenticação"],
            responses: { 200: { description: "Sucesso" } }
          }
        },
        "/api/inventario": {
          get: {
            summary: "Lista itens do inventário",
            tags: ["Operacional"],
            responses: { 200: { description: "Sucesso" } }
          },
          post: {
            summary: "Cadastra novo item",
            tags: ["Operacional"],
            responses: { 201: { description: "Criado" } }
          }
        },
        "/api/manutencoes": {
          get: {
            summary: "Lista preventivas e correções",
            tags: ["Operacional"],
            responses: { 200: { description: "Sucesso" } }
          }
        },
        "/api/chamados": {
          post: {
            summary: "Envia pedido de ajuda (Mobile)",
            tags: ["Mobile"],
            responses: { 201: { description: "Enviado" } }
          }
        },
        "/api/alertas-humanitarios": {
          get: { summary: "Lista alertas", tags: ["Operacional"] }
        }
      };
    }

    return NextResponse.json(spec);
  } catch (error) {
    console.error("Swagger generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
