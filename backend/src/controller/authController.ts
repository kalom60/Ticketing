import { hashPassword } from "../utils/hash";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { Document } from "mongoose";

type User = Document & {
  id: string;
  email: string;
  role: string;
};

class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;

      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User already registered" });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        email,
        password: hashedPassword,
        role: role || "user",
      });

      await user.save();
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
