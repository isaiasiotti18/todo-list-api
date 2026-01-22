import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.email().optional(),
    username: z.string().optional(),
    password: z.string().min(8).optional(),
    currentPassword: z.string().optional(),
  })
  .refine((data) => !data.password || !!data.currentPassword, {
    message: "currentPassword is required when changing password",
    path: ["currentPassword"],
  });

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
