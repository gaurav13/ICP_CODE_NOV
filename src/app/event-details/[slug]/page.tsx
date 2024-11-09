// 'use client';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { Metadata, MetadataRoute, ResolvingMetadata } from 'next';
import axios from 'axios';
import { fromNullable } from '@dfinity/utils';
import { siteConfig } from '@/constant/config';
import { utcToLocal, utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import { GET_ENTRY_URL, GET_EVENT_URL, LANG, LanguageForSchema } from '@/constant/language';
import { ARTICLE_STATIC_PATH, CATEGORY_ROUTE, Event_STATIC_PATH, EVENTS, JSONLD_IMG_HEIGHT, JSONLD_IMG_WIDTH } from '@/constant/routes';
import EventDetails from '@/components/EventDetail/EventDetail';
import { DEFUALT_IMG } from '@/constant/image';
import { removeHtml } from '@/constant/helperfuntions';

const entryActor = makeEntryActor();
interface EventType {
  title : string;
  shortDescription : string;
  date : BigInt;
  endDate : BigInt;
  location : string;
  country : string;
  city : string;
  website : string;
  category : [string];
  tags : [string];
  organiser : string;
  image :string | undefined;
  creation_time : BigInt;
  month : Number;
  user : any;
  seoTitle : string;
  seoSlug : string;
  seoDescription : string;
  seoExcerpt : string;
  description  : string;
  freeTicket : string;
  applyTicket : string;

}

export async function generateStaticParams() {


  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [{ slug: 'dsoew2387470hl' }];

  
  const response = await axios.get(
    `${process.env.BASE_URL}entries/getAllEventsIds/${LANG}`
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
  let entry: EventType = {
    title : "Event",
    shortDescription : "shortDescription",
    date : BigInt(0),
    endDate :  BigInt(0),
    location : "location",
    country : "country",
    city : "city",
    website : "website",
    category : ["1232312312"],
    tags : ["tags"],
    organiser : "NFT",
    image :DEFUALT_IMG,
    creation_time :  BigInt(0),
    month : 1,
    user : "",
    seoTitle : "seoTitle",
    seoSlug : "seoSlug",
    seoDescription : "seoDescription",
    seoExcerpt : "seoExcerpt",
    description :"description",
    freeTicket :"freeTicket",
    applyTicket :"applyTicket",
  };
  let userId;

  let publishDate: string | undefined;
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}entries/${GET_EVENT_URL}/${slug}`
    );

    const _entry = response.data;
    entry = _entry;
    entry.image = _entry.image;
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
    category: entry?.category[0],
    robots: 'index, follow',

    authors: [
      {
        name: entry?.organiser,
        url: `${siteConfig.url}/profile?userId=${userId}`,
      },
    ],
    publisher: siteConfig.siteName,

    openGraph: {
      publishedTime: publishDate,
      url: `${siteConfig.url+Event_STATIC_PATH +slug}/`,
      title: entry?.seoTitle,
      description: entry?.seoDescription,
      siteName: siteConfig.siteName,
      images: [ {
        url: entry.image ?? DEFUALT_IMG,
        width: JSONLD_IMG_WIDTH,
        height: JSONLD_IMG_HEIGHT, 
      },],
      type: 'article',
      locale: LanguageForSchema,
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
export default async function Page({ params }: any) {
  const { slug } = params;
  // const articleData = getArticleData(slug);
  // logger(params, 'params');
  let entry;
  const response = await axios.get(
    `${process.env.BASE_URL}entries/${GET_EVENT_URL}/${slug}`
  );

  const _entry = response.data;

  // const _entry = await entryActor.getEntryMeta(slug);
  entry = _entry;
  entry.image = _entry.image;
  entry.podcastImg = fromNullable(_entry?.podcastImg);
  entry.user;
  const publishDate = utcToLocalAdmin(
    entry?.creation_time?.toString(),
    Date_m_d_y_h_m,
    true
  );
  const startDate = utcToLocalAdmin(
    entry?.date?.toString(),
    Date_m_d_y_h_m,
    true
  );
  const endDate = utcToLocalAdmin(
    entry?.endDate?.toString(),
    Date_m_d_y_h_m,
    true
  );
  const userId = entry?.user?.__principal__;
  let plainText=removeHtml(entry?.description)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",  
    name: entry?.title,
    startDate: startDate,
    endDate: endDate,
    eventStatu: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",

  location: {
    "@type": "Country",
    name: entry?.title,
    address: {
      "@type": "PostalAddress",
      streetAddress: entry?.location,
      addressLocality: entry?.city,
      addressCountry: entry?.country
    }
  },
  image: [
    entry.image ?? DEFUALT_IMG
   ],

   description: entry?.seoDescription,
   offers: {
     "@type": "Offer",
     "url": entry?.applyTicket,
   },
   performer: {
     "@type": "",
     name: "",
     price: "", 
     priceCurrency: "",
      availability: "https://schema.org/InStock", 
      validFrom: "2024-04-01T12:00"
   },
   organizer: {
     "@type": "Organization",
     name: entry?.organiser,
     url: entry?.website
   },

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
        "name":"Events", 
        "item": `${ siteConfig.url+EVENTS}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name":entry?.title,
        "item": `${siteConfig.url+ Event_STATIC_PATH + slug}/`,
      }
    ]
  };
  return (
    <>
     <link  rel="canonical" href={`${siteConfig.url + Event_STATIC_PATH + slug}/`}/>
   
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
           <script
        type='application/ld+json'
        id='breadcrumbJson3'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
    <EventDetails eventId={slug} />
    </>
  );
}
