import { NextFunction, Request, Response } from "express";
import Ticket from "../models/Ticket";

export interface AuthenticatedUser {
  id: string;
  role: string;
  email: string;
}

class TicketController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, status } = req.body;
      const user = req.user as { id: string };

      const ticket = new Ticket({
        title,
        description,
        status,
        user: user.id,
      });

      await ticket.save();
      return res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, role } = req.user as AuthenticatedUser;
      const query = role === "admin" ? {} : { user: id };

      const tickets = await Ticket.find(query);

      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const ticket = await Ticket.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      return res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  }
}

export default TicketController;
