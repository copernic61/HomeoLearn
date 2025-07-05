export async function generateWithOpenAI(prompt, lessonContext = '') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const systemPrompt = lessonContext
    ? `Отговаряй само с информация от следния урок: "${lessonContext}". Ако въпросът не е по темата, отговори, че не можеш да помогнеш.`
    : 'Отговаряй само по темата на урока.';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 256
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
} 