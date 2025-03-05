import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "admin";
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUser, info: any) => {
      if (err || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: IUser | false, info: any) => {
      if (err || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient permission" });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
};
