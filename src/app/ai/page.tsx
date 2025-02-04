'use client';

import { useState } from 'react';
import moment from 'moment';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { LANG } from '@/constant/language';
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Page: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  // Function to search website content
  const searchWebsiteContent = async (query: string): Promise<string | null> => {
    const mockDatabase = [
      { question: 'What is your refund policy?', answer: 'Our refund policy lasts 30 days.' },
      { question: 'How to contact support?', answer: 'You can email us at support@example.com.' },
    ];

    const result = mockDatabase.find((item) =>
      item.question.toLowerCase().includes(query.toLowerCase())
    );

    return result ? result.answer : null;
  };
  const testDateJP = "2024年9月11日"; // Japanese date format
  const testDateEN = "2024-09-11";  // Standard ISO format
  
  console.log("JP Date Parsed:", moment(testDateJP, 'YYYY年M月D日').isValid());
  console.log("EN Date Parsed:", moment(testDateEN).isValid());
  
  console.log("JP Formatted:", moment(testDateJP, 'YYYY年M月D日').format('YYYY-MM-DD'));
  console.log("EN Formatted:", moment(testDateEN).format('YYYY-MM-DD'));
  // Function to fetch ChatGPT response
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

    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
    const responseData = await response.json();
    return responseData.choices[0].message.content;
  };

  // Handle user message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    // Step 1: Search website content
    const websiteResponse = await searchWebsiteContent(userInput);

    if (websiteResponse) {
      setMessages((prev) => [...prev, { sender: 'bot', text: websiteResponse }]);
    } else {
      // Step 2: Get ChatGPT response
      try {
        const chatGPTResponse = await getChatGPTResponse(userInput);
        setMessages((prev) => [...prev, { sender: 'bot', text: chatGPTResponse }]);
      } catch (error) {
        console.error('Error fetching ChatGPT response:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' },
        ]);
      }
    }

    setUserInput('');
  };

  return (
    <main id='main'>
    <div className='main-inner'>
          <div className='inner-content'>
          <span className="small-text fw-semibold"> 
 

  {moment("2024年9月11日", "YYYY年M月D日").isValid() && moment("2024年9月11日", "YYYY年M月D日").isValid() ? (
    moment("2024年9月11日", "YYYY年M月D日").format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY') === 
    moment("2024年9月11日", "YYYY年M月D日").format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')
      ? `${moment("2024年9月11日", "YYYY年M月D日").format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} 
         (${moment("2024年9月11日", "YYYY年M月D日").format('hh:mm A')} - ${moment("2024年9月11日", "YYYY年M月D日").format('hh:mm A')})`
      : `${moment("2024年9月11日", "YYYY年M月D日").format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} - 
         ${moment("2024年9月11日", "YYYY年M月D日").format(LANG === 'jp' ? 'YYYY年M月D日' : 'MMM D, YYYY')} 
         (${moment("2024年9月11日", "YYYY年M月D日").format('hh:mm A')} - ${moment("2024年9月11日", "YYYY年M月D日").format('hh:mm A')})`
  ) : 'Invalid Date'}
</span>

    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === 'bot' && (
              <img
                src="https://blockza.io/wp-content/uploads/2024/09/blockza-3.png" // Replace with the path to your avatar image
                alt="Bot Avatar"
                className="avatar"
              />
            )}
            <div className="text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <style jsx>{`
        .chat-container {
          width: 100%;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background: #f9f9f9;
        }
        .chat-box {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
        }
        .message {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .message.user .text {
          background: #007bff;
          color: white;
          align-self: flex-end;
        }
        .message.bot .text {
          background: #e6f7ff;
          color: black;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .text {
          padding: 10px 15px;
          border-radius: 10px;
          max-width: 70%;
        }
        .input-container {
          display: flex;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 10px;
        }
        button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div></div></div>
    </main>
  );
};

export default Page;
