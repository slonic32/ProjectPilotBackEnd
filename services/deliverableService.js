import { Deliverable } from "../models/deliverableModel.js";
import { Project } from "../models/projectModel.js";
import HttpError from "../helpers/HttpError.js";
import { isValidObjectId } from "mongoose";

const checkPlanningAccess = async (user, projectId) => {
  if (!isValidObjectId(projectId)) throw HttpError(404, "Invalid project ID");

  const project = await Project.findById(projectId);
  if (!project) throw HttpError(404, "Project not found");

  const allowed =
    user.admin ||
    user.id === project.pm.toString() ||
    project.acs.planning.some((uid) => uid.toString() === user.id);

  if (!allowed)
    throw HttpError(403, "Access denied: Not assigned to planning phase");
};

export const createDeliverableService = async (user, data) => {
  await checkPlanningAccess(user, data.project);
  return await Deliverable.create(data);
};

export const getDeliverablesByProjectService = async (user, projectId) => {
  await checkPlanningAccess(user, projectId);
  return await Deliverable.find({ project: projectId });
};

export const updateDeliverableService = async (user, id, data) => {
  const deliverable = await Deliverable.findById(id);
  if (!deliverable) throw HttpError(404, "Deliverable not found");

  await checkPlanningAccess(user, deliverable.project);
  data.project = deliverable.project;
  const updated = await Deliverable.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw HttpError(404, "Deliverable not found");
  return updated;
};

export const deleteDeliverableService = async (user, id) => {
  const deliverable = await Deliverable.findById(id);
  if (!deliverable) throw HttpError(404, "Deliverable not found");

  await checkPlanningAccess(user, deliverable.project);
  await Deliverable.findByIdAndDelete(id);
  return deliverable;
};
