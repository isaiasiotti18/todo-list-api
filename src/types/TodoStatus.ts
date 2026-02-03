import { todos } from "../db/schema";
import { z } from "zod";

export type TodoStatus = (typeof todos.status.enumValues)[number];

export const todoStatusSchema = z.enum(todos.status.enumValues);
