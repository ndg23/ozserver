import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./Model/User";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";

import { AuthService } from "../auth/auth.service";

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService],
  imports: [
    
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])
  ],
  exports: [UserModule]
})
export class UserModule {}
