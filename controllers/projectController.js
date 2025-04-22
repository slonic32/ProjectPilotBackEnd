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
