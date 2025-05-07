import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
  return value;
};

export const planningSchemas = {
  planScopeManagement: Joi.object({
    scopeManagementPlan: Joi.object({
      projectScopeStatement: Joi.string().required(),
      WBS: Joi.string().required(),
      scopeBaseline: Joi.string().required(),
      projectDeliverables: Joi.string().required(),
    }),
    requirementsManagementPlan: Joi.object({
      requirementActivities: Joi.string().required(),
      changesManagedApproved: Joi.string().required(),
      requirementPrioritised: Joi.string().required(),
      metricsUsed: Joi.string().required(),
    }),
  }),

  collectRequirements: Joi.object({
    requirements: Joi.array()
      .items(
        Joi.object({
          requirement: Joi.string().required(),
          documentation: Joi.string().required(),
        })
      )
      .required(),
  }),

  defineScope: Joi.object({
    endProductScopeDescription: Joi.string().required(),
    deliverables: Joi.array().items(Joi.string().custom(objectIdValidator)),
    acceptanceCriteria: Joi.array().items(Joi.string().required()),
    exclusions: Joi.array().items(Joi.string().required()),
  }),

  createWBS: Joi.object({
    WBS: Joi.array().items(Joi.string().custom(objectIdValidator)).required(),
  }),
};
