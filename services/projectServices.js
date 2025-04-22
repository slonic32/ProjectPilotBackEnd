import { Project } from "../models/projectModel.js";
import HttpError from "../helpers/HttpError.js";
import { isValidObjectId } from "mongoose";

export const createProject = async (user, data) => {
  if (!user) throw HttpError(401, "User not found");
  const newProject = { pm: user.id, ...data };
  return await Project.create(newProject);
};

export const getAllProjects = async () => {
  return await Project.find({}, "name closed startDate pm").populate(
    "pm",
    "name email"
  );
};

export const getProjectById = async (user, id) => {
  const isValid = isValidObjectId(id);

  if (!isValid) {
    throw HttpError(404, "Project not found");
  }

  const project = await Project.findById(id)
    .populate("pm", "name email phone admin pm avatarURL")
    .populate("acs.initiating", "name email phone admin pm avatarURL")
    .populate("acs.planning", "name email phone admin pm avatarURL")
    .populate("acs.executing", "name email phone admin pm avatarURL")
    .populate("acs.monitoring", "name email phone admin pm avatarURL")
    .populate("acs.closing", "name email phone admin pm avatarURL");

  if (!project) {
    throw HttpError(404, "Project not found");
  }

  if (!user.admin || user.id !== project.pm.id) {
    throw HttpError(401, "You are not a PM!");
  }

  return project;
};

export const updateProject = async (user, id, data) => {
  const isValid = isValidObjectId(id);

  if (!isValid) {
    throw HttpError(404, "Project not found");
  }

  const project = await Project.findById(id).populate("pm", "");

  if (!project) {
    throw HttpError(404, "Project not found");
  }

  if (!user.admin || user.id !== project.pm.id) {
    throw HttpError(401, "You are not a PM!");
  }

  const updated = await Project.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw HttpError(404, "Project not found");
  return updated;
};

export const deleteProject = async (id) => {
  const isValid = isValidObjectId(id);

  if (!isValid) {
    throw HttpError(404, "User not found");
  }

  const project = await Project.findById(id).populate("pm", "");

  if (!project) {
    throw HttpError(404, "Project not found");
  }

  if (!user.admin || user.id !== project.pm.id) {
    throw HttpError(401, "You are not a PM!");
  }

  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) throw HttpError(404, "Project not found");
  return deleted;
};
