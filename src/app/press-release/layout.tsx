import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import { PRESSRELEASE } from '@/constant/routes';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.pressreleasetitle,
  description: siteConfig.pressreleaseDes,
  openGraph: {
    url: `${siteConfig.url+PRESSRELEASE}`,
    title: siteConfig.pressreleasetitle,
    description: siteConfig.pressreleaseDes,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
