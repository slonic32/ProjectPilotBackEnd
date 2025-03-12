import Joi from "joi";

const emailRegexp = /^\S+@\S+\.\S+$/;
const phoneRegexp = /^\+?[\d\s().-]{4,19}$/;

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(4).max(22).required(),
  name: Joi.string().required(),
  phone: Joi.string().pattern(phoneRegexp),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(4).max(22).required(),
});

const refreshSchema = Joi.object({
  refreshtoken: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.string().pattern(phoneRegexp),
  avatar: Joi.string(),
});

export const Schemas = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  refreshSchema,
};
