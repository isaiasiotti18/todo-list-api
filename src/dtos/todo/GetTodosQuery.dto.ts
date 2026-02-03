import { z } from "zod";
import { todoStatusSchema } from "../../types/TodoStatus";

export const getTodosQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
  filter: z.string().optional().default(""),
  categoryId: z.coerce.number().int().positive().optional(),
  status: todoStatusSchema.optional(),
});

export type GetTodosQueryDTO = z.infer<typeof getTodosQuerySchema>;
