import { withSwagger } from "next-swagger-doc";

const swaggerOptions = {
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
};

const swaggerHandler = withSwagger(swaggerOptions);
export const GET = swaggerHandler();
