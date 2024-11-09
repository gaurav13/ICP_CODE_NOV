import logger from '@/lib/logger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management',
  description:
    'Effortlessly manage user accounts and interactions on BlockZa. Elevate engagement with our intuitive User Management system, designed for seamless control and enhanced user experiences.',
};
export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
