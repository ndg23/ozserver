import * as mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  password: {
    type: String
  },
  email: {
    type: String
  }
});
