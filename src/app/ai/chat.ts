import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Search website content function
const searchWebsiteContent = async (query: string): Promise<string | null> => {
  // Replace this with your actual database or CMS logic
  const mockDatabase = [
    { question: 'What is your refund policy?', answer: 'Our refund policy lasts 30 days.' },
    { question: 'How to contact support?', answer: 'You can email us at support@example.com.' },
  ];

  // Check if the query matches a database entry
  const result = mockDatabase.find((item) =>
    item.question.toLowerCase().includes(query.toLowerCase())
  );

  return result ? result.answer : null;
};

// Fetch ChatGPT response function
const getChatGPTResponse = async (query: string): Promise<string> => {
  const apiKey = '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'; // Replace with your OpenAI API key
  const url = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    model: 'gpt-4',
    messages: [{ role: 'user', content: query }],
  };

  const response = await axios.post(url, data, { headers });
  return response.data.choices[0].message.content;
};

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    // Step 1: Search website content
    const websiteResponse = await searchWebsiteContent(query);

    if (websiteResponse) {
      return res.status(200).json({ source: 'website', response: websiteResponse });
    }

    // Step 2: Get ChatGPT response
    try {
      const chatGPTResponse = await getChatGPTResponse(query);
      return res.status(200).json({ source: 'chatgpt', response: chatGPTResponse });
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
      return res.status(500).json({ error: 'Failed to fetch ChatGPT response.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
