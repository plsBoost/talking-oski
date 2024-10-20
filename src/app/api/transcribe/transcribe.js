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
        // Streaming audio transcription with buffer and custom flags
        const transcriptionResult = await deepgram.transcription.preRecorded(
          { buffer: audioData, mimetype: "audio/webm" },
          {
            punctuate: true,
            smart_format: true,
            no_delay: false,
            model: "nova-2", // New model selection
            filler_words: true, // Filler words included in transcription
            dictation: true, // Enhanced dictation mode
          }
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
