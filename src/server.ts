import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { artifactRoutes } from "./routes/artifacts";

const app = Fastify({
  logger: true,
});

async function start() {
  await app.register(cors, {
    origin: true,
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Kleion API",
        description: "API para gerenciamento de um acervo digital.",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3333",
          description: "Servidor local",
        },
      ],
      tags: [
        {
          name: "Artifacts",
          description: "Gerenciamento dos itens do acervo",
        },
      ],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/", async () => {
    return {
      status: "Service is running! 🚀⭐",
      service: "kleion-api",
    };
  });

  await app.register(artifactRoutes);

  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3333,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
