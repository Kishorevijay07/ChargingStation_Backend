import express from "express";
import dotenv from "dotenv";
import authfunction from "./routes/auth.route.js";
import connectdb from "./db/connectdb.js";
import cookieParser from "cookie-parser";
import crudfunction from "./routes/crud.route.js";
import cors from "cors"
import path from "path";

const app = express();
dotenv.config();
const __dirname = path.resolve();



app.use(cookieParser())

const port = process.env.PORT || 3000;

app.use(express.json(
    {
        limit : "7mb"
    }
))
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
}));

app.use(express.urlencoded({
    extended:true
}))

app.use('/api/auth',authfunction)
app.use("/api/stations", crudfunction);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));
}

connectdb().then(() => {
  app.listen(port, () => {
    console.log(`Server running successfully on port ${port}`);
  });
});