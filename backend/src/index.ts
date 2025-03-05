import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { setupSwagger } from "./config/swagger";
import passport from "passport";
import baseRouter from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "*", // Specify the allowed origin
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
import "./config/passport";

app.use(express.json());
setupSwagger(app);

app.use("/api/v1", baseRouter);

app.use(errorHandler);

app.get("/", (_, res) => res.send("API is running... 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
