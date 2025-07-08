import { z } from "zod";

export const bearerSchema = z.object({
  authorization: z.string().startsWith("Bearer ", {
    message: "Authorization must start with 'Bearer '",
  }),
});
