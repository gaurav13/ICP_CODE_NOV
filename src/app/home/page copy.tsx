"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { FaEnvelope, FaLinkedin, FaTwitter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../styles/linkenddata.css";
import "../../styles/homeslidedata.css";
import DirectoryDetailComponent from "@/components/DirectoryHomedetail/directoryhomedetail";
import DirectoryModelPopup from "@/components/DirectoryModelPopup/DirectoryModelPopup";


type Article = {
  name: string;
  designation: string;
  profile_link: string;
  email: string;
  profile_image: string;
  twitter: string;
  icp_id: string;
};

const LinkndindataComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);

  const handleShowContactModal = (companyName: string) => {
    setSelectedCompanyName(companyName);
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setSelectedCompanyName(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://blockza.io/chart/linkedinhome.php`);
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
    };

    fetchData();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true, // Ensure arrows are enabled
    prevArrow: (
      <button className="slick-prev">
        <FaChevronLeft />
      </button>
    ),
    nextArrow: (
      <button className="slick-next">
        <FaChevronRight />
      </button>
    ),
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
 
  if (isError || articles.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <main id="main">
      <div className="main-inner">
        <div className="container">
          {/* Carousel Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-2xl font-bold">Top Experts. Access to the best has never been easier</h2>
          </div>
          {/* Slider */}
          <Slider {...sliderSettings}>
            {articles.map((article, index) => (
              <div key={index} className="px-2">
                <div className="card custom-card mx-auto">
                  <div className="card-body text-center">
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
                              handleShowContactModal(article.name);
                            }}
                          >
                            Book Meeting
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Name and Designation */}
                    <h6 className="card-title fw-bold mb-1">
                      <a
                        href={`https://pro.blockza.io/directory/${article.icp_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        {article.name}
                      </a>
                    </h6>
                    <span className="text-muted">{article.designation}</span>

                    {/* Social Media Links */}
                    <div className="d-flex justify-content-center gap-3 mt-2">
                      {article.email && (
                        <a
                          href={`mailto:${article.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon-link"
                        >
                          <div className="circular-socialicon">
                            <FaEnvelope size={14} color="#1e5fb3" />
                          </div>
                        </a>
                      )}
                      {article.profile_link && (
                        <a
                          href={article.profile_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon-link"
                        >
                          <div className="circular-socialicon">
                            <FaLinkedin size={14} color="#1e5fb3" />
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
                            <FaTwitter size={14} color="#1e5fb3" />
                          </div>
                        </a>
                      )}
                       
                    </div>
                   <div className="pt-2"><DirectoryDetailComponent directoryId={article.icp_id} /></div>
                  </div>
                </div>
              </div>

            ))}
          </Slider>
        </div>
      </div>

      {/* Directory Modal Popup */}
      {selectedCompanyName && (
        <DirectoryModelPopup
          show={showContactModal}
          handleClose={handleCloseContactModal}
          companyName={selectedCompanyName}
        />
      )}
    </main>
  );
};

export default LinkndindataComponent;
