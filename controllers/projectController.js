import * as services from "../services/projectServices.js";

export const create = async (req, res) => {
  const user = req.user;
  const data = req.body;
  const project = await services.createProject(user, data);
  res.status(201).json(project);
};

export const getAll = async (req, res) => {
  const projects = await services.getAllProjects();
  res.status(200).json(projects);
};

export const getById = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const project = await services.getProjectById(user, id);
  res.status(200).json(project);
};

export const update = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const updated = await services.updateProject(user, id, req.body);
  res.status(200).json(updated);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const deleted = await services.deleteProject(user, id);
  res.status(200).json({ message: "Project deleted", project: deleted });
};

export const updateProjectCharter = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const updates = req.body;

  const result = await services.updateProjectCharter(user, id, updates);
  res.status(200).json({ developProjectCharter: result });
};

export const updateStakeholders = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const updates = req.body;

  const result = await services.updateStakeholders(user, id, updates);
  res.status(200).json({ identifyStakeholders: result });
};

export const closeProject = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const updates = req.body;

  const result = await services.closeProject(user, id, updates);
  res.status(200).json(result);
};

export const updatePlanScopeManagement = async (req, res) => {
  const result = await services.updatePlanScopeManagement(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ planScopeManagement: result });
};

export const updateCollectRequirements = async (req, res) => {
  const result = await services.updateCollectRequirements(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ collectRequirements: result });
};

export const updateDefineScope = async (req, res) => {
  const result = await services.updateDefineScope(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ defineScope: result });
};

export const updateCreateWBS = async (req, res) => {
  const result = await services.updateCreateWBS(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ createWBS: result });
};

export const getInitiating = async (req, res) => {
  const result = await services.getInitiatingSection(req.user, req.params.id);
  res.status(200).json(result);
};

export const getPlanning = async (req, res) => {
  const result = await services.getPlanningSection(req.user, req.params.id);
  res.status(200).json(result);
};

export const getClosing = async (req, res) => {
  const result = await services.getClosingSection(req.user, req.params.id);
  res.status(200).json(result);
};
