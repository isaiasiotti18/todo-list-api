import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    username: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    // Índice para busca por email (já tem unique, mas explícito)
    emailIdx: index("email_idx").on(table.email),
    // Índice para busca por username
    usernameIdx: index("username_idx").on(table.username),
  }),
);

export const categories = mysqlTable(
  "categories",
  {
    id: int().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    isSystem: boolean("is_system").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("name_idx").on(table.name),
  }),
);

export const todoStatusEnum = mysqlEnum("todo_status", [
  "in_planning",
  "in_progress",
  "completed",
  "canceled",
  "archived",
]);

export const todos = mysqlTable(
  "todos",
  {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    endDate: timestamp("end_date"),
    categoryId: int("category_id").notNull().default(1),
    status: todoStatusEnum.notNull().default("in_planning"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    userId: int("user_id").notNull(),
  },
  (table) => ({
    // Índice composto: userId + deletedAt + createdAt (ordem importa!)
    userDeletedCreatedIdx: index("user_deleted_created_idx").on(
      table.userId,
      table.deletedAt,
      table.createdAt,
    ),

    // Índice para foreign key de categoria
    categoryIdIdx: index("category_id_idx").on(table.categoryId),

    // Índices para busca de texto (LIKE queries)
    titleIdx: index("title_idx").on(table.title),
    descriptionIdx: index("description_idx").on(table.description),

    // Índice para filtro por data de término
    endDateIdx: index("end_date_idx").on(table.endDate),

    // Índice composto para userId + categoryId (se filtrar por categoria específica)
    userCategoryIdx: index("user_category_idx").on(
      table.userId,
      table.categoryId,
    ),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  todos: many(todos),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [todos.categoryId],
    references: [categories.id],
  }),
}));
