import { Metadata } from 'next';
import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';

interface LayoutProps {
  params: { category?: string }; // Allow `category` to be optional
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const category = 'Web3 Directory'; // Fallback to 'default-category' if undefined
  const categoryTitle = `Web3 Directory | Explore the Best Web3 Projects, Companies, and Resources`;
  const categoryDescription = `Explore top Web3 companies in the Web3 Directory category. Learn about their mission, technology, and contributions to the Web3 ecosystem.`;

  return {
    title: categoryTitle,
    description: categoryDescription,
    twitter: {
      card: 'summary_large_image',
      title: categoryTitle,
      description: categoryDescription,
      images: [`${siteConfig.url}/images/og.jpg`],
      creator: siteConfig.twitterCreator,
    },
    openGraph: {
      url: `${siteConfig.url}/web3-directory/${category}/`,
      title: categoryTitle,
      description: categoryDescription,
      siteName: 'BlockZa',
      images: [`${siteConfig.url}/images/og.jpg`],
      type: 'website',
      locale: LanguageForSchema,
    },
  };
}

export default function RootLayout({ children, params }: LayoutProps) {
  const category =  'Web3 Directory'; // Fallback to 'default-category'
  const categoryName = `Web3 Directory`;
 {/* const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} Companies | BlockZa`,
    "description": `Explore top Web3 companies in the ${category} category. Learn about their mission, technology, and contributions to the Web3 ecosystem.`,
    "url": `${siteConfig.url}/web3-directorys/${category}/`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteConfig.url,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `${categoryName}`,
          "item": `${siteConfig.url}/web3-directory/${category}/`,
        },
      ],
    },
    "publisher": {
      "@type": "Organization",
      "name": "BlockZa",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/images/logo.png`,
      },
    },
  }; */}

  return (
    <>
    {/*  <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      /> */}
      {children}
    </>
  );
}
