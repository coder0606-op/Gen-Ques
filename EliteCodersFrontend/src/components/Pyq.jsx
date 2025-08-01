import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../Context/ContextProvider";

const SERVER_URI = `http://localhost:3002/api/questions`;

const Pyq = () => {
  const [board, setBoard] = useState("");
  const [className, setClassName] = useState(""); // class
  const [year, setYear] = useState(""); // year input
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { generateExamPaperFromPyq } = useContext(Context);
  const navigate = useNavigate();

  const [availableClasses, setAvailableClasses] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [availableSubjects, setAvailableSubjects] = useState([
    "Math",
    "English",
    "Science",
  ]);
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch available classes based on selected board
  useEffect(() => {
    if (board) {
      const fetchClasses = async () => {
        try {
          const response = await axios.get(`${SERVER_URI}/available-classes`, {
            params: { board },
          });
          if (response.data.classes) {
            setAvailableClasses(response.data.classes);
          } else {
            console.error("No classes found in the response.");
          }
        } catch (error) {
          console.error("Error fetching available classes:", error);
        }
      };

      fetchClasses();
    }
  }, [board]);

  // Fetch available subjects and years based on selected board and class
  useEffect(() => {
    if (board && className) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${SERVER_URI}/available-filters`, {
            params: { board, class: className },
          });
          setAvailableSubjects(response.data.subjects || []);
          setAvailableYears(response.data.years || []);
        } catch (error) {
          console.error("Error fetching available filters:", error);
        }
      };

      fetchData();
    }
  }, [board, className]);

  // Fetch questions based on all selected filters
  useEffect(() => {
    const fetchQuestions = async () => {
      if (board && className && year && subject) {
        setLoading(true);
        try {
          const response = await axios.get(SERVER_URI, {
            params: { board, class: className, subject, year },
          });

          if (response.data.length > 0) {
            setQuestions(response.data);
          } else {
            alert("No previous year questions found for the selected filters.");
            setQuestions([]); // Clear previous data
          }
        } catch (error) {
          console.error("Error fetching previous year questions:", error);
          setQuestions([]); // Clear previous data if error
        }
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [board, className, year, subject]);

  const handleGenerate = async () => {
    if (questions.length === 0) {
      alert("No questions available to generate an exam paper.");
      return;
    }

    setLoading(true);
    try {
      const formattedQuestions = questions.map((q) => q.Question).join("\n");
      await generateExamPaperFromPyq(formattedQuestions);
      navigate("/generate"); // Redirect to Generate page
    } catch (error) {
      console.error("Error generating exam paper:", error);
    }
    setLoading(false);
  };

  const isFormComplete = board && className && year && subject;

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">
        Select Filters and Generate Exam Paper
      </h2>

      {/* Board Selection */}
      <div className="mb-4">
        <label
          htmlFor="board"
          className="block text-sm font-medium text-gray-700"
        >
          Select Board:
        </label>
        <select
          id="board"
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
        >
          <option value="">-- Select Board --</option>
          <option value="cbse">CBSE</option>
          <option value="icse">ICSE</option>
          {/* Add more boards as necessary */}
        </select>
      </div>

      {/* Class Selection */}
      {board && (
        <div className="mb-4">
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700"
          >
            Select Class:
          </label>
          <select
            id="class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">-- Select Class --</option>
            {availableClasses.map((classItem, index) => (
              <option key={index} value={classItem}>
                Class {classItem}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Year Input Box */}
      {className && (
        <div className="mb-4">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Enter Year:
          </label>
          <input
            id="year"
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter Year (e.g., 2020)"
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
      )}

      {/* Subject Selection */}
      {year && (
        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Select Subject:
          </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">-- Select Subject --</option>
            {availableSubjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Generate Exam Paper Button */}
      <button
        onClick={handleGenerate}
        className={`mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 ${
          !isFormComplete || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!isFormComplete || loading}
      >
        {loading ? "Generating..." : "Generate Exam Paper"}
      </button>
    </div>
  );
};

export default Pyq;
