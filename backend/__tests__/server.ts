import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import baseRouter from "../src/routes/index";
import { errorHandler } from "../src/middlewares/errorHandler";

dotenv.config();
import "../src/config/passport";

function createTestServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(express.json());
  app.use("/api/v1", baseRouter);
  app.use(errorHandler);

  return app;
}

export default createTestServer;
