"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Article = {
  title: string;
  link: string;
  snippet: string | null;
  published: string;
  image: string | null;
};

const NewsComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://blockza.io/chart/homenews.php");
        console.log("News data:", response.data);

        if (response.data && response.data.news_results && response.data.news_results.length > 0) {
          setArticles(response.data.news_results);
        } else {
          setArticles([]); // Clear articles if no results
        }
      } catch (error: any) {
        console.error("Failed to fetch news data:", error);
        setError("Failed to fetch news data.");
        setArticles([]); // Clear articles if there was an error
      }
    };

    fetchNews();
  }, []); // Fetch once on component mount

  // Function to truncate titles
  const truncateTitle = (title: string, length: number = 100) => {
    const trimmedTitle = title.trim();
    return trimmedTitle.length > length ? trimmedTitle.slice(0, length) + "..." : trimmedTitle;
  };

  return (
    <div className="mt-4">
      {error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <div className="list-group">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex align-items-start">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="img-thumbnail me-3"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                )}
                <div>
                  <strong className="mb-1 small d-flex">
                    {truncateTitle(article.title, 70)}
                  </strong>
                  <small>{article.published}</small>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
        }

        .list-group {
          max-height: 460px;
          overflow-y: auto;
        }

        /* Custom scrollbar styling */
        .list-group::-webkit-scrollbar {
          width: 10px;
        }

        .list-group::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .list-group::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 10px;
        }

        .list-group::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        .img-thumbnail {
          border: none;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default NewsComponent;
