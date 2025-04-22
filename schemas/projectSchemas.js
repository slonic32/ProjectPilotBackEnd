import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const projectBase = {
  name: Joi.string().trim().required(),
  startDate: Joi.string().optional(), // optional, default is auto
  acs: Joi.object({
    initiating: Joi.array().items(Joi.string().custom(objectIdValidator)),
    planning: Joi.array().items(Joi.string().custom(objectIdValidator)),
    executing: Joi.array().items(Joi.string().custom(objectIdValidator)),
    monitoring: Joi.array().items(Joi.string().custom(objectIdValidator)),
    closing: Joi.array().items(Joi.string().custom(objectIdValidator)),
  }).optional(),
  closed: Joi.boolean().optional(),
};

export const projectSchemas = {
  create: Joi.object(projectBase),
  update: Joi.object({ ...projectBase }).fork(
    Object.keys(projectBase),
    (schema) => schema.optional()
  ),
};
