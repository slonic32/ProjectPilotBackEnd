import Joi from "joi";

const emailRegexp = /^\S+@\S+\.\S+$/;

const addSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(4).max(22).required(),
  name: Joi.string().trim(),
  phone: Joi.string().trim(),
  admin: Joi.boolean(),
  pm: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(22).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().allow("").optional(),
  email: Joi.string().trim().allow("").email().optional(),
  password: Joi.string()
    .trim()
    .allow("")
    .optional()
    .custom((value, helpers) => {
      if (!value || (value.length >= 4 && value.length <= 22)) {
        return value;
      }
      return helpers.error("any.invalid", {
        message: "Password must be between 4 and 22 characters long",
      });
    }),
  phone: Joi.string().trim().allow("").optional(),
  admin: Joi.boolean().optional(),
  pm: Joi.boolean().optional(),
});

export const Schemas = {
  addSchema,
  loginSchema,
  updateUserSchema,
  refreshSchema,
};
