import express from "express";
import "./loadEnvironment.js";
import questionRoutes from "./routes/questionsRoutes.js";
import cors from "cors";
import { connectDB } from "./config/db.js";

connectDB();

const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-user-role",
  ],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

    

// Define routes
app.use("/api/user/questions", questionRoutes);

const port = 3004;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
