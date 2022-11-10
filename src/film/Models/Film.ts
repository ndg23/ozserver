import * as mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  url: { type: String },
  key: { type: String }
});

export const FilmSchema = new mongoose.Schema({
  title: { type: String, max: 20 },
  desc: { type: String, min: 10 },
  cover: { type: String, default: "/" },
  type: { type: String },
  views: [{ type: String }],
  created_date: { type: String },
  createdBy: { type: String, ref: "User" },
  actor: { type: String, min: 5 },
  media: VideoSchema
});
