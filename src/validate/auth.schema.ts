import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, "Name is required")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(70, "Name must not exceed 70 characters")
      .regex(/^[A-Za-z ]+$/, "Name should contain only letters"),
    email: z
      .email("Invalid email format")
      .min(1, "Email is required")
      .trim()
      .toLowerCase(),
    password: z
      .string({ error: "Password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
        "Password must be 8-100 characters and contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    whatsAppNumber: z
      .string({ error: "Phone number is required" })
      .regex(/^(?:\+94|94|0)?7[0-9]{8}$/, "Invalid Sri Lankan phone number"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .email("Invalid email format")
      .min(1, "Email is required")
      .trim()
      .toLowerCase(),
  }),
  password: z
    .string({ error: "Password is required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
      "Password must be 8-100 characters and contain at least one uppercase letter, one lowercase letter, and one number",
    )
});

export type RegisterSchema = z.infer<typeof registerSchema>["body"];
