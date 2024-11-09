import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import { ALL_ARTICLES } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.articlesPgTitle,
  description: siteConfig.articlesPgDec,
  openGraph: {
    url: `${siteConfig.url+ALL_ARTICLES}`,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
