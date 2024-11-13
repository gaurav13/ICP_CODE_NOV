"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

type Article = {
  title: string;
  link: string;
  thumbnail: string;
  source: string;
  date: string;
};

const NewsComponent = () => {
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);
  const [directoryId, setDirectoryId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>(''); // State for debugging URL
  const pathname = usePathname();

  // Fetch company data based on the directoryId
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('directoryId');

      if (id) {
        setDirectoryId(id);

        const fetchData = async () => {
          try {
            const response = await axios.get(`https://blockza.io/chart/company.php?id=${id}`);
            if (response.data) {
              setCompanyName(response.data);
              setIsDataAvailable(true);
            } else {
              setIsDataAvailable(false);
            }
          } catch (error) {
            setIsDataAvailable(false);
            console.error("Error fetching company data:", error);
          }
        };

        fetchData();
      }
    }
  }, [pathname]);

  // Fetch news articles based on the companyName
  useEffect(() => {
    const fetchNews = async () => {
      if (!companyName) return;

      const apiKey = '3d59128e818e735d72132167e46a2b6e16fa1910e592f3933ae83ce13f545cd2';
      const generatedUrl = `https://serpapi.com/search?engine=google_news&q=${encodeURIComponent(
        companyName
      )}&api_key=${apiKey}`;
      
      setUrl(generatedUrl); // Set the URL for debugging

      try {
        const response = await axios.get(generatedUrl);
        if (response.data.news_results && response.data.news_results.length > 0) {
          const formattedArticles = response.data.news_results.map((item: any) => ({
            title: item.title,
            link: item.link,
            thumbnail: item.thumbnail ?? 'https://via.placeholder.com/50',
            source: item.source ?? 'Unknown source',
            date: item.date ?? 'Unknown date',
          }));
          setArticles(formattedArticles);
        } else {
          setError(`No news articles found for ${companyName}`);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to retrieve news articles.');
      }
    };

    fetchNews();
  }, [companyName]);

  return (
    <div style={{ width: 'auto' }}>
      <div className="news-header">
        <span>Latestsss {companyName} News </span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          View All
        </a>
      </div>

      {/* Display the URL in a div for debugging */}
      <div className="url-debug" style={{ margin: '10px 0', color: 'red' }}>
        <strong>Debug URL:</strong> {url || "URL not generated yet"}
      </div>

      <div className="news-container">
        {error ? (
          <p className="text-center text-danger">{error}</p>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="news-item">
              <img
                src={article.thumbnail}
                className="news-image"
                alt="News"
              />
              <div className="news-content">
                <p className="news-title">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </p>
                <p className="news-source">{article.source}</p>
                <p className="news-time text-right">
                  {new Date(article.date).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Loading...</p>
        )}
      </div>

      <style jsx>{`
        .news-container {
          max-height: 400px;
          overflow-y: scroll;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .news-header {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .news-header a {
          font-size: 0.9rem;
          color: #007bff;
        }
        .news-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }
        .news-item:last-child {
          border-bottom: none;
        }
        .news-title {
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0;
        }
        .news-source {
          font-size: 0.8rem;
          color: #888;
        }
        .news-image {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          border-radius: 5px;
          object-fit: cover;
        }
        .news-content {
          flex: 1;
        }
        .news-time {
          font-size: 0.8rem;
          color: #999;
        }
        .url-debug {
          font-size: 0.9rem;
          color: red;
        }
      `}</style>
    </div>
  );
};

export default NewsComponent;
