import { z } from "zod";

export const createNewUserSchema = z.object({
  name: z.string({ error: "Name is required" }),
  email: z.email({ error: "Email is required" }),
  username: z.string({ error: "Username is required" }),
  password: z.string({ error: "Password is required" }),
});

export type CreateNewUserDTO = z.infer<typeof createNewUserSchema>;
