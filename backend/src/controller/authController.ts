import { hashPassword } from "../utils/hash";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { Document } from "mongoose";
import passport from "passport";
import jwt, { SignOptions } from "jsonwebtoken";

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
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        email,
        password: hashedPassword,
        role: role || "user",
      });

      await user.save();
      const accessToken = AuthController.generateToken(
        user as User,
        process.env.JWT_SECRET as string,
        "1h",
      );
      const refreshToken = AuthController.generateToken(
        user as User,
        process.env.REFRESH_SECRET as string,
        "7d",
      );

      return res.status(201).json({
        message: "User registered successfully",
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "local",
      { session: false },
      async (err: Error | null, user: User | false, info: any) => {
        try {
          if (err) return next(err);
          if (!user) {
            return res
              .status(401)
              .json({ message: info?.message || "Invalid email or password" });
          }

          const accessToken = AuthController.generateToken(
            user,
            process.env.JWT_SECRET as string,
            "1h",
          );
          const refreshToken = AuthController.generateToken(
            user,
            process.env.REFRESH_SECRET as string,
            "7d",
          );

          res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user,
          });
        } catch (error) {
          next(error);
        }
      },
    )(req, res, next);
  }

  private static generateToken(
    user: User,
    secret: string,
    expiresIn: string,
  ): string {
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      options,
    );
  }
}

export default AuthController;
