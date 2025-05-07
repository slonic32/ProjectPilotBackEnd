import * as service from "../services/workService.js";

export const createWork = async (req, res) => {
  const work = await service.createWorkService(req.user, req.body);
  res.status(201).json(work);
};

export const getWorksByProject = async (req, res) => {
  const works = await service.getWorksByProjectService(
    req.user,
    req.params.projectId
  );
  res.status(200).json(works);
};

export const updateWork = async (req, res) => {
  const updated = await service.updateWorkService(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json(updated);
};

export const deleteWork = async (req, res) => {
  const deleted = await service.deleteWorkService(req.user, req.params.id);
  res.status(200).json({ message: "Work deleted", work: deleted });
};
