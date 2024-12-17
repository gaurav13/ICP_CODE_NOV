import React, { useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import tempimg from '@/assets/Img/banner-1.png';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import '../../styles/custom_directory.css';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
export default React.memo(function DirectorySlider({
  relatedDirectory,
  isDirectory,
}: {
  relatedDirectory: any;
  isDirectory?: boolean;
}) {
  const router = useRouter();
  var Directory = {
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: relatedDirectory.length > 6 ? 8 : 2,
    slidesToScroll: 8,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: false,
        },
      },
      {
        breakpoint: 3000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: false,
        },
      },
      {
        breakpoint: 2300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  let openArticleLink = (entryLink: any) => {
    router.push(entryLink);
  };
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
    <style jsx>{`
.trending-button {
  display: inline-flex; 
  align-items: center; 
  background-color: #1e5fb3; 
  color:#fff;
  font-weight: bold; 
  font-size: 14px;
  padding: 2px 16px; 
  border-radius: 30px; 
  text-decoration: none; 
  transition: all 0.3s ease-in-out; 
}

.trending-button .icon {
  margin-right: 8px; 
  font-size: 20px; 
}

.trending-button:hover {
  background-color: #488adf; 
  color: #c9302c; 
  transform: scale(1.05);
}
   .card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-image {
  position: relative;
  width: 100%;
}

.banner-img {
  object-fit: cover;
  width: 100%;
  height: 150px;
}

.trending-label {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ff5c5c;
  color: #fff;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}

.card-body {
  padding: 16px;
}

.company-header {
  display: flex;
  align-items: center;
}

.company-logo {
  flex-shrink: 0;
  margin-right: 12px;
}

.company-details {
  flex: 1;
}

.company-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.company-description {
  font-size: 14px;
  color: #555;
  margin: 4px 0 0;
}

.card-footer {
  padding: 16px;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.founder-info {
  display: flex;
  align-items: center;
}

.founder-img {
  margin-right: 12px;
}

.founder-name {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.founder-role {
  font-size: 12px;
  color: #777;
  margin: 4px 0 0;
}
.web-page .slide-cntnr h3{margin-bottom:12px!important;}

      `}</style>
      {relatedDirectory.length != 0 ? (
        <Slider {...Directory}>
          {relatedDirectory.map((entry: any) => {
            return (
              <div
  className="Post-padding d-flex justify-content-center mx-2"
  key={entry[0]}
>
  <Link
    href="#"
    onClick={(e) => {
      e.preventDefault();

      openArticleLink(
        entry[1].isStatic
          ? `${DIRECTORY_STATIC_PATH + entry[0]}`
          : `${
              entry.length !== 0
                ? DIRECTORY_DINAMIC_PATH + entry[0]
                : DIRECTORY_DINAMIC_PATH + '#'
            }`
      );
    }}
    className="Product-post direc"
  >
    <div className="card" style={{ maxWidth: '350px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {/* Company Banner */}
      <div className="card-image">
        <Image
          src={entry[1]?.companyBanner ?? tempimg}
          alt="Company Banner"
          height={150}
          width={250}
          className="banner-img"
          style={{
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        />
      </div>

      {/* Company Info */}
      <div className="card-body" style={{ padding: '16px' }}>
        <div className="d-flex align-items-center mb-3">
          {/* Company Logo */}
          <div className="company-logo">
            <Image
              src={entry[1]?.companyLogo ?? '/images/l-b.png'}
              width={30}
              height={30}
              alt="Company Logo"
              className="rounded-circle"
            />
          </div>
          <div className="company-details ms-3">
            <h3 className="company-name mb-1" style={{ fontSize: '16px', fontWeight: '600' }}>
              {entry[1]?.company.length > 15
                ? `${entry[1]?.company.slice(0, 15)}...`
                : entry[1]?.company ?? ''}
            </h3>
            <p className="company-description" style={{ fontSize: '14px', color: '#666' }}>
              {entry[1]?.shortDescription.length > 50
                ? `${entry[1]?.shortDescription.slice(0, 50)}...`
                : entry[1]?.shortDescription ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Founder Info */}
      <div className="card-footer" style={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
        <div className="founder-info d-flex align-items-center">
          {/* Founder Image */}
          <Image
            src={entry[1]?.founderImage ?? '/images/l-n.png'}
            width={40}
            height={40}
            alt="Founder Image"
            className="rounded-circle"
          />
          <div style={{ marginLeft: '8px' }}>
            <h5 className="founder-name mb-0" style={{ fontSize: '14px', fontWeight: '500' }}>
              {entry[1]?.founderName ?? ''}
            </h5>
            <p className="founder-role mb-0" style={{ fontSize: '12px', color: '#888' }}>
              {t('Co-founder')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Link>
</div>

            
            );
          })}
        </Slider>
      ) : (
        <h6 className='text-center'>{t('No Related Company found')}</h6>
      )}
    </>
  );
});
