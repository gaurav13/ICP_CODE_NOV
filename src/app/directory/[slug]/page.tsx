  // 'use client';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';
import axios from 'axios';
import { fromNullable } from '@dfinity/utils';
import { siteConfig } from '@/constant/config';
import { utcToLocal, utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import {
  GET_DIRECTORY_URL,
  LANG,
  LanguageForSchema,
} from '@/constant/language';
import {
  CATEGORY_ROUTE,
  DIRECTORY_STATIC_PATH,
  JSONLD_IMG_HEIGHT,
  JSONLD_IMG_WIDTH,
} from '@/constant/routes';
import Web3DirectoryDetail from '@/components/Web3DirectoryDetail/Web3DirectoryDetail';
import { DEFUALT_IMG } from '@/constant/image';
import { removeHtml } from '@/constant/helperfuntions';


interface Web3Directory {
  company: string;
  shortDescription: string;
  companyUrl: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  discord: string;
  telegram: string;
  twitter: string;
  founderName: string;
  companyBanner: string | undefined;
  catagory: string;
  founderDetail: string;
  founderImage: string | undefined;
  companyDetail: string;
  creation_time: BigInt;
  user: any;
  companyLogo: string | undefined;
}


export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [{ slug: 'dsoew2387470hl' }];
  const response = await axios.get(
    `${process.env.BASE_URL}entries/getAllDirectoriesIds/${LANG}`
  );
  const entryIds = await response.data;
  const paths = entryIds.map((id: any) => ({
    slug: id.key.toString(),
  }));
  return paths?.length > 0 ? paths : [{ slug: 'dsoew2387470hl' }];
}

export async function generateMetadata({
  params,
  searchParams,
}: any): Promise<Metadata> {
  const { slug } = params;
  let entry: Web3Directory = {
    company: 'company',
    shortDescription: 'shortDescription',
    companyUrl: 'companyUrl',
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedin',
    discord: 'discord',
    telegram: 'telegram',
    twitter: 'twitter',
    founderName: 'founderName',
    companyBanner: DEFUALT_IMG,
    catagory: 'catagory',
    founderDetail: 'founderDetail',
    founderImage: DEFUALT_IMG,
    companyDetail: 'companyDetail',
    creation_time: BigInt(0),
    user: 'user',
    companyLogo: DEFUALT_IMG,
  };
  let userId;

  let publishDate: string | undefined;
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}entries/${GET_DIRECTORY_URL}/${slug}`
    );

    const _entry = response.data;
    entry = _entry;
    entry.companyBanner = _entry.companyBanner;
    entry.user;
    publishDate = utcToLocalAdmin(
      entry?.creation_time?.toString(),
      Date_m_d_y_h_m,
      true
    );
    userId = entry?.user?.__principal__;
  } catch (error) {
    console.log(
      "Encountered an error while touching entry's metadata",
      error,
      slug
    );
  }
  return {
    title: entry?.company,
    description: entry?.shortDescription,
    category: entry?.catagory,
    robots: 'index, follow',

    authors: [
      {
        name: entry?.founderName,
        url: `${siteConfig.url}/profile?userId=${userId}`,
      },
    ],
    publisher:siteConfig.siteName,

    openGraph: {
      publishedTime: publishDate,
      url: `${siteConfig.url + DIRECTORY_STATIC_PATH + slug}/`,
      title: entry?.company,
      description: entry?.shortDescription,
      siteName:siteConfig.siteName,
      images: [{
        url: entry.companyBanner ?? DEFUALT_IMG,
        width: JSONLD_IMG_WIDTH,
        height: JSONLD_IMG_HEIGHT,
      }],
      type: 'article',
      locale:LanguageForSchema
    },
    twitter: {
      card: 'summary_large_image',
      title: entry?.company,
      description: entry?.shortDescription,
      images: entry.companyBanner ?? DEFUALT_IMG,
      creator: '@BlockZa',
    },
  };
}
export default async function Page({ params }: any) {
  const { slug } = params;
  // const articleData = getArticleData(slug);
  // logger(params, 'params');
  let entry;
  const response = await axios.get(
    `${process.env.BASE_URL}entries/${GET_DIRECTORY_URL}/${slug}`
  );

  const _entry = response.data;

  // const _entry = await entryActor.getEntryMeta(slug);
  entry = _entry;

  entry.user;
  const publishDate = utcToLocalAdmin(
    entry?.creation_time?.toString(),
    Date_m_d_y_h_m,
    true
  );
  const userId = entry?.user?.__principal__;

let jsonLd=  {
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": [entry?.companyUrl],
  "logo": entry?.companyLogo  ?? DEFUALT_IMG,
  "banner": entry?.companyBanner ?? DEFUALT_IMG,
  "name": "WEB3 Directory",
  "CompanyName": entry?.company,
  sameAs: [
    entry?.twitter[0],
    entry?.facebook[0],
    entry?.instagram[0],
    entry?.linkedin[0]

  ],
  "contactPoint": [
      {
          "@type": "ContactPoint",
          "contactType": "founder",
          "name":entry?.founderName,
          "description":  entry?.founderDetail,
          "image":entry?.founderImage  ?? DEFUALT_IMG,
      }
  ]
};
const breadcrumbJson={
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteConfig.url
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name":entry?.catagory,
      "item": `${ siteConfig.url+CATEGORY_ROUTE+entry.categoryId}`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name":entry?.title,
      "item": `${siteConfig.url+ DIRECTORY_STATIC_PATH + slug}/`,
    }
  ]
};
  return (
    <>
    <link  rel="canonical" href={`${siteConfig.url + DIRECTORY_STATIC_PATH + slug}/`}/>

     <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

     <script
        type='application/ld+json'
        id='breadcrumbJson4'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />

      <Web3DirectoryDetail directoryId={slug} /> 
    </>
  );
}
