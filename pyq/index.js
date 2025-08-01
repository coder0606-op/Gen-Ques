import express from "express";
import cors from "cors";
import { questionsData } from "./data.js"; 

const app = express();
app.use(express.json());
const corsOptions = {
    origin: "*", // Replace with specific origin(s) for production
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-role", // Add any custom headers you expect in requests
    ],
  };
  app.use(cors(corsOptions));

// Get questions by board and class
app.get("/api/questions", (req, res) => {
    const { board, class: className, subject, year } = req.query;
    
 
    const filteredQuestions = questionsData.filter((q) => 
      (!board || q.Board === board) &&
      (!className || q.Class === parseInt(className)) &&
      (!subject || q.Subject === subject) &&
      (!year || q.Year === parseInt(year))
    );

    res.json(filteredQuestions);
  });
  

// Start Server
const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
