'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import Authenticated from '@/components/Authenticated';
import UnAuthenticated from '@/components/UnAuthenticated';
import logger from '@/lib/logger';
import ArticleShimmer from '@/components/Shimmers/ArticleShimmer';
import AuthHomeShimmer from '@/components/Shimmers/AuthHomeShimmer';
import { siteConfig } from '@/constant/config';
import { LANG, LanguageForSchema } from '@/constant/language';
import Logo from "@/assets/Img/Logo/headerlogo.png"

  /**
jsonLd is using only on home page 
**/
const josnLdForJPSite = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  url: siteConfig.url,
  name:siteConfig.jsonLdHomeName,
  description: siteConfig.jsonLdHomeDescription,
  image: Logo,
  author: {
    '@type': 'Organization',
    name: 'BlockZa',
    legalName: 'BlockZa Media Japan',
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
       ...Logo,
   },
    foundingDate: '2021',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1 Chome−2−6 Nihonbashi Daiei Building, 7th floor',
      addressLocality: 'Chuo City',
      addressRegion: 'Tokyo',
      postalCode: '103-0022',
      addressCountry: 'JP',
    },
    sameAs: siteConfig.jsonLdHomeSameas,
  },
publisher: {
    "@type": "Organization",
    "name": "BlockZa",
    "logo": {
      "@type": "ImageObject",
      "url": Logo,
      width: 600,
      height: 60
    }
  }
};
let josnLdForEngSite={
  "@context": "http://schema.org",
  "@type": "WebSite",
  url: siteConfig.url,
  name: "BlockZa",
  image: Logo,
  author: {
    "@type": "Organization",
    name: "BlockZa",
    legalName: "BlockZa Media Japan",
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
       ...Logo,
   },

    foundingDate: "2021",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Chome−2−6 Nihonbashi Daiei Building, 7th floor",
      addressLocality: "Chuo City",
      addressRegion: "Tokyo",
      postalCode: "103-0022",
      addressCountry: "JP"
    },
    sameAs: siteConfig.jsonLdHomeSameas,
  },
  publisher: {
    "@type": "Organization",
    name: "BlockZa",
    logo: {
      "@type": "ImageObject",
      url: Logo,
      width: 600,
      height: 60
    }
  }

}
let jsonLd=LANG=="en"?josnLdForEngSite:josnLdForJPSite;
export default function HomePage() {
  const { auth, setAuth, identity, principal, emailConnected } =
    useConnectPlugWalletStore((state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
      emailConnected: state.emailConnected,
    }));

  return (
    <>
     <head>
    <title>
     { siteConfig.title}
    </title>

    <meta name="description" content={siteConfig.description}/>
    <meta name="robots" content="index, follow"/>
    
    {/* <!-- Icons --> */}
    <link rel="icon" href={`${siteConfig.url}/favicon/favicon.ico`} type="image/x-icon"/>
    <link rel="shortcut icon" href={`${siteConfig.url}/favicon/favicon-16x16.png`} type="image/png"/>
    <link rel="apple-touch-icon" href={`${siteConfig.url}/favicon/apple-touch-icon.png`}/>
    
    {/* <!-- Application Name --> */}
    <meta name="application-name" content="BlockZa"/>

    {/* <!-- Web App Manifest --> */}
    <link rel="manifest" href={`${siteConfig.url}/favicon/site.webmanifest`}/>

    {/* <!-- Open Graph Meta Tags --> */}
    <meta property="og:url" content={siteConfig.url}/>
    <meta property="og:title" content={siteConfig.title}/>
    <meta property="og:description" content={siteConfig.description}/>
    <meta property="og:site_name" content="BlockZa"/>
    <meta property="og:image" content={`${siteConfig.url}/images/og.jpg`}/>
    <meta property="og:type" content="website"/>
    <meta property="og:locale" content={LanguageForSchema}/>

    {/* <!-- Twitter Meta Tags --> */}
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content={siteConfig.title}/>
    <meta name="twitter:description" content={siteConfig.description}/>
    <meta name="twitter:image" content={`${siteConfig.url}/images/og.jpg`}/>
    <meta name="twitter:creator" content="@BlockZa"/>

    </head>
      {auth.isLoading ? (
        <main id='main' className='new-home'>
          <div className='main-inner home'>
            <div className='d-flex justify-content-center'>
              <AuthHomeShimmer />
            </div>
          </div>
        </main>
      ) : identity || emailConnected ? (
        <Authenticated />
      ) : (
        <UnAuthenticated />
      )}
          <link rel="canonical" href={siteConfig.url} />
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        
    </>
  );
}
