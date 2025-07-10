import {z} from "zod";
import { user_id_schema } from "../schema/property_schema_for_validation.js";

export const send_fr_userid_schema = z.object({
    user_id: user_id_schema
});