import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.blockchaintitle,
  description: siteConfig.blockchaindesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.blockchaintitle,
    description: siteConfig.blockchaindesc,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.blockchainurl}`,
    title: siteConfig.blockchaintitle,
    description: siteConfig.blockchaindesc,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};

export default function RootLayout({ children }: { children: any }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": siteConfig.blockchaintitle,
    "description": siteConfig.blockchaindesc,
    "url": siteConfig.blockchainurl,
    "breadcrumb": {
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
          "name": siteConfig.blockchaintitle,
          "item": siteConfig.blockchainurl
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "BlockZa",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/images/logo.png`
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {children}
    </>
  );
}
