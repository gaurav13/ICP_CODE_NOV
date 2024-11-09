import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import { EVENTS } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.eventListPgtitle,
  description: siteConfig.eventPgDec,
  openGraph: {
    url: `${siteConfig.url+EVENTS}`,
    title: siteConfig.eventListPgtitle,
    description: siteConfig.eventPgDec,
    siteName: '',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
