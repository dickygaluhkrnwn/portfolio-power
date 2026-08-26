export async function chatWithGroq(messages: any[], systemInstruction: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  // Format messages into OpenAI format
  const formattedMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content || m.parts?.[0]?.text || "",
    })),
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: formattedMessages,
      model: "openai/gpt-oss-120b",
      stream: false,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch(e) {
      errorData = { error: { message: response.statusText } };
    }
    console.error("Groq API Error:", errorData);
    throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
