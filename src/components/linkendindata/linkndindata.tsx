"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

type Article = {
  name: string;
  designation: string;
  profile_link: string;
  email: string;
  profile_image: string;
  twitter:string;
};

const LinkndindataComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const pathname = usePathname();
  const [directoryId, setDirectoryId] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false); // Track if an error occurs

  useEffect(() => {
    // Extract directoryId from URL
    if (typeof window !== "undefined") {
     const pathname = window.location.pathname;
      console.log("Initial pathname:", pathname);
    
      const pathSegments = pathname.split('/').filter(segment => segment);
      const id = pathSegments[pathSegments.length - 1] || null;
    
      console.log("Extracted directoryId from URL:", id);
      setDirectoryId(id); 
     { /*const params = new URLSearchParams(window.location.search);
      const id = params.get('directoryId');
      setDirectoryId(id);*/}
    }
    

    const fetchData = async () => {
      if (directoryId) {
        try {
          const response = await axios.get(`https://blockza.io/chart/linkedin.php?id=${directoryId}`);
          console.log("Fetched linkedindata:", response.data);

          // Check if the response is an array and has content
          if (Array.isArray(response.data) && response.data.length > 0) {
            setArticles(response.data);
            setIsError(false);
          } else {
            setArticles([]); // Set empty array if no data is returned or if it's not an array
            setIsError(true); // Set error to show no data available
          }
        } catch (error) {
          console.error("Error fetching chart data:", error);
          setArticles([]); // Set empty array on error
          setIsError(true); // Set error to indicate an issue with the fetch
        }
      }
    };

    // Call fetchData if directoryId is set
    if (directoryId) {
      fetchData();
    }
  }, [pathname, directoryId]); // Dependencies include pathname and directoryId

  // Handle case where no data is available or there was an error
  if (isError || articles.length === 0) {
    return ;
  }

  return (
    <div className="container">
      <div className="row">
        {articles.map((article, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="shadow-txt-pnl p-3 rounded">
            <h6 className="m-0"><b>{article.name}</b></h6>
            <p className="m-0">{article.designation}</p>
              
              <div className="d-flex align-items-center">
                <div className="img-pnl radius">
                  <img
                    src={article.profile_image}
                    alt={`${article.name}'s profile`}
                    width="50"
                    height="50"
                    className="rounded-circle"
                    loading="lazy"
                    style={{ color: 'transparent' }}
                  />
                </div>
                <div className="txt-pnl mx-2">
                  {/*<h6 className="m-0"><b>{article.name}</b></h6>
                  <p className="m-0">{article.designation}</p>*/}
                  <div className="d-flex mt-2">
    <a
      href="https://blockza.io/about/advertise-with-us/"
      target="_blank"
      rel="noopener noreferrer"
      className="me-2 text-dark"
    >
      <FaEnvelope />
    </a>
    {article.profile_link && (
      <a
        href={article.profile_link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-dark me-2"
      >
        <FaLinkedin />
      </a>
    )}
    {article.twitter && (
      <a
        href={article.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-dark"
      >
         <i className="fab fa-twitter"></i> {/* Twitter Icon */}
      </a>
    )}
  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkndindataComponent;
