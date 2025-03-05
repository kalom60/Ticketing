import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { setupSwagger } from "./config/swagger";
import passport from "passport";
import baseRouter from "./routes/index";

dotenv.config();

connectDB();

const app = express();

app.use(passport.initialize());
import "./config/passport";

app.use(express.json());
setupSwagger(app);

app.get("/", (req, res) => res.send("API is running... 🚀"));

app.use("/api/v1", baseRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
