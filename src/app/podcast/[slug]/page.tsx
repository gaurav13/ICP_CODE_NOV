// 'use client';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import iconbnb from '@/assets/Img/icon-bnb.png';
import { Metadata, MetadataRoute, ResolvingMetadata } from 'next';
import Article from '@/components/Article';
import axios from 'axios';
import { fromNullable } from '@dfinity/utils';
import { siteConfig } from '@/constant/config';
import { utcToLocal, utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { Date_m_d_y_h_m, modifiedDateFormate } from '@/constant/DateFormates';
import { GET_ENTRY_URL, LANG, LanguageForSchema } from '@/constant/language';
import { ARTICLE_STATIC_PATH, CATEGORY_ROUTE, JSONLD_IMG_HEIGHT, JSONLD_IMG_WIDTH, Podcast_STATIC_PATH } from '@/constant/routes';
import Podcast from '@/components/Podcast';
import { DEFUALT_IMG } from '@/constant/image';
import { iframeimgThumbnail } from '@/components/utils/getImage';
import JSONLD from '@/components/JSONLD/JSONLD';
import { removeHtml } from '@/constant/helperfuntions';

const entryActor = makeEntryActor();
interface ArticleType {
  title: string;
  image: string | undefined;
  seoSlug: string;
  seoDescription: string;
  category: string;
  podcastImg: string | undefined;
  creation_time: BigInt;
  user: any;
  userName: string;
  seoTitle: string;
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [{ slug: 'dsoew2387470hl' }];
  const response = await axios.get(
    `${process.env.BASE_URL}entries/getAllEntryIds/podcast/${LANG}`
  );
  const entryIds = await response.data;
  const paths = entryIds.map((id: any) => ({
    slug: id.key?.toString(),
  }));
  return paths?.length > 0 ? paths : [{ slug: 'dsoew2387470hl' }];
}
export async function generateMetadata({
  params,
  searchParams,
}: any): Promise<Metadata> {
  const { slug } = params;
  let entry: ArticleType = {
    title: 'Article',
    seoSlug: 'article',
    image: DEFUALT_IMG,
    seoDescription: 'The best Article',
    category: 'super',
    podcastImg: DEFUALT_IMG,
    creation_time: BigInt(0),
    user: '',
    userName: '',
    seoTitle: '',
  };
  let userId;

  let publishDate: string | undefined;
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}entries/${GET_ENTRY_URL}/${slug}`
    );

    const _entry = response.data;
    entry = _entry;
    if (_entry?.podcastVideoLink != '') {
      entry.image = iframeimgThumbnail(_entry?.podcastVideoLink);
    }
    entry.image = fromNullable(_entry.image);
    entry.podcastImg = fromNullable(_entry?.podcastImg);
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
    title: entry?.seoTitle,
    description: entry?.seoDescription,
    category: entry.category[0],
    robots: 'index, follow',

    authors: [
      {
        name: entry?.userName,
        url: `${siteConfig.url}/profile?userId=${userId}`,
      },
    ],
    publisher: siteConfig.siteName,

    openGraph: {
      publishedTime: publishDate,
      url: `${siteConfig.url +Podcast_STATIC_PATH +slug}/`,
      title: entry?.seoTitle,
      description: entry?.seoDescription,
      siteName: siteConfig.siteName,
      images: [ {
        url: entry.image ?? DEFUALT_IMG,
        width: JSONLD_IMG_WIDTH, 
        height: JSONLD_IMG_HEIGHT, 
      },],
      type: 'article',
      locale: LanguageForSchema
    },
    twitter: {
      card: 'summary_large_image',
      title: entry?.seoTitle,
      description: entry?.seoDescription,
      images: [entry.image ?? DEFUALT_IMG],
      creator: '@BlockZa',
    },
  };
}
function countWordsInHtml(html: string): number {
  const text = html.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
  const words = text.split(/\s+/); // Split by spaces
  return words.filter(Boolean).length; // Filter out empty strings and count the rest
}
export async function getArticleData(id: string) {
  let entry: undefined | any;
  try {
    const tempEntry = await entryActor.getEntry(id);
    let TempDirectory = null;
    let tempUser = tempEntry[0]?.user?.toString();
    // setUserId(tempUser);
    // await updateImg(tempEntry[0].image[0], 'feature');
    let categoryLogo: any = iconbnb;

    entry = tempEntry;
  } catch (error) {
    console.error('Error fetching entry', error);
  }
  return entry;
}
export default async function Page({ params }: any) {
  const { slug } = params;
  // const articleData = getArticleData(slug);
  // logger(params, 'params');
  let entry;
  const response = await axios.get(
    `${process.env.BASE_URL}entries/${GET_ENTRY_URL}/${slug}`
  );

  const _entry = response.data;

  // const _entry = await entryActor.getEntryMeta(slug);
  entry = _entry;
  entry.image = _entry.image;
  entry.podcastImg = fromNullable(_entry?.podcastImg);
  if (entry?.podcastVideoLink != '') {
    entry.image = iframeimgThumbnail(entry?.podcastVideoLink);
  }
  entry.user;
  const publishDate = utcToLocalAdmin(
    entry?.creation_time?.toString(),
    Date_m_d_y_h_m,
    true
  );
  const modifiedDate = utcToLocalAdmin(
    entry?.dateModified?.toString(),
    Date_m_d_y_h_m,
    true
  );
  let entryTags=entry?.tags?.join(", ");
  // const userId = entry?.user?.__principal__;
  // const wordCount = countWordsInHtml(entry?.description);
/**
 * FUNCTION extractVideoLink USE TO GET YOUTUBE VIDEO LINK FROM IFRAME TAG
 * @param iframeString 
 * @returns YOUTUBE VIDEO LINK
 */
  const extractVideoLink = (iframeString:any) => {
    const regex = /src="([^"]+)"/;
    const match = iframeString.match(regex);
    return match ? match[1] : null;
  };
  let youtubeVideoLink=extractVideoLink(entry?.podcastVideoLink);
let plainText=removeHtml(entry?.description)
  let jsonLd=
  {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url + Podcast_STATIC_PATH + slug}/`,
    },
    "headline":  entry?.title,
    "image":entry.image ?? DEFUALT_IMG,
    "author": {
      "@type": "Person",
      "name": entry?.userName,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/favicon/favicon.ico`,
        "width": 600,
        "height": 60
      }
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "description":  entry?.seoDescription,
    "articleBody":plainText,
    "inLanguage": siteConfig.LANG=="en"?'en_US':"ja-JP",
    "episode": {
      "@type": "PodcastEpisode",
      "name":  entry?.title,
      "url":`${siteConfig.url + Podcast_STATIC_PATH + slug}/`,
      "datePublished": publishDate,
      "description":  entry?.seoDescription,
      "video": {
        "@type": "VideoObject",
        "url": youtubeVideoLink,
        "name": "Podcast Episode Video",
        contentUrl:`${siteConfig.url + Podcast_STATIC_PATH + slug}/`,
        "thumbnailUrl": entry.image ?? DEFUALT_IMG,
        "uploadDate":  publishDate,
        "description":entry?.seoDescription,
      }
    },
    "keywords": entryTags,
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
        "name":entry.category[0], 
        "item": `${ siteConfig.url+CATEGORY_ROUTE+entry.categoryIds[0]}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name":entry?.title,
        "item": `${siteConfig.url+ ARTICLE_STATIC_PATH + slug}/`,
      }
    ]
  };
  return (
    <>
     <link  rel="canonical" href={`${siteConfig.url + Podcast_STATIC_PATH + slug}/`}/>

        <JSONLD data={jsonLd}

        />
          <script
        type='application/ld+json'
        id='breadcrumbJson2'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <Podcast articleId={slug} />
    </>
  );
}
