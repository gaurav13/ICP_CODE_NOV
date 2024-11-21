import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.campaigntitle,
  description: siteConfig.campaigndesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.campaigntitle,
    description: siteConfig.campaigndesc,
    images: [`${siteConfig.url}/images/contact-us.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url}/campaigns/`,
    title: siteConfig.campaigntitle,
    description: siteConfig.campaigndesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/contact-us.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>
    <link  rel="canonical" href={`${siteConfig.url}/campaigns/`}/>
    {children}
    </>;
}
