import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // title: siteConfig.title_web3_director,
  // description: siteConfig.description_web3_director,
  description :siteConfig.metadescription_web3_director
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
