import { siteConfig } from '@/constant/config';
import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.TrackAdmintitle,
  description: siteConfig.TrackAdminDec,
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
