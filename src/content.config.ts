import { defineCollection, z } from "astro:content";
import { announcementLoader } from "./loaders/announcement-loader";

const announcements = defineCollection({
  loader: announcementLoader("./src/content/announcements"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default("General"),
    summary: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { announcements };
