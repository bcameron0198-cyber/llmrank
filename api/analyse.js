export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const prompt = `You are an expert in LLM optimisation. Analyse this website: ${url}

Return ONLY a raw JSON object, no markdown, no backticks, no extra text. Just the JSON:
{"overallScore":75,"summary":"2-3 sentence verdict here","scores":{"claude":70,"chatgpt":75,"gemini":80,"perplexity":65},"topContent":[{"title":"Page title","url":"/path","score":80,"status":"good","reason":"One sentence reason"},{"title":"Page title","url":"/path","score":60,"status":"mid","reason":"One sentence reason"},{"title":"Page title","url":"/path","score":40,"status":"bad","reason":"One sentence reason"},{"title":"Page title","url":"/path","score":75,"status":"good","reason":"One sentence reason"},{"title":"Page title","url":"/path","score":55,"status":"mid","reason":"One sentence reason"}],"recommendations":[{"type":"add","title":"Rec title","desc":"Two sentence description.","impact":"+8 pts"},{"type":"improve","title":"Rec title","desc":"Two sentence description.","impact":"+6 pts"},{"type":"remove","title":"Rec title","desc":"Two sentence description.","impact":"+4 pts"},{"type":"improve","title":"Rec title","desc":"Two sentence description.","impact":"+5 pts"}],"strengths":["Strength one","Strength two","Strength three"],"weaknesses":["Weakness one","Weakness two","Weakness three"]}

Fill in real values based on your knowledge of ${url}. Keep the exact same JSON structure.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: JSON.stringify(data) });
    }

    const text = data?.content?.[0]?.text;
    if (!text) {
      return res.status(500).json({ error: "No text in response: " + JSON.stringify(data) });
    }

    const cleaned = text.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();
    const result = JSON.parse(cleaned);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
