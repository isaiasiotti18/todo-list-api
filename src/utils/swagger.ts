import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List API",
      version,
      description:
        "API para gerenciamento de tarefas (todos) com autenticação JWT",
    },
    servers: [{ url: "http://localhost:3005", description: "Desenvolvimento" }],
    tags: [
      { name: "Health", description: "Verificação de saúde da API" },
      { name: "Auth", description: "Autenticação e registro" },
      { name: "Users", description: "Gerenciamento de usuários" },
      { name: "Todos", description: "Gerenciamento de tarefas" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "João Silva" },
            email: { type: "string", example: "joao@email.com" },
            username: { type: "string", example: "joaosilva" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Todo: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Comprar leite" },
            description: { type: "string", nullable: true },
            endDate: { type: "string", format: "date-time", nullable: true },
            categoryId: { type: "integer", nullable: true },
            status: {
              type: "string",
              enum: [
                "in_planning",
                "in_progress",
                "completed",
                "canceled",
                "archived",
              ],
            },
            userId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        TodoWithCategory: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            endDate: { type: "string", format: "date-time", nullable: true },
            categoryId: { type: "integer", nullable: true },
            categoryName: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: {
              description: "API está funcionando",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      timestamp: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Realizar login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "joao@email.com",
                    },
                    password: { type: "string", example: "Senha@123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login realizado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Credenciais inválidas" },
            429: { description: "Muitas tentativas" },
          },
        },
      },
      "/api/v1/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Registrar usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "name",
                    "username",
                    "email",
                    "password",
                    "confirmPassword",
                  ],
                  properties: {
                    name: {
                      type: "string",
                      minLength: 3,
                      example: "João Silva",
                    },
                    username: {
                      type: "string",
                      minLength: 5,
                      example: "joaosilva",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "joao@email.com",
                    },
                    password: {
                      type: "string",
                      minLength: 8,
                      example: "Senha@123",
                      description:
                        "Mín 8 chars, 1 maiúscula, 1 número, 1 especial",
                    },
                    confirmPassword: { type: "string", example: "Senha@123" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Usuário registrado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            400: { description: "Dados inválidos" },
            409: { description: "Usuário já existe" },
          },
        },
      },
      "/api/v1/auth/token/{idUser}": {
        get: {
          tags: ["Auth"],
          summary: "Obter novo token",
          parameters: [
            {
              name: "idUser",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Token gerado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { token: { type: "string" } },
                  },
                },
              },
            },
            404: { description: "Usuário não encontrado" },
          },
        },
      },
      "/api/v1/user/create": {
        post: {
          tags: ["Users"],
          summary: "Criar usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "username", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Usuário criado" },
            409: { description: "Usuário já existe" },
          },
        },
      },
      "/api/v1/user/get": {
        get: {
          tags: ["Users"],
          summary: "Listar usuários",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "pageSize",
              in: "query",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "orderBy",
              in: "query",
              schema: { type: "string", enum: ["asc", "desc"] },
            },
            { name: "filter", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Lista de usuários",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/user/get/self": {
        get: {
          tags: ["Users"],
          summary: "Obter dados do usuário logado",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Dados do usuário",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            401: { description: "Não autenticado" },
          },
        },
      },
      "/api/v1/user/get/{userId}": {
        get: {
          tags: ["Users"],
          summary: "Obter usuário por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Dados do usuário",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            401: { description: "Não autenticado" },
            404: { description: "Usuário não encontrado" },
          },
        },
      },
      "/api/v1/user/update": {
        put: {
          tags: ["Users"],
          summary: "Atualizar usuário",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    username: { type: "string" },
                    password: { type: "string" },
                    currentPassword: {
                      type: "string",
                      description: "Obrigatório se password for informado",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Usuário atualizado" },
            401: { description: "Não autenticado" },
            404: { description: "Usuário não encontrado" },
          },
        },
      },
      "/api/v1/user/delete/{userId}": {
        delete: {
          tags: ["Users"],
          summary: "Deletar usuário (soft delete)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Usuário deletado" },
            401: { description: "Não autenticado" },
            404: { description: "Usuário não encontrado" },
          },
        },
      },
      "/api/v1/todo/create": {
        post: {
          tags: ["Todos"],
          summary: "Criar tarefa",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: { type: "string", example: "Comprar leite" },
                    description: { type: "string" },
                    endDate: { type: "string", format: "date-time" },
                    categoryId: { type: "integer", example: 1 },
                    status: {
                      type: "string",
                      enum: [
                        "in_planning",
                        "in_progress",
                        "completed",
                        "canceled",
                        "archived",
                      ],
                      default: "in_planning",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Tarefa criada",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Todo" },
                  },
                },
              },
            },
            401: { description: "Não autenticado" },
            409: { description: "Erro ao criar" },
          },
        },
      },
      "/api/v1/todo/get": {
        get: {
          tags: ["Todos"],
          summary: "Listar tarefas do usuário",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "pageSize", in: "query", schema: { type: "integer" } },
            {
              name: "orderBy",
              in: "query",
              schema: { type: "string", enum: ["asc", "desc"] },
            },
            {
              name: "filter",
              in: "query",
              schema: { type: "string" },
              description: "Busca por título ou descrição",
            },
            { name: "categoryId", in: "query", schema: { type: "integer" } },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: [
                  "in_planning",
                  "in_progress",
                  "completed",
                  "canceled",
                  "archived",
                ],
              },
            },
          ],
          responses: {
            200: {
              description: "Lista de tarefas paginada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/TodoWithCategory",
                        },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          page: { type: "integer" },
                          pageSize: { type: "integer" },
                          total: { type: "integer" },
                          totalPages: { type: "integer" },
                          hasNextPage: { type: "boolean" },
                          hasPreviousPage: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Não autenticado" },
          },
        },
      },
      "/api/v1/todo/get/{todoId}": {
        get: {
          tags: ["Todos"],
          summary: "Obter tarefa por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "todoId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Dados da tarefa",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Todo" },
                  },
                },
              },
            },
            401: { description: "Não autenticado" },
            404: { description: "Tarefa não encontrada" },
          },
        },
      },
      "/api/v1/todo/update/{todoId}": {
        put: {
          tags: ["Todos"],
          summary: "Atualizar tarefa",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "todoId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    status: {
                      type: "string",
                      enum: [
                        "in_planning",
                        "in_progress",
                        "completed",
                        "canceled",
                        "archived",
                      ],
                    },
                    endDate: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Tarefa atualizada" },
            401: { description: "Não autenticado" },
            404: { description: "Tarefa não encontrada" },
          },
        },
      },
      "/api/v1/todo/delete/{todoId}": {
        delete: {
          tags: ["Todos"],
          summary: "Deletar tarefa (soft delete)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "todoId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Tarefa deletada" },
            401: { description: "Não autenticado" },
            404: { description: "Tarefa não encontrada" },
            409: { description: "Tarefa já deletada" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Todo List API - Docs",
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );

  app.get("/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export { swaggerSpec };
