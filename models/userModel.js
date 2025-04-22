import Joi from "joi";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    avatarURL: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    pm: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model("users", userSchema);
