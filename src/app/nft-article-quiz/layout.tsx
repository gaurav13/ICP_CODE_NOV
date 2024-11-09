import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NFT Article Quiz',
  description:
    'Boost your NFT knowledge with the NFT Article Quiz at BlockZa. Test yourself on the latest trends and insights in the NFT world. Enjoy a fun and interactive quiz experience to level up your expertise!',
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
