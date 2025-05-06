import express from "express";
import { authenticate, isPM } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { projectSchemas } from "../schemas/projectSchemas.js";
import * as controllers from "../controllers/projectController.js";
import { errorHandling } from "../helpers/errorHandlingWrapper.js";
import { planningSchemas } from "../schemas/planningSchemas.js";

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
  .delete("/:id", authenticate, isPM, errorHandling(controllers.remove))
  .patch(
    "/:id/initiating/integration/developProjectCharter",
    authenticate,
    errorHandling(controllers.updateProjectCharter)
  )
  .patch(
    "/:id/initiating/stakeholder/identifyStakeholders",
    authenticate,
    errorHandling(controllers.updateStakeholders)
  )
  .patch(
    "/:id/closing/integration/closeProject",
    authenticate,
    errorHandling(controllers.closeProject)
  )
  .patch(
    "/:id/planning/scope/planScopeManagement",
    authenticate,
    validateBody(planningSchemas.updatePlanScopeManagement),
    errorHandling(controllers.updatePlanScopeManagement)
  )
  .patch(
    "/:id/planning/scope/collectRequirements",
    authenticate,
    validateBody(planningSchemas.updateCollectRequirements),
    errorHandling(controllers.updateCollectRequirements)
  )
  .patch(
    "/:id/planning/scope/defineScope",
    authenticate,
    validateBody(planningSchemas.updateDefineScope),
    errorHandling(controllers.updateDefineScope)
  )
  .patch(
    "/:id/planning/scope/createWBS",
    authenticate,
    validateBody(planningSchemas.createWBS),
    errorHandling(controllers.updateCreateWBS)
  );

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
 *
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
 *
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
 *         description: Project ID to fetch
 *     responses:
 *       '200':
 *         description: Full project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FullProject'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Project not found
 *   patch:
 *     summary: Update project metadata and team
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       '200':
 *         description: Project updated
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
 *         description: Project ID to delete
 *     responses:
 *       '200':
 *         description: Project deleted
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Project not found
 *
 * /api/projects/{id}/initiating/integration/developProjectCharter:
 *   patch:
 *     summary: Submit or update the Project Charter document
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DevelopProjectCharter'
 *     responses:
 *       '200':
 *         description: Project Charter updated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Not permitted
 *       '404':
 *         description: Project not found
 *
 * /api/projects/{id}/initiating/stakeholder/identifyStakeholders:
 *   patch:
 *     summary: Update stakeholder registry details
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdentifyStakeholders'
 *     responses:
 *       '200':
 *         description: Stakeholder registry updated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Not permitted
 *       '404':
 *         description: Project not found
 *
 * /api/projects/{id}/closing/integration/closeProject:
 *   patch:
 *     summary: Submit project closure form and mark project as closed
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID to close
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CloseProject'
 *     responses:
 *       '200':
 *         description: Project successfully closed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: User not authorized to close project
 *       '404':
 *         description: Project not found
 *
 * /api/projects/{id}/planning/scope/planScopeManagement:
 *   patch:
 *     summary: Update Scope and Requirements Management Plan
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scopeManagementPlan:
 *                 type: object
 *                 properties:
 *                   projectScopeStatement:
 *                     type: string
 *                   WBS:
 *                     type: string
 *                   scopeBaseline:
 *                     type: string
 *                   projectDeliverables:
 *                     type: string
 *               requirementsManagementPlan:
 *                 type: object
 *                 properties:
 *                   requirementActivities:
 *                     type: string
 *                   changesManagedApproved:
 *                     type: string
 *                   requirementPrioritised:
 *                     type: string
 *                   metricsUsed:
 *                     type: string
 *     responses:
 *       200:
 *         description: Planning documents updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 *
 * /api/projects/{id}/planning/scope/collectRequirements:
 *   patch:
 *     summary: Update Requirements List
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     requirement:
 *                       type: string
 *                     documentation:
 *                       type: string
 *     responses:
 *       200:
 *         description: Requirements updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 *
 * /api/projects/{id}/planning/scope/defineScope:
 *   patch:
 *     summary: Define Product Scope, Deliverables and Boundaries
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endProductScopeDescription:
 *                 type: string
 *               deliverables:
 *                 type: array
 *                 items:
 *                   type: string
 *               acceptanceCriteria:
 *                 type: array
 *                 items:
 *                   type: string
 *               exclusions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Scope updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 *
 * /api/projects/{id}/planning/scope/createWBS:
 *   patch:
 *     summary: Assign Work Breakdown Structure (WBS)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               WBS:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: WBS assigned
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 *
 * components:
 *   schemas:
 *     ProjectInput:
 *       type: object
 *       description: Input schema to create or update a project
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the project
 *           example: LegalTech Platform Launch
 *         acs:
 *           type: object
 *           description: Lists of users assigned to each project phase
 *           properties:
 *             initiating:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserShort'
 *             planning:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserShort'
 *             executing:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserShort'
 *             monitoring:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserShort'
 *             closing:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserShort'
 *         closed:
 *           type: boolean
 *           description: Status flag if the project is closed
 *
 *     ProjectListItem:
 *       type: object
 *       description: Basic project information for list views
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         startDate:
 *           type: string
 *           description: Start date in local string format
 *         closed:
 *           type: boolean
 *         pm:
 *           $ref: '#/components/schemas/UserShort'
 *
 *     FullProject:
 *       allOf:
 *         - $ref: '#/components/schemas/ProjectListItem'
 *         - type: object
 *           description: Detailed project information
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
 *       description: Short user profile for roles or references
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: Maria Schmidt
 *         email:
 *           type: string
 *           example: maria.schmidt@example.com
 *         phone:
 *           type: string
 *           example: +49-172-1234567
 *         avatarURL:
 *           type: string
 *           example: https://cdn.example.com/avatar/maria.png
 *         admin:
 *           type: boolean
 *           description: Whether user has administrative rights
 *         pm:
 *           type: boolean
 *           description: Whether user is a project manager
 *
 *     DevelopProjectCharter:
 *       type: object
 *       description: Represents the full structure of a project charter document based on integration initiation standards.
 *       properties:
 *         projectTitle:
 *           type: string
 *           description: A short, specific title summarizing the project vision and results.
 *           example: AI Legal Assistant
 *         purpose:
 *           type: string
 *           description: Explanation of the business need or problem this project addresses.
 *           example: To simplify legal document generation for clients.
 *         description:
 *           type: string
 *           description: General overview of what the project is, its scope, and boundaries.
 *         objective:
 *           type: string
 *           description: Measurable goal including time frame, deliverables, and budget.
 *         successCriteria:
 *           type: string
 *           description: Conditions used to determine whether the project meets its goals.
 *         sponsors:
 *           type: array
 *           description: People or organizations authorizing and funding the project.
 *           items:
 *             type: string
 *           example: ["CEO", "Legal Department"]
 *         majorDeliverables:
 *           type: string
 *           description: Key outputs expected (e.g., system, service, product).
 *         acceptanceCriteria:
 *           type: string
 *           description: Quantitative or qualitative measures for project acceptance.
 *         milestone_schedule:
 *           type: array
 *           description: List of key events and expected completion dates.
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               title:
 *                 type: string
 *         keyAssumptions:
 *           type: string
 *         constraints:
 *           type: string
 *         majorRisks:
 *           type: string
 *         reportingRequirements:
 *           type: string
 *         approvalSignature:
 *           type: boolean
 *         approvalDate:
 *           type: string
 *           format: date
 *
 *     IdentifyStakeholders:
 *       type: object
 *       description: Stakeholder registry fields
 *       properties:
 *         identification:
 *           type: array
 *           description: List of individuals, roles, or groups involved or impacted.
 *           items:
 *             type: string
 *           example: ["Product Owner", "Legal Advisor", "IT Consultant"]
 *         assessment:
 *           type: array
 *           description: Influence, interest, expectations, and impact of each stakeholder.
 *           items:
 *             type: string
 *           example: ["High Influence", "Needs access to weekly reports"]
 *         classification:
 *           type: array
 *           description: Categorization based on role, influence, or power-interest grid.
 *           items:
 *             type: string
 *           example: ["Internal", "External", "Keep Satisfied", "Monitor Closely"]
 *
 *     CloseProject:
 *       type: object
 *       description: Final integration documentation and validation for closing the project.
 *       properties:
 *         closed:
 *           type: boolean
 *         closedDate:
 *           type: string
 *           format: date
 *           description: Official closure date.
 *           example: 2025-08-31
 */
