export default async function handler(req, res) {
  // Allow requests from any origin (fixes the CORS error)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const prompt = `You are an expert in LLM optimisation — how well websites perform when AI systems cite or reference them.

Analyse the website: ${url}

Return ONLY valid JSON, no markdown, no extra text:

{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence verdict>",
  "scores": { "claude": <0-100>, "chatgpt": <0-100>, "gemini": <0-100>, "perplexity": <0-100> },
  "topContent": [
    { "title": "<title>", "url": "<path>", "score": <0-100>, "status": "<good|mid|bad>", "reason": "<one sentence>" }
  ],
  "recommendations": [
    { "type": "<add|improve|remove>", "title": "<title>", "desc": "<2 sentences>", "impact": "<+N pts>" }
  ],
  "strengths": ["<s1>", "<s2>", "<s3>"],
  "weaknesses": ["<w1>", "<w2>", "<w3>"]
}

Include 5-6 topContent items and exactly 4 recommendations. Vary scores realistically.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "Empty response from Claude" });
    }

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
