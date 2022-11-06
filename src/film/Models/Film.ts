import * as mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  url: { type: String },
  length: { type: String },
  size: { type: String }
});

export const FilmSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 20 },
  desc: { type: String, min: 10 },
  cover: { type: String, min: 10, default: "/" },
  type: { type: String },
  time: { type: Number },
  actor: { type: String, min: 5 },
  video: { type: String }
});
