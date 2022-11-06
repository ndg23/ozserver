
import * as mongoose from 'mongoose'
export const Episode = new mongoose.Schema({
  title: { type: String, min: 5 },
  desc_episode: { type: String, min: 5 },
  video: { type: String},
  views: { type: Number }
});