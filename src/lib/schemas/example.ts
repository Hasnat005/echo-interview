import { z } from "zod";

export const exampleSchema = z.object({
  email: z.string().email(),
  consent: z.boolean().default(false),
});

export type ExampleInput = z.infer<typeof exampleSchema>;
