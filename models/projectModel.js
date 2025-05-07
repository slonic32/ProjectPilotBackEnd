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
