const express = require("express");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const { AssemblyAI } = require("assemblyai");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-role"],
};
app.use(cors(corsOptions));

const client = new AssemblyAI({ apiKey: "162aabede21d47a6ac80b5aefeec9a85" });

const ytDlp = new YTDlpWrap("/usr/local/bin/yt-dlp");

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: "Missing YouTube URL" });
  }

  try {
    const outputFilePath = `./audio_${Date.now()}.mp3`;
    const tempFile = `temp_${Date.now()}.m4a`;

    // Download audio using yt-dlp
    await ytDlp.execPromise([videoUrl, "-f", "bestaudio", "-o", tempFile]);

    // Convert audio to MP3 using ffmpeg
    ffmpeg(tempFile)
      .audioCodec("libmp3lame")
      .toFormat("mp3")
      .save(outputFilePath)
      .on("end", async () => {
        try {
          const audioUrl = await uploadToAssemblyAI(outputFilePath);
          const response = await transcribeAudio(audioUrl);

          // Delete temp files
          fs.unlinkSync(tempFile);
          fs.unlinkSync(outputFilePath);

          res.status(201).json({ message: response });
        } catch (err) {
          res.status(500).json({ error: "Error during transcription" });
        }
      })
      .on("error", (err) => {
        fs.unlinkSync(tempFile);
        fs.unlinkSync(outputFilePath);
        res.status(500).json({ error: "Error processing audio" });
      });
  } catch (error) {
    fs.unlinkSync(tempFile);
    fs.unlinkSync(outputFilePath);
    res.status(500).json({ error: "Error downloading audio" });
  }
});

const uploadToAssemblyAI = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    const uploadResponse = await client.files.upload(
      fs.createReadStream(filePath)
    );
    // Debugging response
    return uploadResponse; // Ensure it exists
  } catch (error) {}
};

// Transcribe audio using AssemblyAI
const transcribeAudio = async (audioUrl) => {
  const transcript = await client.transcripts.transcribe({
    audio_url: audioUrl,
  });

  return transcript.text;
};

app.listen(3005, () => console.log("Server running on port 3005"));
