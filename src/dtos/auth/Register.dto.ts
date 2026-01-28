import { z } from "zod";
import userRoutes from "../../routes/user.routes";

export const registerUserSchema = z
  .object({
    name: z.string().min(3),
    username: z.string().min(5),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
