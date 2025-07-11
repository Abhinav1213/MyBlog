import { z } from "zod";
import {
  user_username_schema,
  // user_id_schema,
  fr_req_id_schema,
} from "../schema/property_schema_for_validation.js";

// export const send_fr_userid_schema = z.object({
//   user_id: user_id_schema,
// });

export const send_fr_username_schema = z.object({
  user_name: user_username_schema,
});

export const update_fr_schema = z
  .object({
    action: z.enum(["accept", "reject"]),
    request_id: fr_req_id_schema,
    sender:user_username_schema
  })
  .strict();

export const get_fr_schema = z
  .object({
    action: z.enum(["sent", "received"]),
  })
  .strict();
