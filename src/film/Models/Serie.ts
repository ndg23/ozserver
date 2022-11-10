import * as mongoose from "mongoose";
import { MediaType } from "../../common/enums/film.enum";
import { Episode } from "./Episode";
export const SerieSchema = new mongoose.Schema({
  title: { type: String, max: 20 },
  desc: { type: String, min: 10 },
  cover: { type: String, min: 10, default: "/" },
  genre: { type: String, enum: [MediaType.SE], default: MediaType.SE },
  type: { type: String, enum: [MediaType.SE], default: MediaType.SE },
  createdBy: { type: String, ref: "User" },
  nb_episode: { type: String, min: 1 },
  view_serie: [{ type: String }],
  episode: [Episode]
});
