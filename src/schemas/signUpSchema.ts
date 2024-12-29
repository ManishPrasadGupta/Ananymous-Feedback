import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2,"username must be atleast 2 charcter")
    .max(10,"username should not be more than 10 charcter")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")


export const signUpSchema = z.object({  
    username: usernameValidation,
  
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  });