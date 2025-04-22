import express from "express";
import { authenticate, isPM } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { projectSchemas } from "../schemas/projectSchemas.js";
import * as controllers from "../controllers/projectController.js";
import { errorHandling } from "../helpers/errorHandlingWrapper.js";

const router = express.Router();

router
  .post(
    "/add",
    authenticate,
    isPM,
    validateBody(projectSchemas.create),
    errorHandling(controllers.create)
  )
  .get("/all", authenticate, errorHandling(controllers.getAll))
  .get("/:id", authenticate, isPM, errorHandling(controllers.getById))
  .patch(
    "/:id",
    authenticate,
    isPM,
    validateBody(projectSchemas.update),
    errorHandling(controllers.update)
  )
  .delete("/:id", authenticate, isPM, errorHandling(controllers.remove));

export default router;

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Project management endpoints
 *
 * /api/projects/add:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       '201':
 *         description: Project created successfully
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized

 * /api/projects/all:
 *   get:
 *     summary: Get a list of all projects (basic info)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectListItem'
 *       '401':
 *         description: Unauthorized

 * /api/projects/{id}:
 *   get:
 *     summary: Get detailed project info
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       '200':
 *         description: Detailed project information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FullProject'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Project not found
 *   patch:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       '200':
 *         description: Project updated successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Project not found
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Project deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Project not found
 *
 * components:
 *   schemas:
 *     ProjectInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: New Client Onboarding
 *         acs:
 *           type: object
 *           properties:
 *             initiating:
 *               type: array
 *               items:
 *                 type: string
 *             planning:
 *               type: array
 *               items:
 *                 type: string
 *             executing:
 *               type: array
 *               items:
 *                 type: string
 *             monitoring:
 *               type: array
 *               items:
 *                 type: string
 *             closing:
 *               type: array
 *               items:
 *                 type: string
 *         closed:
 *           type: boolean
 *
 *     ProjectListItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         startDate:
 *           type: string
 *         closed:
 *           type: boolean
 *         pm:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *
 *     FullProject:
 *       allOf:
 *         - $ref: '#/components/schemas/ProjectListItem'
 *         - type: object
 *           properties:
 *             acs:
 *               type: object
 *               properties:
 *                 initiating:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserShort'
 *                 planning:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserShort'
 *                 executing:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserShort'
 *                 monitoring:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserShort'
 *                 closing:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserShort'
 *
 *     UserShort:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         avatarURL:
 *           type: string
 *         admin:
 *           type: boolean
 *         pm:
 *           type: boolean
 */
