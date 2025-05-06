import { Schema, model } from "mongoose";

const workSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  work: {
    type: [{ type: Schema.Types.ObjectId, ref: "works" }],
    default: [],
  },
  deliverable: {
    type: Schema.Types.ObjectId,
    ref: "deliverables",
    default: null,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
});

export const Work = model("works", workSchema);
