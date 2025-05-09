import { Activity } from "../models/activityModel.js";
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

  return project;
};

export const createActivityService = async (user, data) => {
  await checkPlanningAccess(user, data.project);
  return await Activity.create(data);
};

export const getActivitiesByProjectService = async (user, projectId) => {
  await checkPlanningAccess(user, projectId);
  return await Activity.find({ project: projectId }).populate(
    "workPackage predecessorActivities"
  );
};

export const updateActivityService = async (user, id, data) => {
  const activity = await Activity.findById(id);
  if (!activity) throw HttpError(404, "Activity not found");

  await checkPlanningAccess(user, activity.project);
  data.project = activity.project; // Ensure project is not overwritten

  return await Activity.findByIdAndUpdate(id, data, { new: true });
};

export const deleteActivityService = async (user, id) => {
  const activity = await Activity.findById(id);
  if (!activity) throw HttpError(404, "Activity not found");

  await checkPlanningAccess(user, activity.project);
  await Activity.findByIdAndDelete(id);
  return activity;
};
