"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Article = {
  title: string;
  link: string;
  snippet: string | null;
  published: string;
  image: string | null;
  companynames: string;
};

const NewsComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [directoryId, setDirectoryId] = useState<string | null>(null);

  // Extract directoryId from the URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      console.log("Initial pathname:", pathname);

      const pathSegments = pathname.split('/').filter(segment => segment);
      const id = pathSegments[pathSegments.length - 1] || null;

      console.log("Extracted directoryId from URL:", id);
      setDirectoryId(id);
     {/* const params = new URLSearchParams(window.location.search);
      const id = params.get('directoryId');
      setDirectoryId(id);*/}
    }
  }, []);

  // Fetch news data when directoryId is set
  useEffect(() => {
    const fetchNews = async () => {
      if (directoryId) {
        try {
          const response = await axios.get(`https://blockza.io/chart/newss.php?id=${directoryId}`);
          console.log("url:", response);
          console.log("News data:", response.data);

          if (response.data && response.data.news_results && response.data.news_results.length > 0) {
            setArticles(response.data.news_results);
          } else {
         //   setError("No news articles found.");
            setArticles([]); // Clear articles if no results
          }
        } catch (error: any) {
          setError("Failed to fetch news data.");
          setArticles([]); // Clear articles if there was an error
        }
      }
    };

    fetchNews();
  }, [directoryId]); // Trigger only when directoryId changes

  // Helper function to format the published date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Function to truncate titles
  const truncateTitle = (title: string, length: number = 100) => {
    const trimmedTitle = title.trim();
    return trimmedTitle.length > length ? trimmedTitle.slice(0, length) + "..." : trimmedTitle;
  };

  // Don't render anything if there are no articles and no error
  if (!articles.length && !error) {
    return null;
  }

  return (
    <div className="container">
  <h2 className="mb-1">Latest News <span  className="float-md-end">Weekly Update</span></h2>
  <div className="row news-scroll-container">
    {error ? (
      <p className="text-center text-danger">{error}</p>
    ) : (
      articles.map((article, index) => (
        <div key={index} className="col-md-12 mb-1">
          <div
            className="news-item border rounded  d-flex align-items-start"
            style={{ padding: '0.7rem' }}
          >
            <img
              className="img-fluid rounded mr-3"
              src={article.image || 'https://via.placeholder.com/150'}
              alt="News Image"
              style={{ width: '60px', height: '60px', borderRadius: '5px', objectFit: 'cover' }}
            />
            <div className="d-flex flex-column ml-5">
              <strong className="small ">
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-dark">
                  {truncateTitle(article.title, 75)}
                </a>
              </strong>
              <div className="text-muted small">
                {formatDate(article.published)}
              </div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
  <style jsx>{`
  .news-scroll-container {
    max-height: 340px;
    overflow-y: scroll;
  }

  /* Custom scrollbar styling */
  .news-scroll-container::-webkit-scrollbar {
    width: 10px;
  }

  .news-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .news-scroll-container::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 10px;
    border: 3px solid #f1f1f1; /* Creates a thin track around the scrollbar thumb */
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  }

  .news-scroll-container::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  /* For Firefox */
  .news-scroll-container {
    scrollbar-width: thin;
    scrollbar-color: #333 #f1f1f1;
  }
`}</style>

</div>

  
  );
};

export default NewsComponent;
