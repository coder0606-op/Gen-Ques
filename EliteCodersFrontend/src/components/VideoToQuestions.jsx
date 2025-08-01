import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { Context } from "../Context/ContextProvider";

const VideoToQuestions = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { generateExamPaperFromVideo } = useContext(Context);
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const generate = async () => {
    if (!url) {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3005/download?url=${url}`
      );

      if (response?.data?.message) {
        await generateExamPaperFromVideo(response.data.message);
        navigate("/generate"); // Redirect to Generate page after completion
      } else {
        alert("No text generated from the video.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("There was an error while generating questions.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col  items-center  bg-[#efefef] justify-center min-h-screen">
  <h2 className="text-4xl font-extrabold text-black mb-6 text-center">
    Generate Questions from Video
  </h2>
  
  <input
    type="text"
    onChange={handleChange}
    placeholder="Enter YouTube Video URL"
    value={url}
    className="border-2 border-gray-300 p-3 rounded-lg w-full max-w-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out mb-6"
  />

  <button
    onClick={generate}
    disabled={loading}
    className="mt-4 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v2m0 12v2m8-8h2m-18 0H2m16.24-7.76l-1.42 1.42M7.18 17.18l-1.42 1.42m11.66 0l1.42 1.42M7.18 6.82l-1.42-1.42"
          />
        </svg>
        Generating...
      </div>
    ) : (
      "Generate Questions"
    )}
  </button>
</div>

  );
};

export default VideoToQuestions;
