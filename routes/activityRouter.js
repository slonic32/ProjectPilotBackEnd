import express from "express";
import {
  createActivity,
  getActivitiesByProject,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { activitySchema } from "../schemas/activitySchemas.js";

const router = express.Router();

router.post("/", authenticate, validateBody(activitySchema), createActivity);
router.get("/:projectId", authenticate, getActivitiesByProject);
router.patch(
  "/:id",
  authenticate,
  validateBody(activitySchema),
  updateActivity
);
router.delete("/:id", authenticate, deleteActivity);

export default router;

/**
 * @swagger
 * tags:
 *   name: Activity API
 *   description: Endpoints for managing project activities

 * /api/activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activity API]
 *     description: |
 *       Creates a new activity as defined in the project’s WBS and activity list.
 *       Activities represent specific units of work and are linked to a work package.
 *       This endpoint requires project access and Project Manager role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workPackage:
 *                 type: string
 *                 description: ObjectId of the associated work package
 *               name:
 *                 type: string
 *                 description: Unique name of the activity
 *               initialScopeDescription:
 *                 type: string
 *               detailedScopeDescription:
 *                 type: string
 *               predecessorActivities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ObjectIds of preceding activities
 *               resourceRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *                 description: Estimated activity duration (in days)
 *               project:
 *                 type: string
 *                 description: ObjectId of the project
 *     responses:
 *       201:
 *         description: Activity created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found

 * /api/activities/{projectId}:
 *   get:
 *     summary: Get all activities in a project
 *     tags: [Activity API]
 *     description: |
 *       Retrieves the activity list for a project, used to define, sequence, and estimate tasks.
 *       This endpoint returns all activities including resource and predecessor information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to list activities for
 *     responses:
 *       200:
 *         description: List of activities
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found

 * /api/activities/{id}:
 *   patch:
 *     summary: Update an existing activity
 *     tags: [Activity API]
 *     description: |
 *       Updates attributes of an activity such as duration, dependencies or scope.
 *       Use this to refine activity details during ongoing planning.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the activity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       200:
 *         description: Activity updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Activity not found

 *   delete:
 *     summary: Delete an activity
 *     tags: [Activity API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Activity ID to delete
 *     responses:
 *       200:
 *         description: Activity deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Activity not found

 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       properties:
 *         workPackage:
 *           type: string
 *         name:
 *           type: string
 *         initialScopeDescription:
 *           type: string
 *         detailedScopeDescription:
 *           type: string
 *         predecessorActivities:
 *           type: array
 *           items:
 *             type: string
 *         resourceRequirements:
 *           type: array
 *           items:
 *             type: string
 *         duration:
 *           type: number
 *         project:
 *           type: string
 */
