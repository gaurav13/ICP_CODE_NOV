import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import Web3CategoryLink from "@/components/Web3catLinks/web3catlink";
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
export default function Web3ListbyCategoryId({
  relatedDirectory,
  trendingDirectriesIds,
  categoryId,
}: {
  relatedDirectory: any;
  trendingDirectriesIds?: any[];
  categoryId: string;
}) {
  const { t } = useLocalization(LANG);
  const router = useRouter();

  // Declare subcategories in the state
  const [subcategories, setSubcategories] = useState<{ [key: string]: string }>({});

  const openArticleLink = (entryLink: any) => {
    router.push(entryLink);
  };

  useEffect(() => {
    const fetchSubcategories = async (categoryId: string) => {
      try {
        console.log('Fetching subcategories for categoryId:', categoryId);

        const defaultEntryActor = makeEntryActor({ agentOptions: {} });

        const resp = await defaultEntryActor.get_list_categories(
          '', // Search query
          0, // Start index
          100, // Length
          false // Include all categories
        );

        console.log('Raw categories response:', resp);

        const allCategories = resp.entries || [];
        const parentCategory = allCategories.find(
          ([id]: [string, any]) => id === categoryId
        );

        if (!parentCategory) {
          console.warn(`Parent category with ID ${categoryId} not found.`);
          return {};
        }

        console.log('Parent category found:', parentCategory);

        const children = parentCategory[1]?.children || [];

        if (children.length === 0) {
          console.warn(`No subcategories available for categoryId: ${categoryId}`);
          return {};
        }

        console.log('Subcategory IDs:', children);

        const flattenedChildren = children.flat();
        const subcategories = flattenedChildren.reduce(
          (acc: { [key: string]: string }, subcategoryId: string) => {
            const subcategory = allCategories.find(
              ([id]: [string, any]) => String(id) === String(subcategoryId)
            );

            if (subcategory) {
              acc[subcategory[1].name || 'Unnamed Subcategory'] = subcategoryId;
            } else {
              console.warn(
                `Subcategory with ID ${subcategoryId} not found in allCategories.`
              );
            }

            return acc;
          },
          {}
        );

        console.log('Formatted Subcategories JSON:', subcategories);
        return subcategories;
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        return {};
      }
    };

    if (categoryId) {
      fetchSubcategories(categoryId).then((fetchedSubcategories) => {
        setSubcategories(fetchedSubcategories); // Update state
      });
    }
  }, [categoryId]);
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


      `}</style>
      {relatedDirectory.map((entry: any) => {
        let istrending = false;
        if (trendingDirectriesIds && trendingDirectriesIds.includes(entry[0])) {
          istrending = true;
        }
        return (
          <div
            className='Post-padding '
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
            entry.length != 0
              ? DIRECTORY_DINAMIC_PATH + entry[0]
              : DIRECTORY_DINAMIC_PATH + "#"
          }`
    );
  }}
  className="Product-post direc"
>
<div className="card">
    {/* Company Banner */}
    <Link
  href={
    entry[1].isStatic
      ? `${DIRECTORY_STATIC_PATH + entry[0]}`
      : `${
          entry.length !== 0
            ? DIRECTORY_DINAMIC_PATH + entry[0]
            : DIRECTORY_DINAMIC_PATH + '#'
        }`
  }
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
            {/* Add a Link for each subcategory */}
            <Web3CategoryLink categoryId={id}>
              {name}
              </Web3CategoryLink>
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
  href={
    entry[1].isStatic
      ? `${DIRECTORY_STATIC_PATH + entry[0]}`
      : `${
          entry.length !== 0
            ? DIRECTORY_DINAMIC_PATH + entry[0]
            : DIRECTORY_DINAMIC_PATH + '#'
        }`
  }
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
</Link>

          </div>
        );
      })}
    </>
  );
}
