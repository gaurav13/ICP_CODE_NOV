import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';
import { CAREERS } from '@/constant/routes';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.careerTitle,
  description: siteConfig.careerDec,
  openGraph: {
    url: `${siteConfig.url+CAREERS}`,
    title: siteConfig.careerTitle,
    description: siteConfig.careerDec,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
