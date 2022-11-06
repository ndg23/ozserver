import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  @Post("signin")
  login(@Body() body: AuthDto, @Res() res, @Req() req) {
    try {
      
    } catch (err) {}
  }
}
