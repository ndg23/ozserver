import { Injectable, HttpStatus, Res } from "@nestjs/common";
import { Model } from "mongoose";
import { Iuser } from './Interface/interface.user';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') readonly user: Model<Iuser>) {}
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
        return res
          .status(HttpStatus.OK)
          .json({ message: "Removed", data });
      });
    } catch (error) {
      return res
      .status(HttpStatus.FORBIDDEN)
      .json({ error });
  
    }
  }
  uploadMedia() {
    
  }
  watchMedia() {}
}
