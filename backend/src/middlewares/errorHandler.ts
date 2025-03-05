import { Response } from "express";

export const errorHandler = (err: Error, res: Response) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
};
