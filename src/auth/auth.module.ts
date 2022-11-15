import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/Model/User";
import { UserService } from "../user/user.service";

@Module({
  imports: [
   forwardRef(()=>UserModule),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
