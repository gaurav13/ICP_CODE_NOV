// pages/news.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type NewsItem = {
  title: string;
  link: string;
  snippet: string;
  image: string | null;
};

const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/fetchNews', { params: { query: 'Blockdaemon' } });
        console.log('News fetched:', response.data); // Log fetched news data
        setNewsItems(response.data.newsItems);
      } catch (error: any) {
        console.error('Error fetching news:', error.response?.data || error.message);
        setError('Failed to fetch news data.');
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h2 className="mb-1">
        Latest News <span className="float-md-end">Weekly Update</span>
      </h2>
      <div className="news-scroll-container">
        {error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          newsItems.map((item, index) => (
            <div key={index} className="news-item">
              <img
                className="news-image"
                src={item.image || 'https://via.placeholder.com/150'}
                alt="News Image"
              />
              <div className="news-content">
                <p className="news-title">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </p>
                <p className="news-snippet">{item.snippet}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <style jsx>{`
        .news-container {
          width: 100%;
          font-family: Arial, sans-serif;
        }
        .news-scroll-container {
          max-height: 340px;
          overflow-y: scroll;
        }
        .news-item {
          display: flex;
          padding: 10px;
          border: 1px solid #ccc;
          margin-bottom: 10px;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .news-image {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          object-fit: cover;
          border-radius: 5px;
        }
        .news-title {
          font-weight: bold;
          font-size: 14px;
          margin: 0;
        }
        .news-snippet {
          font-size: 12px;
          color: #555;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

// Main page component
const NewsPage = () => (
  <div>
    <h1>News Page</h1>
    <NewsComponent />
  </div>
);

export default NewsPage;
