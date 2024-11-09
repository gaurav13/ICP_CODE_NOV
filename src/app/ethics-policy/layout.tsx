import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';
import { LANG } from '@/constant/language';
import ethicsPolicyPage from './page';
import ethicspolicyPageJP from './page_JP';
import { ETHICS_POLICY } from '@/constant/routes';
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
    url: `${siteConfig.url+ETHICS_POLICY}`,
    title: siteConfig.ethicsTitle,
    description: siteConfig.EthicsPolicyDesc,
    siteName: siteConfig.siteName,
    images: [`${siteConfig.url}/images/private-policy.png`],
    type: 'article',
  },
};
export default function RootLayout({ children }: { children: any }) {
  const language = 'jp';
  const TermOfUseComponent = LANG === 'jp' ?  ethicspolicyPageJP :  ethicsPolicyPage;

  return <TermOfUseComponent />;
}
