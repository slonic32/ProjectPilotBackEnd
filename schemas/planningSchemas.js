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

  planScheduleManagement: Joi.object({
    scheduleManagementPlan: Joi.object({
      changeOfSchedule: Joi.string().required(),
      levelOfDetail: Joi.string().required(),
      dependencies: Joi.string().required(),
      unitsOfMeasure: Joi.string().required(),
      requestsForChanges: Joi.string().required(),
    }).required(),
  }),

  planCostManagement: Joi.object({
    costManagementPlan: Joi.object({
      units: Joi.array().items(Joi.string()),
      precision: Joi.array().items(Joi.string()),
      ranges: Joi.array().items(Joi.string()),
      rules: Joi.array().items(Joi.string()),
      reportingFormatsFrequency: Joi.array().items(Joi.string()),
    }).required(),
  }),

  estimateCost: Joi.object({
    costEstimates: Joi.array()
      .items(
        Joi.object({
          activity: Joi.string().custom(objectIdValidator).required(),
          labor: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          materials: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          equipment: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          facilities: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          subcontractor: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          travel: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          reserve: Joi.array()
            .items(
              Joi.object({
                name: Joi.string().required(),
                cost: Joi.number().min(0).default(0),
              })
            )
            .default([]),
          costOfActivity: Joi.number().min(0).default(0),
        })
      )
      .required(),
  }),

  determineBudget: Joi.object({
    costBaseline: Joi.number().min(0).required(),
    projectFundingRequirements: Joi.array()
      .items(
        Joi.object({
          period: Joi.string().required(),
          cost: Joi.number().min(0).required(),
        })
      )
      .required(),
  }),

  planResourceManagement: Joi.object({
    resourceManagementPlan: Joi.object({
      identified: Joi.string().allow(""),
      obtained: Joi.string().allow(""),
      roles: Joi.string().allow(""),
      training: Joi.string().allow(""),
      ensured: Joi.string().allow(""),
    }).required(),
  }),

  estimateActivityResource: Joi.object({
    resourceRequireMents: Joi.array()
      .items(
        Joi.object({
          timePeriod: Joi.string().allow(""),
          resource: Joi.string().allow(""),
          expectedUse: Joi.number().min(0),
          units: Joi.string().allow(""),
        })
      )
      .required(),
    basisOfEstimates: Joi.string().allow(""),
  }),
};
