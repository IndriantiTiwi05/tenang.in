import { z } from "zod";

export const registerSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").trim(),
  email: z.string().email("Format email tidak valid").trim().toLowerCase(),
  password: z.string().min(6, "Password minimal 6 karakter").trim(),
});