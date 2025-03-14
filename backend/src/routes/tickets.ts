import TicketController from "src/controller/ticketController";
import {
  ticketSchema,
  updateTicketSchema,
  validate,
} from "../middlewares/validation";
import express from "express";
import { authenticateJWT, isAdmin } from "src/middlewares/authenticate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: API for ticket
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the ticket
 *         title:
 *           type: string
 *           description: Ticket title
 *         description:
 *           type: string
 *           description: Ticket description
 *         status:
 *           type: string
 *           description: Status of the ticket
 *       example:
 *         title: "Bug Ticket"
 *         description: "Ticket for JS Bug"
 *         status: "Open"
 */

/**
 * @swagger
 * /api/v1/tickets:
 *   post:
 *     summary: Register a new ticket
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Bug"
 *               description:
 *                 type: string
 *                 example: "JS Bug"
 *               status:
 *                 type: string
 *                 example: "Open"
 *     responses:
 *       201:
 *         description: Ticket registered successfully
 */
router.post(
  "/",
  authenticateJWT,
  validate(ticketSchema),
  TicketController.create,
);

/**
 * @swagger
 * /api/v1/tickets:
 *   get:
 *     summary: Retrieve tickets
 *     description: Returns all tickets if the user is an admin. Otherwise, returns only the tickets belonging to the authenticated user.
 *     tags: [Ticket]
 *     responses:
 *       200:
 *         description: List of tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get("/", authenticateJWT, TicketController.get);

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   put:
 *     summary: Update the status of a ticket
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Open", "In Progress", "Closed"]
 *                 example: "Closed"
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Admin access required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  isAdmin,
  validate(updateTicketSchema),
  TicketController.update,
);

export default router;
