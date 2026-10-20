import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function artifactRoutes(app: FastifyInstance) {
  app.get("/artifacts", async () => {
    return prisma.artifact.findMany({
      orderBy: {
        title: "asc",
      },
    });
  });

  app.get<{ Params: { id: string } }>(
    "/artifacts/:id",
    async (request, reply) => {
      const { id } = request.params;

      const artifact = await prisma.artifact.findUnique({
        where: { id },
      });

      if (!artifact) {
        return reply.code(404).send({
          message: "Objeto não encontrado.",
        });
      }

      return artifact;
    }
  );

  app.post<{
    Body: {
      inventoryNumber: string;
      title: string;
      objectType: string;
      description?: string;
      material?: string;
      period?: string;
      date?: string;
      culture?: string;
      provenance?: string;
      institution?: string;
      imageUrl?: string;
      externalSource?: string;
      externalId?: string;
    };
  }>("/artifacts", async (request, reply) => {
    const artifact = await prisma.artifact.create({
      data: request.body,
    });

    return reply.code(201).send(artifact);
  });

  app.patch<{
    Params: { id: string };
    Body: {
      inventoryNumber?: string;
      title?: string;
      objectType?: string;
      description?: string;
      material?: string;
      period?: string;
      date?: string;
      culture?: string;
      provenance?: string;
      institution?: string;
      imageUrl?: string;
      externalSource?: string;
      externalId?: string;
    };
  }>("/artifacts/:id", async (request, reply) => {
    const { id } = request.params;

    const existingArtifact = await prisma.artifact.findUnique({
      where: { id },
    });

    if (!existingArtifact) {
      return reply.code(404).send({
        message: "Objeto não encontrado.",
      });
    }

    const artifact = await prisma.artifact.update({
      where: { id },
      data: request.body,
    });

    return artifact;
  });

  app.delete<{ Params: { id: string } }>(
    "/artifacts/:id",
    async (request, reply) => {
      const { id } = request.params;

      const existingArtifact = await prisma.artifact.findUnique({
        where: { id },
      });

      if (!existingArtifact) {
        return reply.code(404).send({
          message: "Objeto não encontrado.",
        });
      }

      await prisma.artifact.delete({
        where: { id },
      });

      return reply.code(204).send({
        message: "Objeto deletado com sucesso.",
      });
    }
  );
}
