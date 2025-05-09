import { Schema, model } from "mongoose";

const activitySchema = new Schema({
  workPackage: {
    type: Schema.Types.ObjectId,
    ref: "works",
    required: true,
  },
  name: { type: String, required: true },
  initialScopeDescription: { type: String, default: "" },
  detailedScopeDescription: { type: String, default: "" },
  predecessorActivities: {
    type: [{ type: Schema.Types.ObjectId, ref: "activities" }],
    default: [],
  },
  resourceRequirements: {
    type: [String],
    default: [],
  },
  duration: {
    type: Number,
    default: 0,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
});

export const Activity = model("activities", activitySchema);
