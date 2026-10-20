import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function artifactRoutes(app: FastifyInstance) {
  app.get(
    "/artifacts",
    {
      schema: {
        tags: ["Artifacts"],
        summary: "Listar itens do acervo",
        description: "Retorna todos os itens cadastrados.",
        response: {
          200: {
            description: "Lista de itens do acervo",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                inventoryNumber: { type: "string" },
                title: { type: "string" },
                objectType: { type: "string" },
              },
            },
          },
        },
      },
    },
    async () => {
      return prisma.artifact.findMany({
        orderBy: {
          title: "asc",
        },
      });
    }
  );

  app.get<{ Params: { id: string } }>(
    "/artifacts/:id",
    {
      schema: {
        tags: ["Artifacts"],
        summary: "Buscar item por ID",
        description: "Retorna os detalhes de um item do acervo.",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
              description: "Identificador do item",
            },
          },
        },
        response: {
          200: {
            description: "Item encontrado",
            type: "object",
            properties: {
              id: { type: "string" },
              inventoryNumber: { type: "string" },
              title: { type: "string" },
              description: { type: "string", nullable: true },
              objectType: { type: "string" },
              material: { type: "string", nullable: true },
              period: { type: "string", nullable: true },
              date: { type: "string", nullable: true },
              culture: { type: "string", nullable: true },
              provenance: { type: "string", nullable: true },
              institution: { type: "string", nullable: true },
              imageUrl: { type: "string", nullable: true },
              externalSource: { type: "string", nullable: true },
              externalId: { type: "string", nullable: true },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          404: {
            description: "Item não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
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
  }>(
    "/artifacts",
    {
      schema: {
        tags: ["Artifacts"],
        summary: "Cadastrar item",
        description: "Cria um novo item no acervo digital.",
        body: {
          type: "object",
          required: ["inventoryNumber", "title", "objectType"],
          properties: {
            inventoryNumber: {
              type: "string",
              description: "Número de inventário único",
            },
            title: {
              type: "string",
              description: "Título ou nome do item",
            },
            objectType: {
              type: "string",
              description: "Tipo de objeto",
            },
            description: { type: "string" },
            material: { type: "string" },
            period: { type: "string" },
            date: { type: "string" },
            culture: { type: "string" },
            provenance: { type: "string" },
            institution: { type: "string" },
            imageUrl: { type: "string" },
            externalSource: { type: "string" },
            externalId: { type: "string" },
          },
        },
        response: {
          201: {
            description: "Item criado com sucesso",
            type: "object",
            properties: {
              id: { type: "string" },
              inventoryNumber: { type: "string" },
              title: { type: "string" },
              objectType: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const artifact = await prisma.artifact.create({
        data: request.body,
      });

      return reply.code(201).send(artifact);
    }
  );

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
  }>(
    "/artifacts/:id",
    {
      schema: {
        tags: ["Artifacts"],
        summary: "Atualizar item",
        description: "Atualiza um ou mais campos de um item.",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          minProperties: 1,
          properties: {
            inventoryNumber: { type: "string" },
            title: { type: "string" },
            objectType: { type: "string" },
            description: { type: "string" },
            material: { type: "string" },
            period: { type: "string" },
            date: { type: "string" },
            culture: { type: "string" },
            provenance: { type: "string" },
            institution: { type: "string" },
            imageUrl: { type: "string" },
            externalSource: { type: "string" },
            externalId: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Item atualizado",
            type: "object",
            properties: {
              id: { type: "string" },
              inventoryNumber: { type: "string" },
              title: { type: "string" },
              objectType: { type: "string" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          404: {
            description: "Item não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
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

      const artifact = await prisma.artifact.update({
        where: { id },
        data: request.body,
      });

      return artifact;
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/artifacts/:id",
    {
      schema: {
        tags: ["Artifacts"],
        summary: "Excluir item",
        description: "Remove um item do acervo digital.",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
              description: "Identificador do item",
            },
          },
        },
        response: {
          204: {
            description: "Item excluído com sucesso",
            properties: {
              message: { type: "string" },
            },
          },
          404: {
            description: "Item não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
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
