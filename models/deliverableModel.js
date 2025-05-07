import { Schema, model } from "mongoose";

const deliverableSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  project: {
    type: Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
});

export const Deliverable = model("deliverables", deliverableSchema);
