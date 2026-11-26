import { z } from "zod";
const list = z.array(z.string().trim().min(1)).default([]);
export const TemplateInput = z.object({
  name: z.string().trim().min(2, "Name is required"), slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, dashes").optional(),
  description: z.string().trim().min(10, "Add a short description"), category: z.string().min(2, "Choose a category"), type: z.string().default(""), style: z.string().default("Modern"),
  tech: list, features: list, tags: list, price: z.number().min(0, "Price must be 0 or more").max(10000), previewUrl: z.string().default(""), screenshots: list,
  demoUrl: z.string().default(""), filePath: z.string().nullable().optional(), badge: z.enum(["", "featured", "popular", "new"]).default(""), status: z.enum(["published", "draft", "archived"]).default("published"),
});
