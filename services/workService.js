import { Work } from "../models/workModel.js";
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

export const createWorkService = async (user, data) => {
  await checkPlanningAccess(user, data.project);
  return await Work.create(data);
};

export const getWorksByProjectService = async (user, projectId) => {
  await checkPlanningAccess(user, projectId);
  return await Work.find({ project: projectId }).populate("work deliverable");
};

export const updateWorkService = async (user, id, data) => {
  const work = await Work.findById(id);
  if (!work) throw HttpError(404, "Work not found");
  await checkPlanningAccess(user, work.project);
  data.project = work.project;

  if (data.work && !Array.isArray(data.work)) {
    data.work = [data.work]; // normalize single ID to array
  }

  const updated = await Work.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw HttpError(404, "Work not found");
  return updated;
};

export const deleteWorkService = async (user, id) => {
  const work = await Work.findById(id);
  if (!work) throw HttpError(404, "Work not found");

  await checkPlanningAccess(user, work.project);
  await Work.findByIdAndDelete(id);
  return work;
};
