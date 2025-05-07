import * as service from "../services/deliverableService.js";

export const createDeliverable = async (req, res) => {
  const deliverable = await service.createDeliverableService(
    req.user,
    req.body
  );
  res.status(201).json(deliverable);
};

export const getDeliverablesByProject = async (req, res) => {
  const deliverables = await service.getDeliverablesByProjectService(
    req.user,
    req.params.projectId
  );
  res.status(200).json(deliverables);
};

export const updateDeliverable = async (req, res) => {
  const updated = await service.updateDeliverableService(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json(updated);
};

export const deleteDeliverable = async (req, res) => {
  const deleted = await service.deleteDeliverableService(
    req.user,
    req.params.id
  );
  res
    .status(200)
    .json({ message: "Deliverable deleted", deliverable: deleted });
};
