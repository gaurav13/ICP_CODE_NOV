import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { LANG } from '@/constant/language';
import { Metadata } from 'next';
import PricaypolicyPage from './page';
import PricaypolicyPageJP from './page_JP';
import { PRIVACY_POLICY } from '@/constant/routes';
export const metadata: Metadata = {
  title: siteConfig.privatePloicyTitle,
  description: siteConfig.privatePolicyDesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.privatePloicyTitle,
    description: siteConfig.privatePolicyDesc,
    images: [`${siteConfig.url}/images/private-policy.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url+PRIVACY_POLICY}`,
    title: siteConfig.privatePloicyTitle,
    description: siteConfig.privatePolicyDesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/private-policy.png`],
    type: 'article',
  },
};

export default function RootLayout({ children }: { children: any }) {
  const language = 'jp';
  const TermOfUseComponent = LANG === 'jp' ? PricaypolicyPageJP : PricaypolicyPage;

  return <>
  <link  rel="canonical" href={`${siteConfig.url+PRIVACY_POLICY}`}/>
  <TermOfUseComponent />

  </>
}