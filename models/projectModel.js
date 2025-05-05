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
          majorDeliverables: { type: String },
          acceptanceCriteria: { type: String },
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
