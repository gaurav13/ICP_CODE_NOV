import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';
import { LANG } from '@/constant/language';
// Import pages based on language
import TermOfUsePage from './page';
import TermOfUsePageJP from './page_JP'
import { TERMSOFUSE } from '@/constant/routes';

export const metadata: Metadata = {
  title: siteConfig.termOfUsePgtitle,
  description: siteConfig.termOfUseDes,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.termOfUsePgtitle,
    description: siteConfig.termOfUseTwitterDes,
    images: [`${siteConfig.url}/images/private-policy.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url+TERMSOFUSE}`,
    title: siteConfig.termOfUsePgtitle,
    description: siteConfig.termOfUseTwitterDes,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/private-policy.png`],
    type: 'article',
  },
};

// Modify the RootLayout component to render different pages based on language
export default function RootLayout({ children }: { children: any }) {
  // Logic to determine language, assuming `language` variable holds the language code
  const language = 'jp'; // Assuming this is how you determine language

  // Choose which page component to render based on language
  const TermOfUseComponent = LANG === 'jp' ? TermOfUsePageJP : TermOfUsePage;

  return <TermOfUseComponent />;
}
