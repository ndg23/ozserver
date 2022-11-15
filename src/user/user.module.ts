import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./Model/User";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";

import { AuthService } from "../auth/auth.service";

@Module({
  providers: [UserService],
  exports: [UserService, MongooseModule],
  imports: [
  
    MongooseModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])
  ],
  controllers: [UserController]
})
export class UserModule {}
