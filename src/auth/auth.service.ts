import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bc from "bcrypt";
import { getToken } from '../common/utils/generateToken';
import { AuthDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signinUser(user: AuthDto) {
    try {
      const userFromBdd = await this.userService.findByEmail(user?.email);
      if (userFromBdd && bc.compareSync(user?.password, userFromBdd.password)) {
        const token = getToken(userFromBdd);
        return token;
      }
    } catch (error) {
      console.log(error);
      
    }
  }
}
