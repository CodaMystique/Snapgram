import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(1).max(30),
  username: z.string().min(1).max(30),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/),
});

export const LoginValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/),
});

export const ProfileValidation = z.object({
  file: z.custom(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

export const PostValidation = (isRequired) =>
  z.object({
    caption: z
      .string()
      .min(5, { message: "Minimum 5 characters." })
      .max(2200, { message: "Maximum 2,200 characters" }),
    file: isRequired
      ? z.any().refine((val) => val && val.length > 0, {
          message: "File is required",
        })
      : z.any(),
    location: z
      .string()
      .min(1, { message: "This field is required" })
      .max(1000, { message: "Maximum 1000 characters." }),
    tags: z.string(),
  });
