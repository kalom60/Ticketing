import express from "express";
import authRouter from "./auth";
import ticketRouter from "./tickets";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/ticket", ticketRouter);

export default router;
