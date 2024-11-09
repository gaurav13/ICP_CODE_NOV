import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.subscriberTitle,
  description: siteConfig.subscriberDec,
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
