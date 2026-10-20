import Fastify from "fastify";
import cors from "@fastify/cors";

import { prisma } from "./lib/prisma";
import { artifactRoutes } from "./routes/artifacts";

const app = Fastify({
  logger: true,
});

async function start() {
  await app.register(cors, {
    origin: true,
  });

  app.get("/", async () => {
    return {
      status: "Service is running! 🚀⭐",
      service: "kleion-api",
    };
  });

  app.get("/health/db", async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: "OK ✅ ",
        database: "Connected ✅ ",
      };
    } catch (error) {
      app.log.error(error);

      return reply.code(500).send({
        status: "NOK ❌",
        database: "Disconnected ❌",
      });
    }
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
