import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { secret } from "../common/constants/index";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from '../user/user';
import { UserSchema } from '../user/Model/User';
@Module({
  providers: [AuthService,UserService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: "1d" }
    })
  ]
})
export class AuthModule {}
