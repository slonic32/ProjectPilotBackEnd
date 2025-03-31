import express from "express";
import {
  authenticate,
  authenticateRefresh,
  isAdmin,
} from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validateBody.js";
import { Schemas } from "../models/userModel.js";
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
  .delete("/:id", authenticate, isAdmin, errorHandling(controllers.deleteUser));

export default userRouter;

/**
 * @swagger
 * /api/add:
 *   post:
 *     summary: Adding a user
 *     description: Private route to add a new user
 *     tags: ["User API"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: Jessica.Smith@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Issued Authentication token
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token, can be used to re-issue the Authentication token if expired
 *       '409':
 *         description: The email provided is already in use.
 *       '500':
 *         description: Unexpected Server Error.
 *
 * /api/login:
 *   post:
 *     summary: User Login Route
 *     description: Public route for user login
 *     tags: ["User API"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: Jessica.Smith@gmail.com
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Logged In Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Issued Authentication token
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token, can be used to re-issue the Authentication token if expired
 *       '401':
 *         description: Not Authorized
 *
 * /api/logout:
 *   get:
 *     summary: Log Out Current User
 *     description: Private route to logout current user
 *     tags: ["User API"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer abcde_12345
 *
 * /api/current:
 *   get:
 *     summary: Current User Information
 *     description: Private route which returns current user information
 *     tags: ["User API"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer abcde_12345
 *     responses:
 *       '200':
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Not Authorized
 *
 * /api/all:
 *   get:
 *     summary: All Users Information
 *     description: Private route which returns all users
 *     tags: ["User API"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer abcde_12345
 *     responses:
 *       '200':
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Not Authorized
 * 
 * /api/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Private route to delete a user (Admin only)
 *     tags: ["User API"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the user to be deleted
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: "Bearer abcde_12345"
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User was deleted successfully"
 *       '401':
 *         description: Not authorized
 *       '403':
 *         description: Admin access required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Unexpected server error

 *
 * /api/update:
 *   patch:
 *     summary: Update User Settings
 *     description: Private route to update user settings
 *     tags: ["User API"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer abcde_12345
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
 *                 format: email
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Not Authorized or User not Found
 *
 * /api/refresh:
 *   patch:
 *     summary: Regenerate Authentication Tokens
 *     description: Private route to re-generate authentication and refresh tokens
 *     tags: ["User API"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer abcde_12345
 *     responses:
 *       '200':
 *         description: Token was regenerated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Issued Authentication token
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token, can be used to re-issue the Authentication token if expired
 *       '401':
 *         description: Not authorized
 *
 * components:
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
 */
