import { Body, Controller, Post, Req, Res, HttpStatus } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post("signin")
  login(@Body() body: AuthDto, @Res() res, @Req() req) {
    try {
      this.auth
        .signinUser(body)
        .then((data) => {
          return res.status(HttpStatus.OK).json(data);
        })
        .catch((err) => {
          return res.status(HttpStatus.FORBIDDEN).json(err);
        });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
}
