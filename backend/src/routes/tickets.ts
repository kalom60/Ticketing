import TicketController from "src/controller/ticketController";
import { ticketSchema, validate } from "../middlewares/validation";
import express from "express";
import { authenticateJWT } from "src/middlewares/authenticate";

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
 * /api/v1/ticket:
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

export default router;
