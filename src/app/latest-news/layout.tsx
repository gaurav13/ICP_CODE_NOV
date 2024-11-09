import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import { ALL_ARTICLES, LATEST_NEW_PAGE } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.latestPagetitle,
  description: siteConfig.latestPageMetaDescrition,
  openGraph: {
    url: `${siteConfig.url+LATEST_NEW_PAGE}`,
    title: siteConfig.latestPagetitle,
    description: siteConfig.latestPageMetaDescrition,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
