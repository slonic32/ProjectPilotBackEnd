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

  if (!user.admin && user.id !== project.pm.id) {
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

  if (!user.admin && user.id !== project.pm._id.toString()) {
    throw HttpError(401, "You are not a PM!");
  }

  const updated = await Project.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw HttpError(404, "Project not found");
  return updated;
};

export const deleteProject = async (user, id) => {
  const isValid = isValidObjectId(id);

  if (!isValid) {
    throw HttpError(404, "User not found");
  }

  const project = await Project.findById(id).populate("pm", "");

  if (!project) {
    throw HttpError(404, "Project not found");
  }

  if (!user.admin && user.id !== project.pm._id.toString()) {
    throw HttpError(401, "You are not a PM!");
  }

  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) throw HttpError(404, "Project not found");
  return deleted;
};

export const updateProjectCharter = async (user, id, updates) => {
  const isValid = isValidObjectId(id);
  if (!isValid) throw HttpError(404, "Invalid project ID");

  const project = await Project.findById(id);
  if (!project) throw HttpError(404, "Project not found");

  const isAllowed =
    user.admin ||
    user.id === project.pm._id.toString() ||
    project.acs.initiating.some((uid) => uid.toString() === user.id);

  if (!isAllowed) {
    throw HttpError(403, "Access denied: Not assigned to initiating phase");
  }

  project.initiating.integration.developProjectCharter = {
    ...project.initiating.integration.developProjectCharter,
    ...updates,
  };

  await project.save();
  return project.initiating.integration.developProjectCharter;
};

export const updateStakeholders = async (user, id, updates) => {
  const isValid = isValidObjectId(id);
  if (!isValid) throw HttpError(404, "Invalid project ID");

  const project = await Project.findById(id);
  if (!project) throw HttpError(404, "Project not found");

  const isAllowed =
    user.admin ||
    user.id === project.pm._id.toString() ||
    project.acs.initiating.some((uid) => uid.toString() === user.id);

  if (!isAllowed) {
    throw HttpError(403, "Access denied: Not assigned to initiating phase");
  }

  project.initiating.stakeholder.identifyStakeholders = {
    ...project.initiating.stakeholder.identifyStakeholders,
    ...updates,
  };

  await project.save();
  return project.initiating.stakeholder.identifyStakeholders;
};

export const closeProject = async (user, id, updates) => {
  const isValid = isValidObjectId(id);
  if (!isValid) throw HttpError(404, "Invalid project ID");

  const project = await Project.findById(id);
  if (!project) throw HttpError(404, "Project not found");

  const isAllowed =
    user.admin ||
    user.id === project.pm._id.toString() ||
    project.acs.closing.some((uid) => uid.toString() === user.id);

  if (!isAllowed) {
    throw HttpError(403, "Access denied: Not assigned to closing phase");
  }

  if (updates.closed) {
    if (updates.closedDate) {
      project.closing.integration.closeProject.closedDate = updates.closedDate;
    } else {
      project.closing.integration.closeProject.closedDate = new Date();
    }

    project.closed = true;
  } else {
    project.closed = false;
    project.closing.integration.closeProject.closedDate = null;
  }

  await project.save();
  return {
    closeProject: project.closing.integration.closeProject,
    closed: project.closed,
  };
};

const checkPlanningAccess = async (user, projectId) => {
  if (!isValidObjectId(projectId)) throw HttpError(404, "Invalid project ID");
  const project = await Project.findById(projectId);
  if (!project) throw HttpError(404, "Project not found");

  const allowed =
    user.admin ||
    user.id === project.pm.toString() ||
    project.acs.planning.some((uid) => uid.toString() === user.id);

  if (!allowed) throw HttpError(403, "Access denied: Not in planning phase");

  return project;
};

export const updatePlanScopeManagement = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.scope.planScopeManagement = data;
  await project.save();
  return project.planning.scope.planScopeManagement;
};

export const updateCollectRequirements = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.scope.collectRequirements = data;
  await project.save();
  return project.planning.scope.collectRequirements;
};

export const updateDefineScope = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.scope.defineScope = data;
  await project.save();
  return project.planning.scope.defineScope;
};

export const updateCreateWBS = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.scope.createWBS = data;
  await project.save();
  return project.planning.scope.createWBS;
};

const checkRoleAccess = (user, project, phase) => {
  const allowed =
    user.admin ||
    user.id === project.pm.toString() ||
    project.acs[phase].some((uid) => uid.toString() === user.id);

  if (!allowed) throw HttpError(403, `Access denied: Not in ${phase} phase`);
};

export const getInitiatingSection = async (user, projectId) => {
  if (!isValidObjectId(projectId)) throw HttpError(404, "Invalid project ID");
  const project = await Project.findById(projectId);
  if (!project) throw HttpError(404, "Project not found");

  checkRoleAccess(user, project, "initiating");
  return project.initiating;
};

export const getPlanningSection = async (user, projectId) => {
  if (!isValidObjectId(projectId)) throw HttpError(404, "Invalid project ID");
  const project = await Project.findById(projectId);
  if (!project) throw HttpError(404, "Project not found");

  checkRoleAccess(user, project, "planning");
  return project.planning;
};

export const getClosingSection = async (user, projectId) => {
  if (!isValidObjectId(projectId)) throw HttpError(404, "Invalid project ID");
  const project = await Project.findById(projectId);
  if (!project) throw HttpError(404, "Project not found");

  checkRoleAccess(user, project, "closing");
  return { ...project.closing, closed: project.closed };
};

export const updatePlanScheduleManagement = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.schedule.planScheduleManagement.scheduleManagementPlan =
    data;
  await project.save();
  return project.planning.schedule.planScheduleManagement
    .scheduleManagementPlan;
};

export const updatePlanCostManagement = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.cost.planCostManagement.costManagementPlan = data;
  await project.save();
  return project.planning.cost.planCostManagement.costManagementPlan;
};

export const updateEstimateCost = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.cost.estimateCost.costEstimates = data;
  await project.save();
  return project.planning.cost.estimateCost.costEstimates;
};

export const updateDetermineBudget = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.cost.determineBudget = data;
  await project.save();
  return project.planning.cost.determineBudget;
};

export const updatePlanResourceManagement = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.resource.planResourceManagement.resourceManagementPlan =
    data;
  await project.save();
  return project.planning.resource.planResourceManagement
    .resourceManagementPlan;
};

export const updateEstimateActivityResource = async (user, id, data) => {
  const project = await checkPlanningAccess(user, id);
  project.planning.resource.estimateActivityResource = data;
  await project.save();
  return project.planning.resource.estimateActivityResource;
};
