import express from "express";
import { createQuestionPaper, getQuestionsByEmail, deleteQuestionByDate } from "../controllers/questionController.js";

const router = express.Router();

// Route to create a question paper
router.post("/create", createQuestionPaper);

// Route to get all question papers by email
router.get("/getByEmail/:email", getQuestionsByEmail);

// Route to delete a question paper by date
router.delete("/deleteByDate/:date", deleteQuestionByDate);

export default router;
