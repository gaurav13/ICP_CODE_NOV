import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web3 Salon Pitch Voting - Vote Now & See the Winner!',
  description: 'Cast your vote for the most promising project in the Web3 Salon pitch event! The winner will gain exclusive opportunities with investors and partners. Stay tuned for the winner announcement!',
  twitter: {
    card: 'summary_large_image',
    title: 'Pitch Your Web3 Startup & Get Voted Powered by BlockZA',
    description: 'Cast your vote for the most promising project in the Web3 Salon pitch event! The winner will gain exclusive opportunities with investors and partners. Stay tuned for the winner announcement!',
    images:'https://blockza.io/category_banner/pitch.png',
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url}/pitch_voting/`,
    title: 'Web3 Salon Pitch Voting - Vote Now & See the Winner!',
    description: 'Cast your vote for the most promising project in the Web3 Salon pitch event! The winner will gain exclusive opportunities with investors and partners. Stay tuned for the winner announcement!',
    siteName: 'BlockZa',
    images: 'https://blockza.io/category_banner/pitch.png',
    type: 'website',
    locale: LanguageForSchema,
  },
};

export default function RootLayout({ children }: { children: any }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Web3 Salon Pitch Voting - Vote Now & See the Winner!",
    "description": "Cast your vote for the most promising project in the Web3 Salon pitch event! The winner will gain exclusive opportunities with investors and partners. Stay tuned for the winner announcement!",
    "url": `${siteConfig.url}/pitch_voting/`,
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
          "name": "Pitch Your Web3 Startup & Get Voted",
          "item": `${siteConfig.url}/pitch_voting/`
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
