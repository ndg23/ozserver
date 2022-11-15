import * as mongoose from "mongoose";
import { RoleUser } from "src/common/enums/role.enum";
export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email required"]
  },
  role: { type: String, enum: [RoleUser.AD, RoleUser.CM, RoleUser.DI] },
  tel: { type: String, unique: true },
  password: { type: String, lowercase: true, min: 4 },
  country: { type: String },
  sexe: { type: String },
  pic_profile: { type: String },
  content_serie: [{ type: String, ref: "Serie" }],
  content_film: [{ type: String, ref: "Film" }]
});
