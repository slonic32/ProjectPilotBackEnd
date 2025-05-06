import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import * as workController from "../controllers/workController.js";
import { validateBody } from "../middleware/validateBody.js";
import { workSchemas } from "../schemas/workSchemas.js";

const router = express.Router();

router.post(
  "/add",
  authenticate,
  validateBody(workSchemas.create),
  workController.createWork
);
router.get("/all/:projectId", authenticate, workController.getWorksByProject);
router.patch(
  "/:id",
  authenticate,
  validateBody(workSchemas.update),
  workController.updateWork
);
router.delete("/:id", authenticate, workController.deleteWork);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Work
 *     description: Manage Work Breakdown Structure (WBS) elements, including nested sub-works

 * /api/works/add:
 *   post:
 *     summary: Create a new work item (WBS entry)
 *     tags: [Work]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, project]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Plan festival logistics"
 *               description:
 *                 type: string
 *                 example: "Includes ride contracts, food stalls and permits"
 *               project:
 *                 type: string
 *                 description: ID of the parent project
 *               work:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Sub-work ObjectId
 *                 example: ["6638f1c0ab...", "6638f2d4cd..."]
 *               deliverable:
 *                 type: string
 *                 description: Associated deliverable ObjectId
 *     responses:
 *       201:
 *         description: Work item created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized for planning

 * /api/works/all/{projectId}:
 *   get:
 *     summary: Get all work items for a given project
 *     tags: [Work]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of work items

 * /api/works/{id}:
 *   patch:
 *     summary: Update a work item
 *     tags: [Work]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               work:
 *                 type: array
 *                 items:
 *                   type: string
 *               deliverable:
 *                 type: string
 *     responses:
 *       200:
 *         description: Work updated

 *   delete:
 *     summary: Delete a work item
 *     tags: [Work]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work deleted
 */
