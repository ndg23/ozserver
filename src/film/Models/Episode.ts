import * as mongoose from "mongoose";
export const Episode = new mongoose.Schema({
  title: { type: String, min: 5 },
  desc: { type: String, min: 5 },
  views: [{ type: Number, ref: "User" }],
  key: { type: String },
  url: { type: String }
});
