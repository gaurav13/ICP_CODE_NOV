import { siteConfig } from '@/constant/config';
import { EDITOR_POLICY } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.ethicsTitle,
  description: siteConfig.EthicsPolicyDesc,
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.ethicsTwitterTitle,
    description: siteConfig.EthicsPolicyDesc,
    images: [`${siteConfig.url}/images/private-policy.png`],
    creator: siteConfig.twitterCreator,
  },
  openGraph: {
    url: `${siteConfig.url+EDITOR_POLICY}`,
    title: siteConfig.ethicsTitle,
    description: siteConfig.EthicsPolicyDesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/private-policy.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>
    <link  rel="canonical" href={`${siteConfig.url+EDITOR_POLICY}`}/>
  {children}
  </>;
}
