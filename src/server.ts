import Fastify from "fastify";
import cors from "@fastify/cors";

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
