import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import tempimg from '@/assets/Img/banner-1.png';
import React from 'react';
import logger from '@/lib/logger';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';

export default function Web3ListbyCategoryId({
  relatedDirectory,
  trendingDirectriesIds,
}: {
  relatedDirectory: any;
  trendingDirectriesIds?: any[];
}) {
  const { t, changeLocale } = useLocalization(LANG);
  const router = useRouter();
  let openArticleLink = (entryLink: any) => {
    router.push(entryLink);
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

      `}</style>
      {relatedDirectory.map((entry: any) => {
        let istrending = false;
        if (trendingDirectriesIds && trendingDirectriesIds.includes(entry[0])) {
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

    
        </div>
        );
      })}
    </>
  );
}
