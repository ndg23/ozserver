import { Document } from "mongoose";
import { Episode } from "../Models/Episode";
export interface Iserie extends Document {
  title: String;
  desc: String;
  Epidesc:String;
  Epititle:String;
  cover: String;
  type: String;
  productor_id: String;
  date: String;
  episode: Array<any>;
}
