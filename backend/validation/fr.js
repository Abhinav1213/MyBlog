import { z } from "zod";
import {
  user_id_schema,
  fr_req_id_schema,
} from "../schema/property_schema_for_validation.js";

export const send_fr_userid_schema = z.object({
  user_id: user_id_schema,
});

export const handle_fr_requestid_schema = z.object({
  request_id: fr_req_id_schema,
});
