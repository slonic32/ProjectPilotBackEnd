import express from "express";
import {
  authenticate,
  authenticateRefresh,
  isAdmin,
} from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { Schemas } from "../schemas/userSchemas.js";
import { errorHandling } from "../helpers/errorHandlingWrapper.js";
import * as controllers from "../controllers/userController.js";
import { uploadImage } from "../middleware/imgUploader.js";

const userRouter = express.Router();
userRouter
  .post(
    "/add",
    authenticate,
    isAdmin,
    validateBody(Schemas.addSchema),
    errorHandling(controllers.add)
  )
  .post(
    "/login",
    validateBody(Schemas.loginSchema),
    errorHandling(controllers.login)
  )
  .get("/logout", authenticate, errorHandling(controllers.logout))
  .get("/current", authenticate, errorHandling(controllers.current))
  .patch(
    "/update",
    authenticate,
    uploadImage,
    validateBody(Schemas.updateUserSchema),
    errorHandling(controllers.updateUser)
  )
  .patch(
    "/refresh",
    authenticateRefresh,
    validateBody(Schemas.refreshSchema),
    errorHandling(controllers.refreshTokens)
  )
  .get("/all", authenticate, isAdmin, errorHandling(controllers.all))
  .delete("/:id", authenticate, isAdmin, errorHandling(controllers.deleteUser))
  .patch("/:id", authenticate, isAdmin, errorHandling(controllers.editUser));

export default userRouter;

/**
 * @swagger
 * tags:
 *   - name: User API
 *     description: Operations related to user management
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *           example: Jessica.Smith@gmail.com
 *         phone:
 *           type: string
 *         avatarURL:
 *           type: string
 *         admin:
 *           type: boolean
 *         pm:
 *           type: boolean
 *
 * /api/users/add:
 *   post:
 *     summary: Add a new user
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               admin:
 *                 type: boolean
 *               pm:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 *
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [User API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *
 * /api/users/logout:
 *   get:
 *     summary: Logout user
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *
 * /api/users/current:
 *   get:
 *     summary: Get current user
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 * /api/users/update:
 *   patch:
 *     summary: Update current user
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 * /api/users/refresh:
 *   patch:
 *     summary: Refresh authentication tokens
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *
 * /api/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User API]
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
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *
 *   patch:
 *     summary: Edit user by ID
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               admin:
 *                 type: boolean
 *               pm:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User edited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Cannot edit your own user
 */
