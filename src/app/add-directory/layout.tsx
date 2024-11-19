import { siteConfig } from '@/constant/config';
import { CONTACT_US } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.adddirectorytitle,
  description: siteConfig.adddirectorydesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.adddirectorytitle,
    description: siteConfig.adddirectorydesc,
    images: [`${siteConfig.url}/images/contact-us.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url}/add-directory/`,
    title: siteConfig.adddirectorytitle,
    description: siteConfig.adddirectorydesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/contact-us.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>
    <link  rel="canonical" href={ `${siteConfig.url}/add-directory/`}/>
    {children}
    </>;
}
