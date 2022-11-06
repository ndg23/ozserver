import * as jwt from "jsonwebtoken";
import { secret } from '../constants/index';
export const verifyToken = async (token: any): Promise<any> => {
  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      throw err;
    }
    return payload;
  });
};
