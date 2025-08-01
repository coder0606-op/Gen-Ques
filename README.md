# Video to Question Generator

A powerful tool that takes a YouTube video URL, processes the content, and generates questions based on the video. The project uses **yt-dlp** to download and extract information from the video and then generates meaningful questions for educational or content summarization purposes.

## Features

- **Video URL Input**: Users can input a YouTube video URL.
- **Automatic Video Processing**: Uses yt-dlp to download and process the video.
- **Text Extraction**: The video content is transcribed or analyzed to generate questions.
- **Frontend Interface**: A simple and intuitive interface for users to interact with.
- **Backend Processing**: Powered by Node.js, Express, and yt-dlp for handling video processing and question generation.
- **Fast and Efficient**: Handles multiple video types and ensures minimal delay during processing.

---

## Tech Stack

- **Frontend**: React.js for building the user interface
- **Backend**: Node.js with Express.js
- **Video Downloading & Processing**: yt-dlp
- **Database**: (Optional) Store questions or video metadata in a database for future use (e.g., MongoDB, MySQL)
- **Styling**: CSS/SCSS or TailwindCSS for modern, responsive UI

---

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/video-to-question-generator.git
cd video-to-question-generator
