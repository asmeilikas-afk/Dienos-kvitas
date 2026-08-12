// Serverio funkcija: paslepia tavo Anthropic API rakta.
// Naršyklė kreipiasi cia (/api/nutrition), o raktas lieka serveryje (env kintamajame).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Tik POST" });
    return;
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Truksta ANTHROPIC_API_KEY. Iraskite ji Vercel Environment Variables." });
    return;
  }

  try {
    const { system, messages } = req.body || {};
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: system,
        messages: messages,
      }),
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
