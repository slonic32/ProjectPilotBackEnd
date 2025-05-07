import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import * as deliverableController from "../controllers/deliverableController.js";
import { validateBody } from "../middleware/validateBody.js";
import { deliverableSchemas } from "../schemas/deliverableSchemas.js";

const router = express.Router();

router.post(
  "/add",
  authenticate,
  validateBody(deliverableSchemas.create),
  deliverableController.createDeliverable
);
router.get(
  "/all/:projectId",
  authenticate,
  deliverableController.getDeliverablesByProject
);
router.patch(
  "/:id",
  authenticate,
  validateBody(deliverableSchemas.update),
  deliverableController.updateDeliverable
);
router.delete("/:id", authenticate, deliverableController.deleteDeliverable);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Deliverables
 *     description: Manage project deliverables linked to scope definition

 * /api/deliverables/add:
 *   post:
 *     summary: Create a new deliverable
 *     tags: [Deliverables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Poster Design"
 *               description:
 *                 type: string
 *               project:
 *                 type: string
 *                 description: Project ID this deliverable belongs to
 *     responses:
 *       201:
 *         description: Deliverable created
 *       403:
 *         description: Access denied (not in planning phase)

 * /api/deliverables/all/{projectId}:
 *   get:
 *     summary: Get all deliverables for a project
 *     tags: [Deliverables]
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
 *         description: List of deliverables

 * /api/deliverables/{id}:
 *   patch:
 *     summary: Update a specific deliverable
 *     tags: [Deliverables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Deliverable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Deliverable updated

 *   delete:
 *     summary: Delete a specific deliverable
 *     tags: [Deliverables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Deliverable ID
 *     responses:
 *       200:
 *         description: Deliverable deleted
 */
