import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./Model/User";

@Module({
  controllers: [UserController],
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])]
})
export class UserModule {}
