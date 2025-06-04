import express from "express";
import dotenv from "dotenv";
import authfunction from "./routes/auth.route.js";
import connectdb from "./db/connectdb.js";
import cookieParser from "cookie-parser";
import crudfunction from "./routes/crud.route.js";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
app.use(cors({
  origin: "https://charging-station-frontend-sage.vercel.app",
  credentials: true,
}));

const __dirname = path.resolve();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "7mb" }));
app.use(cookieParser());





app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Backend is running');
});
// Routes
app.use("/api/auth", authfunction);
app.use("/api/stations", crudfunction);

// Connect DB and start server
connectdb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
