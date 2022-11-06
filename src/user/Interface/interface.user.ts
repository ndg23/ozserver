import { Document } from "mongoose";
export interface Iuser extends Document {
  readonly name: string;
  readonly role: string;
  readonly tel: string;
  readonly password: string;
  readonly country: string;
  readonly sexe: string;
}
