import { Document } from "mongoose";
export interface Iserie extends Document{
  title: String;
  desc: String;
  illustration: String;
  type: String;
  productor_id: String;
  date: String;
}