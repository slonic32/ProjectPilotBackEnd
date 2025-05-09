import Joi from "joi";
import mongoose from "mongoose";

export const activitySchema = Joi.object({
  workPackage: Joi.string().custom((val, helpers) =>
    mongoose.Types.ObjectId.isValid(val)
      ? val
      : helpers.error("Invalid ObjectId")
  ),
  name: Joi.string().required(),
  initialScopeDescription: Joi.string().allow("").optional(),
  detailedScopeDescription: Joi.string().allow("").optional(),
  predecessorActivities: Joi.array().items(Joi.string()),
  resourceRequirements: Joi.array().items(Joi.string()),
  duration: Joi.number().min(0),
  project: Joi.string().required(),
});
