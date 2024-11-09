import { Metadata } from 'next';
import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { siteConfig } from '@/constant/config';
import '@/styles/App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'tippy.js/dist/tippy.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s `,
  },
  description: siteConfig.description,
  robots: 'index, follow',
  icons: {
    icon: `${siteConfig.url}/favicon/favicon.ico`,
    shortcut: `${siteConfig.url}/favicon/favicon-16x16.png`,
    apple: `${siteConfig.url}/favicon/apple-touch-icon.png`,
  },
  applicationName: 'BlockZa',
  manifest: `${siteConfig.url}/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: '@BlockZa',
  },
};

import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer/Footer';
import NavBarNew from '@/components/NavBar/NavabrNew';
import NewSidebarHome from '@/components/SideBarHome/NewSideBarHome';
import { LANG, LanguageForSchema } from '@/constant/language';
import MainLayoutScript from '@/components/Scripts/MainLayoutScript';

export default function RootLayout({
  children,
  hide,
}: {
  children: React.ReactNode;
  hide?: boolean;
}) {
  return (
    <html lang={LANG === 'en' ? 'en' : 'ja-JP'}>
      <head>
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        />

        {/* Google Analytics for JP and EN */}
        {LANG === 'en' ? (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-S2B0KX9703"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-S2B0KX9703');
                `,
              }}
            />
          </>
        ) : (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-LR6B5RN1Q6"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-LR6B5RN1Q6');
                  gtag('config', 'AW-16488843189'); // Google Ads Conversion ID for JP
                `,
              }}
            />
              
          </>
        )}

        {/* Other head elements */}
      </head>
      <body className={`${LANG === 'jp' ? 'ENStyle' : ''}`}>
        <NewSidebarHome />
        <NavBarNew />
        {children}
        <Footer />
        <ToastContainer theme='light' autoClose={3000} />

        {/* Embedded Chatbot Script */}
        {LANG === 'en' ? (
          <script
            src="https://www.chatbase.co/embed.min.js"
            defer
            chatbotId="vXOyMigraOFfiJ7f5O1Il"
            domain="www.chatbase.co"
          ></script>
        ) : (
          <script
            src="https://www.chatbase.co/embed.min.js"
            defer
            chatbotId="384SXpy6Uf9FJnTpRTgef"
            domain="www.chatbase.co"
          ></script>
        )}
        
    
      </body>
    </html>
  );
}
