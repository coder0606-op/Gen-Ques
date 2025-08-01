// npm install assemblyai

import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({
  apiKey: "162aabede21d47a6ac80b5aefeec9a85"
})





export const run = async (audioUrl) => {
  const transcript = await client.transcripts.transcribe(audioUrl)
  console.log(transcript.text)
}

