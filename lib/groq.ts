import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzePlaylist(
  tracks: { name: string; artists: { name: string }[] }[]
) {
  const trackStrings = tracks
    .slice(0, 100)
    .map((t) => `${t.name} - ${t.artists.map((a) => a.name).join(", ")}`);

  const prompt = `
    You are an AI that analyzes music playlists.

    I have a playlist containing the following tracks:
    ${JSON.stringify(trackStrings, null, 2)}

    Your tasks:
    1. Analyze the mood of the playlist.
    2. Infer what this playlist would be if it were:
       - a famous person
       - an animal
       - an object
       - a place
       - a movie or TV series character
       - a color
       - a food or drink
       - astrological sign
       - MBTI type
       - mythological creature
    3. For each category, choose something that exists in Wikipedia.
    4. Provide:
       - name
       - description (max 3 sentences)
       - reasoning (why it matches)
       - a confidence score (0–1)

    Return ONLY a valid JSON object in the following structure — no extra text:

    {
      "mood": string,
      "genre": string,
      "matches": [
          {
            "category": string,
            "name": string,
            "description": string,
            "reasoning": string,
            "confidence": number
          }
      ]
    }

    Rules:
    - Analyze whole by the context and lyrics of the song. Do not infer the mood from the title only.
    - Your answer choices are limitless; do not repeat too often if you can find another example.
    - The JSON MUST NOT contain trailing commas.
    - "matches" MUST have only 10 items (famous person, animal, object, place, movie or TV series character, color, food or drink, astrological sign, MBTI type, mythological creature).
    - Mood and genre both are strings containing 3-5 words each, separated with comma.
    - Do not include explanations outside the JSON.
  `;

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_completion_tokens: 2048,
  });

  return res.choices[0].message?.content;
}
