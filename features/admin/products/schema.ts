import { z } from "zod";

export const sortingStateSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  }).optional(),
);
