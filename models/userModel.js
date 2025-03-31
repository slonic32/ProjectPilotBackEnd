import Joi from "joi";
import { model, Schema } from "mongoose";

const emailRegexp = /^\S+@\S+\.\S+$/;

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

const addSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(4).max(22).required(),
  name: Joi.string(),
  phone: Joi.string(),
  admin: Joi.boolean(),
  pm: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(4).max(22).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(4).max(22),
  avatarURL: Joi.string(),
  name: Joi.string(),
  phone: Joi.string(),
  admin: Joi.boolean(),
  pm: Joi.boolean(),
});

export const Schemas = {
  addSchema,
  loginSchema,
  updateUserSchema,
  refreshSchema,
};
export const User = model("users", userSchema);
