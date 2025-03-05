import { Request, Response } from "express";

export const errorHandler = (err: Error, _: Request, res: Response) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
};
