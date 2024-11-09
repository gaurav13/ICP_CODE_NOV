import { siteConfig } from '@/constant/config';
import { CONTACT_US } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.contactusTitle,
  description: siteConfig.contactusDesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.twitterTitle,
    description: siteConfig.contactusDesc,
    images: [`${siteConfig.url}/images/contact-us.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url+CONTACT_US}`,
    title: siteConfig.twitterTitle,
    description: siteConfig.contactusDesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/contact-us.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>
    <link  rel="canonical" href={`${siteConfig.url+CONTACT_US}`}/>
    {children}
    </>;
}
