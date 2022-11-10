import { Injectable, HttpStatus, Res } from "@nestjs/common";
import { Model } from "mongoose";
import { Iuser } from "./Interface/interface.user";
import { InjectModel } from "@nestjs/mongoose";
import * as bc from "bcrypt";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") readonly user: Model<Iuser>,
    private auth: AuthService
  ) {}
  async findByEmail(email: string): Promise<Iuser> {
    return this.user.findOne({ email }).then(
      (res) => {
        return res;
      },
      (err) => {
        return err;
      }
    );
  }
  async findById(id: string) {
    try {
      const us = await this.user.findById({ _id: id });
      return us;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  updateUser(data: any, id: string, res: any) {
    try {
      this.user
        .findByIdAndUpdate(id, { $set: { data } }, { new: true })
        .then((user) => {
          return res.status(HttpStatus.CREATED).json({ message: "Updated" });
        });
    } catch (error) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Updated", error });
    }
  }
  removeUser(id: string, res) {
    try {
      this.user.findByIdAndDelete({ _id: id }).then((data) => {
        return res.status(HttpStatus.OK).json({ message: "Removed", data });
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({ error });
    }
  }
  async createUser(data, res) {
    const { password, email, tel } = data;
    try {
      const userExist = await this.user.find({
        $or: [{ email: email, tel: tel }]
      });
      console.log(userExist);
      if (!!userExist) {
        return res.status(HttpStatus.CONFLICT).json("User exist");
      }
      const salt = await bc.genSalt(8);
      const hashPass = await bc.hash(password, salt);
      const Us = new this.user(data);
      Object.assign(new this.user(data), { password: hashPass });
      await Us.save();
      this.auth.signinUser({email, password}).then((payload) => {
        return res
          .status(HttpStatus.CREATED)
          .json({ user: data,payload:payload, message: "User created !" });
      }) 
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Server error");
    }
  }
  uploadMedia() {}
  watchMedia() {}
}
