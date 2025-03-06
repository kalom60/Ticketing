import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages: { [key: string]: string[] } = {};

      result.error.errors.forEach((err) => {
        if (!errorMessages[err.path[0]]) {
          errorMessages[err.path[0]] = [];
        }
        errorMessages[err.path[0]].push(err.message);
      });

      return res.status(400).json({ errors: errorMessages });
    }

    next();
  };

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z
    .enum(["user", "admin"])
    .optional()
    .refine(
      (role) => role === undefined || role === "user" || role === "admin",
      {
        message: "Role must be either 'user' or 'admin'",
      },
    ),
});

export const ticketSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(["Open", "In Progress", "Closed"], {
    errorMap: () => {
      return {
        message:
          "Status is required and must be one of: Open, In Progress, or Closed",
      };
    },
  }),
});

export const updateTicketSchema = ticketSchema.partial().pick({
  status: true,
});
