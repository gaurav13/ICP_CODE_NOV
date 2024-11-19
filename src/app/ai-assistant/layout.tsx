import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.aichatbottitle,
  description: siteConfig.aichatbotdesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.aichatbottitle,
    description: siteConfig.aichatbotdesc,
    images: [`${siteConfig.url}/images/contact-us.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url}/ai-assistant/`,
    title: siteConfig.aichatbottitle,
    description: siteConfig.aichatbotdesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/contact-us.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>
    <link  rel="canonical" href={`${siteConfig.url}/ai-assistant/`}/>
    {children}
    </>;
}
