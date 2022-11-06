import { HttpStatus, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verify.token";
import { UserService } from '../../user/user';

export class AuthMiddleware implements NestMiddleware {
  constructor(private us: UserService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    try {
      const token = req.headers["token"] || req.headers["auth_token"];
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          const userComplete = await this.us.findById(payload?.id);
          if (userComplete) {
            req["user"] = userComplete;
            next(req);
          }
          return res.status(HttpStatus.UNAUTHORIZED).json("User not found");
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json("User not found");
        }
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json("Token not found");
      }
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json(error.message);
    }
  }
}