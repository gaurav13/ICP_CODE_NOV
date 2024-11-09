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
import { LANG } from '@/constant/language';
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
