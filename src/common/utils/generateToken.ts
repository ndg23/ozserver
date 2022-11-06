import * as jwt from "jsonwebtoken";
import { secret } from "../constants/index";

export const getToken = async (payload: any) => {
  return jwt.sign(payload, secret);
};
