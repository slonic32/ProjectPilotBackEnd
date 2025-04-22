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
      default: () => localDate(),
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
