import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import { PODCASTSPG } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.podcastTitle,
  description: siteConfig.podcastDec,
  openGraph: {
    url: `${siteConfig.url+PODCASTSPG}`,
    title: siteConfig.title,
    description: siteConfig.podcastDec,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
