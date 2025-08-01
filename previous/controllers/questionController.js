import { Questions } from "../models/Questions.js";

// Create a question paper
export const createQuestionPaper = async (req, res) => {
  try {
    const {
      email,
      examTitle,
      subject,
      topic,
      class: className,
      board,
      duration,
      questions,
    } = req.body;

    // Basic validation
    if (
      !email ||
      !examTitle ||
      !subject ||
      !topic ||
      !className ||
      !board ||
      !duration ||
      !questions?.length
    ) {
      return res.status(400).json({
        error: "All fields are required, including at least one question.",
      });
    }
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`; // Correct format

    const newQuestionPaper = new Questions({
      date: formattedDate,
      ...req.body,
    });

    await newQuestionPaper.save();

    res.status(201).json({
      message: "Question paper created successfully",
      data: newQuestionPaper,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all question papers by email
export const getQuestionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const questionPapers = await Questions.find({ email });

    if (questionPapers.length === 0) {
      return res
        .status(404)
        .json({ message: "No question papers found for this email" });
    }

    res.status(200).json({ data: questionPapers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuestionByDate = async (req, res) => {
  try {
    const { date } = req.params; // Date format: "dd/mm/yyyy"

    const deletedQuestion = await Questions.findOneAndDelete({ date  });

    if (!deletedQuestion) {
      return res
        .status(404)
        .json({ message: "No question paper found for the given date" });
    }

    res.status(200).json({
      message: "Question paper deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
