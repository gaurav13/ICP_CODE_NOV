import React, { useEffect, useState } from 'react'; // Added useState here
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import tempimg from '@/assets/Img/banner-1.png';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { makeEntryActor } from "@/dfx/service/actor-locator";
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { fetchSubcategories } from '@/components/SubcategoryFetcher/subcategoryfetcher';
import { LANG } from '@/constant/language';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
import { Bold } from 'lucide-react';

export default React.memo(function DirectorySlider({
  relatedDirectory,
  trendingDirectriesIds,
  categoryId, // New prop
}: {
  relatedDirectory: any;
  trendingDirectriesIds?: any;
  categoryId: string; // Define the type for the new prop
}) {
  const [subcategories, setSubcategories] = useState<{ [key: string]: string }>(
    {}
  );

  const router = useRouter();
  const Directory = {
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
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
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

  const openArticleLink = (entryLink: any) => {
    router.push(entryLink);
  };

  const { t, changeLocale } = useLocalization(LANG);

  useEffect(() => {
    console.log("Category ID Manu:", categoryId); // Debug to verify the value of categoryId
    // Use categoryId for any logic or API calls as needed
  }, [categoryId]);

  useEffect(() => {
    const fetchSubcategories = async (categoryId: string) => {
      try {
        console.log("Fetching subcategories for categoryId:", categoryId);

        // Initialize the entry actor
        const defaultEntryActor = makeEntryActor({ agentOptions: {} });

        // Fetch the category data
        const resp = await defaultEntryActor.get_list_categories(
          "", // Search query (leave empty if not needed)
          0,  // Start index (pagination)
          100, // Length (number of items to fetch)
          false // Include all categories, not just parent categories
        );

        console.log("Raw categories response:", resp);

        // Find the parent category
        const allCategories = resp.entries || [];
        const parentCategory = allCategories.find(
          ([id]: [string, any]) => id === categoryId
        );

        if (!parentCategory) {
          console.warn(`Parent category with ID ${categoryId} not found.`);
          return {};
        }

        console.log(`Parent category found:`, parentCategory);

        const children = parentCategory[1].children || [];

        // Check if `children` is empty
        if (children.length === 0) {
          console.warn(`No subcategories available for categoryId: ${categoryId}`);
          return {};
        }

        console.log("Subcategory IDs:", children);

        // Map subcategory IDs to their corresponding data
        const flattenedChildren = children.flat(); // Flatten the array to handle nested IDs

        const subcategories = flattenedChildren.reduce(
          (acc: { [key: string]: string }, subcategoryId: string) => {
            const subcategory = allCategories.find(
              ([id]: [string, any]) => String(id) === String(subcategoryId)
            );
        
            if (subcategory) {
              acc[subcategory[1].name || "Unnamed Subcategory"] = subcategoryId;
            } else {
              console.warn(
                `Subcategory with ID ${subcategoryId} not found in allCategories.`
              );
            }
        
            return acc;
          },
          {}
        );
        

        console.log("Formatted Subcategories JSON:", subcategories);

        return subcategories;
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        return {};
      }
    };

    if (categoryId) {
      fetchSubcategories(categoryId).then((fetchedSubcategories) => {
        setSubcategories(fetchedSubcategories);
      });
    }
  }, [categoryId]);
  const slugify = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
  };
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
            let istrending = false;
            if (
              trendingDirectriesIds &&
              trendingDirectriesIds.includes(entry[0])
            ) {
              istrending = true;
            }
            return (
              <div
                className='Post-padding  d-flex justify-content-center mx-2'
                key={entry[0]}
              >
                
               
                  <div className="card">
    {/* Company Banner */}
    <Link
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();

                    openArticleLink(
                      entry[1].isStatic
                        ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                        : `${
                            entry.length != 0
                              ? DIRECTORY_DINAMIC_PATH + entry[0]
                              : DIRECTORY_DINAMIC_PATH + '#'
                          }`
                    );
                  }}
                  className='Product-post direc'
                >
    <div className="card-image">
      <Image
        src={entry[1]?.companyBanner ?? tempimg}
        alt="Company Banner"
        height={150}
        width={250}
        className="banner-img"
      />
      {istrending && (
        <p className="trending-label">
          <i
            className="fa fa-line-chart"
            style={{ marginRight: "4px" }}
          />
          {t("Trending")}
        </p>
      )}
    </div> </Link>
    <div style={{ padding: "10px" }}>
  {/* Add padding around the container */}
  
  {Object.keys(subcategories).length > 0 && (
    <ul className="list-unstyled d-flex flex-wrap gap-2" style={{ margin: 0, padding: 0 }}>
      {Object.entries(subcategories)
        .filter(([_, id]) => entry[1]?.catagory === id) // Filter condition
        .map(([name, id]) => (
          <li key={id}>
            {/* Add a Link for each subcategory ${slugify(name)} */}
            <Link
              href={`/web3-directory/?category=${id}`}
              className="inline-flex items-center shadow border border-solid rounded px-2 py-1 leading-3 text-decoration-none"
              style={{
                borderColor: "#1e5fb3", // Border color
                color: "#1e5fb3", // Text color
                borderRadius: "4px", // Slight rounding
                textAlign: "center",
                background: "#ffc1073b", // Semi-transparent yellow background
                fontSize: "12px", // Font size
              }}
            >
              {name}
            </Link>
          </li>
        ))}
    </ul>
  )}
</div>

    <div className="card-body">
      <div className="company-header">
        <div className="company-logo">
          <Image
            src={entry[1]?.companyLogo ?? "/images/l-b.png"}
            width={30}
            height={30}
            alt="Company Logo"
            className="rounded-circle"
          />
        </div>
        <div className="company-details">
        <Link
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();

                    openArticleLink(
                      entry[1].isStatic
                        ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                        : `${
                            entry.length != 0
                              ? DIRECTORY_DINAMIC_PATH + entry[0]
                              : DIRECTORY_DINAMIC_PATH + '#'
                          }`
                    );
                  }}
                  className='Product-post direc'
                ><h3 className="company-name">
            {entry[1]?.company.length > 15
              ? `${entry[1]?.company.slice(0, 15)}...`
              : entry[1]?.company ?? ""}
          </h3></Link>
          <p className="company-description">
            {entry[1]?.shortDescription.length > 50
              ? `${entry[1]?.shortDescription.slice(0, 250)}`
              : entry[1]?.shortDescription ?? ""}
          </p>
        </div>
      </div>
    </div>

    {/* Founder Info */}
    <div className="card-footer">
      <div className="founder-info">
        <Image
          src={entry[1]?.founderImage ?? "/images/l-n.png"}
          width={40}
          height={40}
          alt="Founder Image"
          className="rounded-circle founder-img"
        />
        <div style={{ marginLeft: '8px' }}>
          <h5 className="founder-name">{entry[1]?.founderName ?? ""}</h5>
          <p className="founder-role">{t("Co-founded")}</p>
        </div>
      </div>
    </div>
  </div>

          
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