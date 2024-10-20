import { createClient } from "@deepgram/sdk";

// Initialize Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export async function POST(req, res) {
  const { text } = req.body;

  try {
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    const buffer = await getAudioBuffer(stream);

    // Send the audio buffer directly back to the client
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", "inline; filename=oski_response.wav");
    res.send(buffer);
  } catch (err) {
    console.error("Error generating audio:", err);
    res.status(500).send({ error: "Failed to generate audio." });
  }
}

// Helper to convert the stream into a buffer
async function getAudioBuffer(stream) {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = Uint8Array.from(chunks.flat());
  return Buffer.from(dataArray.buffer);
}
