import {
  createActivityService,
  getActivitiesByProjectService,
  updateActivityService,
  deleteActivityService,
} from "../services/activityService.js";

export const createActivity = async (req, res) => {
  const activity = await createActivityService(req.user, req.body);
  res.status(201).json({ activity });
};

export const getActivitiesByProject = async (req, res) => {
  const activities = await getActivitiesByProjectService(
    req.user,
    req.params.projectId
  );
  res.status(200).json({ activities });
};

export const updateActivity = async (req, res) => {
  const updated = await updateActivityService(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ activity: updated });
};

export const deleteActivity = async (req, res) => {
  const deleted = await deleteActivityService(req.user, req.params.id);
  res.status(200).json({ activity: deleted });
};
