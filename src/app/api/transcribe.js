import { createClient } from "@deepgram/sdk";

// Create Deepgram client using API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export default async function transcribeHandler(req, res) {
  if (req.method === "POST") {
    const { type, query, audioData } = req.body;

    try {
      if (type === "text") {
        // Process text input using Deepgram's language analysis API
        const result = await deepgram.read.analyzeText(
          { text: query },
          { language: "en", topics: true, sentiment: true }
        );

        // Send back text response
        return res.status(200).json({ responseType: "text", text: result });
      } else if (type === "audio") {
        // Process audio input with Deepgram
        const result = await deepgram.listen.live.transcribeAudio(audioData);

        // Send back the transcription result
        return res.status(200).json({ responseType: "text", text: result });
      }
    } catch (error) {
      console.error("Error with Deepgram API:", error);
      res.status(500).json({ error: "Processing failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
