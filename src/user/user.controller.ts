import { Body, Controller, Post, Res, HttpStatus } from "@nestjs/common";
import { UserDto } from "./Dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private us: UserService) {}
  @Post("create")
  async newUser(@Body() body: UserDto, @Res() res) {
    try {
     return await this.us.createUser(body,res)
    } catch (error: any) {
      console.log(error);
    }
  }

}
