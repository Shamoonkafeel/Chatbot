app.post('/api/chat', async (req, res) => {
  try {
    const { history } = req.body;
    if (!history) return res.status(400).send('No history provided');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: history,
        max_tokens: 800,
        temperature: 0.2
      })
    });

    const text = await response.text(); // first read as text
    if (!response.ok) {
      console.error('API Error:', text);
      return res.status(500).send('API Error: ' + text);
    }

    // Try to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('JSON Parse Error:', err, text);
      return res.status(500).send('API returned invalid JSON');
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'No reply';
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});
