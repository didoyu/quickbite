import "dotenv/config.js";
import express from "express";
import job from "./lib/cron.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
const PORT = process.env.PORT || 3000;


job.start();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
}
)