"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { FaEnvelope, FaLinkedin, FaTwitter, FaChevronLeft, FaChevronRight,FaBullhorn,FaUserTie,FaCalendarAlt    } from "react-icons/fa";
import { GrUserExpert } from "react-icons/gr";
import "../../styles/linkenddata.css";
import "../../styles/homeslidedata.css";
import { makeEntryActor } from '@/dfx/service/actor-locator';
import DirectoryDetailComponent from "@/components/DirectoryHomedetail/directoryhomedetail";
import DirectoryModelPopup from "@/components/DirectoryModelPopup/DirectoryModelPopup";
import HomeNews from "@/components/HomeNewsComponent/homenews";
import CompanyListSidebar from '@/components/companyListSidebar/CompanyListSidebar';
import tag from '@/assets/Img/Icons/diamond.gif';
import { MessageSquare, Share, ThumbsUp, Info } from 'lucide-react'
import { LANG } from '@/constant/language';
import Image from 'next/image';
import Link from 'next/link';
import press from '@/assets/Img/Icons/icon-press-release.png';
import TrendingPressRelease from '@/components/TrendingArticleSide/TrendingPressRelease';
import useLocalization from '@/lib/UseLocalization';
import iconrss from '@/assets/Img/Icons/icon-rss.png';


const LinkndindataComponent = () => {
  type Article = {
    name: string;
    designation: string;
    profile_link: string;
    email: string;
    profile_image: string;
    twitter: string;
    icp_id: string;
    expert_price: string;
    platform_price: string;
  };
  
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const { t, changeLocale } = useLocalization(LANG);
  const [HideTrendinpost, setHideTrendinpost] = useState<any>(true);
  const [selectedExpertPrice, setSelectedExpertPrice] = useState<string | null>(null);
  const [selectedPlatformPrice, setSelectedPlatformPrice] = useState<string | null>(null);
  const handleShowContactModal = (companyName: string, expertPrice: string, platformPrice: string) => {
    setSelectedCompanyName(companyName);
    setSelectedExpertPrice(expertPrice || "$100"); // Default value if not provided
    setSelectedPlatformPrice(platformPrice || "$50"); // Default value if not provided
    setShowContactModal(true);
  };
  

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setSelectedCompanyName(null);
  };
  const [isLoading, setIsLoading] = useState(true);
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
    slidesToShow: 3,
    slidesToScroll:3,
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
    return <div></div>;
  }

  return (
    
        
          <div className="row">
          <div className="col-md-4 news-section">
          <h4 className="fw-bold"><FaBullhorn  size={20} color="#1e5fb3" />&nbsp;<span>{LANG === 'jp' ? '最新ニュース' : 'Latest News'}
            </span></h4>
          <HomeNews />
            </div>  
          <div className="col-md-8 profile-section">
          {/* Carousel Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-2xl font-bold fw-bold "> <FaUserTie  size={20} color="#1e5fb3" />&nbsp;<span>{LANG === 'jp' ? 'トップエキスパート。最高へのアクセスがこれまでになく簡単に' : 'Top Experts. Access to the best has never been easier'}</span>
            </h4>
          </div>
          {/* Slider */}
          <div className="slider-home-te">
          <Slider {...sliderSettings}>
            {articles.map((article, index) => (
             
              <div key={index} className="px-2">
                 <div className="card-container">
                <div className="card custom-card mx-auto">
                  <div className="card-body text-start">
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
    console.log(article); 
    handleShowContactModal(article.name, article.expert_price,article.platform_price);
  }}
>
{LANG === 'jp' ? 'ミーティングを予約' : 'Book Meeting'}
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
                        className="text-decoration-none" style={{
                          color: "#000"}}
                      >
                        {article.name}
                      </a>
                    </h6>
                    <span className="text-muted">{article.designation}</span>

                    {/* Social Media Links */}
                    <div className="d-flex gap-2 mt-2">
                      {article.email && (
                        <a
                          href={`mailto:support@blockza.io`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon-link"
                        >
                          <div className="circular-socialicon">
                            <FaEnvelope size={14} color="#0a0a0a" />
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
                   <div className="pt-2"><DirectoryDetailComponent directoryId={article.icp_id} /></div>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </Slider>
          </div>
          <div className="text-center linkend-banner-image"><img src="https://blockza.io/wp-content/uploads/2025/01/blockza-services-banner.png"/></div>
          </div>
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
