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

    return NextResponse.json(spec);
  } catch (error) {
    console.error("Swagger generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
