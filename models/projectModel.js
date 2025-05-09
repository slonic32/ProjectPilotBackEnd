import { Schema, model } from "mongoose";

const localDate = () => {
  const milliseconds = Date.now();
  const date = new Date(milliseconds);
  return date.toLocaleDateString();
};

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pm: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    startDate: {
      type: String,
      default: () => new Date(),
    },
    acs: {
      initiating: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
      },
      planning: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
      },
      executing: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
      },
      monitoring: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
      },
      closing: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
      },
    },
    initiating: {
      integration: {
        developProjectCharter: {
          projectTitle: { type: String, default: "" },
          purpose: { type: String, default: "" },
          description: { type: String, default: "" },
          objective: { type: String, default: "" },
          successCriteria: { type: String, default: "" },
          sponsors: { type: [String], default: [] },
          majorDeliverables: { type: String, default: "" },
          acceptanceCriteria: { type: String, default: "" },
          milestone_schedule: {
            type: [
              {
                date: { type: Date, required: true },
                title: { type: String, required: true },
              },
            ],
            default: [],
          },
          keyAssumptions: { type: String, default: "" },
          constraints: { type: [String], default: [] },
          majorRisks: { type: [String], default: [] },
          reportingRequirements: { type: String, default: "" },
          approvalSignature: { type: Boolean, default: false },
          approvalDate: { type: Date },
        },
      },
      stakeholder: {
        identifyStakeholders: {
          identification: { type: [String], default: [] },
          assessment: { type: [String], default: [] },
          classification: { type: [String], default: [] },
        },
      },
    },
    closing: {
      integration: {
        closeProject: {
          closedDate: { type: Date },
        },
      },
    },
    planning: {
      scope: {
        planScopeManagement: {
          scopeManagementPlan: {
            type: {
              projectScopeStatement: { type: String, required: true },
              WBS: { type: String, required: true },
              scopeBaseline: { type: String, required: true },
              projectDeliverables: { type: String, required: true },
            },
            default: {},
          },
          requirementsManagementPlan: {
            type: {
              requirementActivities: { type: String, required: true },
              changesManagedApproved: { type: String, required: true },
              requirementPrioritised: { type: String, required: true },
              metricsUsed: { type: String, required: true },
            },
            default: {},
          },
        },
        collectRequirements: {
          requirements: {
            type: [
              {
                requirement: { type: String, required: true },
                documentation: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
        defineScope: {
          endProductScopeDescription: {
            type: String,
            default: "",
          },
          deliverables: {
            type: [{ type: Schema.Types.ObjectId, ref: "deliverables" }],
            default: [],
          },
          acceptanceCriteria: {
            type: [{ type: String, required: true }],
            default: [],
          },
          exclusions: {
            type: [{ type: String, required: true }],
            default: [],
          },
        },
        createWBS: {
          WBS: {
            type: [{ type: Schema.Types.ObjectId, ref: "works" }],
            default: [],
          },
        },
      },
      schedule: {
        planScheduleManagement: {
          scheduleManagementPlan: {
            type: {
              changeOfSchedule: { type: String, required: true },
              levelOfDetail: { type: String, required: true },
              dependencies: { type: String, required: true },
              unitsOfMeasure: { type: String, required: true },
              requestsForChanges: { type: String, required: true },
            },
            default: {},
          },
        },
      },
      cost: {
        planCostManagement: {
          costManagementPlan: {
            type: {
              units: { type: [String], default: [] },
              precision: { type: [String], default: [] },
              ranges: { type: [String], default: [] },
              rules: { type: [String], default: [] },
              reportingFormatsFrequency: { type: [String], default: [] },
            },
            default: {},
          },
        },
        estimateCost: {
          costEstimates: {
            type: [
              {
                activity: {
                  type: Schema.Types.ObjectId,
                  ref: "activities",
                  required: true,
                },
                labor: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                materials: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                equipment: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                facilities: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                subcontractor: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                travel: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                reserve: {
                  type: [
                    {
                      name: { type: String, required: true },
                      cost: { type: Number, default: 0 },
                    },
                  ],
                  default: [],
                },
                costOfActivity: {
                  type: Number,
                  default: 0,
                },
              },
            ],
            default: [],
          },
        },
        determineBudget: {
          costBaseline: {
            type: Number,
            default: 0,
          },
          projectFundingRequirements: {
            type: [
              {
                period: { type: String, required: true },
                cost: { type: Number, default: 0 },
              },
            ],
            default: [],
          },
        },
      },
      resource: {
        planResourceManagement: {
          resourceManagementPlan: {
            type: {
              identified: { type: String, default: "" },
              obtained: { type: String, default: "" },
              roles: { type: String, default: "" },
              training: { type: String, default: "" },
              ensured: { type: String, default: "" },
            },
            default: {},
          },
        },
        estimateActivityResource: {
          resourceRequireMents: {
            type: [
              {
                timePeriod: { type: String, default: "" },
                resource: { type: String, default: "" },
                expectedUse: { type: Number, default: 0 },
                units: { type: String, default: "" },
              },
            ],
            default: [],
          },
          basisOfEstimates: { type: String, default: "" },
        },
      },
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Project = model("projects", projectSchema);
