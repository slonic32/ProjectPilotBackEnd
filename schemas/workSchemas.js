import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const workSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    project: Joi.string().required().custom(objectIdValidator),
    work: Joi.array().items(Joi.string().custom(objectIdValidator)).optional(),
    deliverable: Joi.string().optional().allow(null).custom(objectIdValidator),
  }),
  update: Joi.object({
    name: Joi.string(),
    description: Joi.string().allow(""),
    work: Joi.array().items(Joi.string().custom(objectIdValidator)).optional(),
    deliverable: Joi.string().optional().allow(null).custom(objectIdValidator),
  }),
};
