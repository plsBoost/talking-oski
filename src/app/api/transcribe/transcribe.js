import { createClient } from "@deepgram/sdk";
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export default async function transcribeHandler(req, res) {
  if (req.method === "POST") {
    const { type, query, audioData } = req.body;

    try {
      if (type === "text") {
        const result = await deepgram.read.analyzeText(
          { text: query },
          { language: "en", topics: true, sentiment: true }
        );

        return res.status(200).json({
          responseType: "text",
          text: result.results[0].alternatives[0].transcript,
          sentiment: result.sentiment,
        });
      } else if (type === "audio") {
        // Streaming audio transcription with buffer
        const transcriptionResult = await deepgram.transcription.preRecorded(
          { buffer: audioData, mimetype: "audio/webm" },
          { punctuate: true, interim_results: true }
        );

        return res.status(200).json({
          responseType: "text",
          text: transcriptionResult.results.channels[0].alternatives[0]
            .transcript,
          confidence:
            transcriptionResult.results.channels[0].alternatives[0].confidence,
        });
      }
    } catch (error) {
      console.error("Error with Deepgram API:", error.message);
      res.status(500).json({ error: "Processing failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
