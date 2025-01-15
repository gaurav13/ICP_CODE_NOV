"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLinkedin, FaTwitter } from "react-icons/fa";
import { usePathname } from "next/navigation";
import "../../styles/linkenddata.css";
import DirectoryModelPopup from "@/components/DirectoryModelPopup/DirectoryModelPopup";
import article from "@/app/web3-directory/oldPage";

type Article = {
  name: string;
  designation: string;
  profile_link: string;
  email: string;
  profile_image: string;
  twitter: string;
  expert_price: string;
  platform_price: string;
};

const LinkndindataComponent = () => {
  // States for articles and directoryId
  const [articles, setArticles] = useState<Article[]>([]);
  const [directoryId, setDirectoryId] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // Modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [selectedExpertPrice, setSelectedExpertPrice] = useState<string | null>(null);
  const [selectedPlatformPrice, setSelectedPlatformPrice] = useState<string | null>(null);

  const handleShowContactModal = (
    companyName: string,
    expertPrice: string,
    platformPrice: string
  ) => {
    setSelectedCompanyName(companyName); // Set the selected company name
    setSelectedExpertPrice(expertPrice); // Set the expert price
    setSelectedPlatformPrice(platformPrice); // Set the platform price
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setSelectedCompanyName(null); // Clear the selected company name
    setSelectedExpertPrice(null); // Clear the expert price
    setSelectedPlatformPrice(null); // Clear the platform price
  };

  const pathname = usePathname();

  useEffect(() => {
    // Extract directoryId from URL
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const pathSegments = pathname.split("/").filter((segment) => segment);
      const id = pathSegments[pathSegments.length - 1] || null;

      setDirectoryId(id);
    }

    const fetchData = async () => {
      if (directoryId) {
        try {
          const response = await axios.get(
            `https://blockza.io/chart/linkedin.php?id=${directoryId}`
          );

          if (Array.isArray(response.data) && response.data.length > 0) {
            setArticles(response.data);
            setIsError(false);
          } else {
            setArticles([]);
            setIsError(true);
          }
        } catch (error) {
          console.error("Error fetching chart data:", error);
          setArticles([]);
          setIsError(true);
        }
      }
    };

    if (directoryId) {
      fetchData();
    }
  }, [pathname, directoryId]);

  // Handle case where no data is available or there was an error
  if (isError || articles.length === 0) {
    return <div></div>;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        {articles.map((article, index) => (
          <div key={index} className="col-md-4 mb-4 d-flex">
            <div className="card custom-card flex-grow-1 d-flex flex-column">
              <div className="card-body text-center d-flex flex-column">
                {/* Profile Image */}
                <div className="hover-card">
                  <div className="image-container">
                    <img
                      src={article.profile_image}
                      alt={`${article.name}'s profile`}
                      className="profile-image"
                    />
                    <div className="overlay">
                    <button
  className="book-button"
  onClick={(e) => {
    e.preventDefault();
    console.log(article); // Check article content here
    handleShowContactModal(article.name, article.expert_price, article.platform_price);
  }}
>
  Book Meeting
</button>
                    </div>
                  </div>
                </div>

                {/* Name and Designation */}
                <h6 className="card-title fw-bold mb-1">{article.name}</h6>
                <span className="text-muted">{article.designation}</span>

                {/* Spacer to push content to the top */}
                <div className="flex-grow-1"></div>

                {/* Social Media Links */}
                <div className="d-flex justify-content-center gap-3 mb-2">
                  <a
                    href="mailto:support@blockza.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                  >
                    <div className="circular-socialicon">
                      <FaEnvelope size={14} color="#0a0a0a" />
                    </div>
                  </a>
                  {article.profile_link && (
                    <a
                      href={article.profile_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-link"
                    >
                      <div className="circular-socialicon">
                        <FaLinkedin size={14} color="#0a0a0a" />
                      </div>
                    </a>
                  )}
                  {article.twitter && (
                    <a
                      href={article.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-link"
                    >
                      <div className="circular-socialicon">
                        <FaTwitter size={14} color="#0a0a0a" />
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Directory Modal Popup */}
      {selectedCompanyName && (
        <DirectoryModelPopup
          show={showContactModal}
          handleClose={handleCloseContactModal}
          companyName={selectedCompanyName}
          expertPrice={selectedExpertPrice}
          platformPrice={selectedPlatformPrice}
        />
      )}
    </div>
  );
};

export default LinkndindataComponent;
