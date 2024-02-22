import { z } from "zod";

export const UserSchema = z.object({
  events: z
    .array(
      z.object({
        title: z.string().readonly(),
        days: z.array(z.boolean()),
      })
    )
    .optional(),
});
export type createUserData = z.infer<typeof UserSchema>;
