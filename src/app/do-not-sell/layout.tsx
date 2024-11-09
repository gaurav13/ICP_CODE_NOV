import { siteConfig } from '@/constant/config';
import { DONTNOTSELL } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.doNotSellTitle,
  description: siteConfig.donotsellDesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.doNotSellTitle,
    description: siteConfig.donotsellDesc,
    images: [`${siteConfig.url}/images/private-policy.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url+DONTNOTSELL}`,
    title: siteConfig.doNotSellTitle,
    description: siteConfig.donotsellDesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/private-policy.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>
   <link  rel="canonical" href={`${siteConfig.url+DONTNOTSELL}`}/>
  {children}
  </>;
}
