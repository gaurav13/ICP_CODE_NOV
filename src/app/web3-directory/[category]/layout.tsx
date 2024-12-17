import { Metadata } from 'next';
import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';

interface LayoutProps {
  params: { category: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  let categoryData;

  try {
    const response = await fetch(`${siteConfig.aiurl}/categories/${params.category}/`);
    
    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected Response: ${response.status} ${response.statusText}`);
      throw new Error("Invalid JSON response or API error");
    }

    categoryData = await response.json();
  } catch (error) {
    console.error("Error fetching category data:", error);

    // Fallback to dummy data
    categoryData = {
      name: `${params.category.charAt(0).toUpperCase()}${params.category.slice(1)}`,
      description: `Explore top Web3 companies in the ${params.category} category. Learn about their mission, technology, and contributions to the Web3 ecosystem.`,
      logo: `${siteConfig.url}/images/default-logo.png`,
      banner: `${siteConfig.url}/images/default-banner.jpg`,
    };
    if (params.category === "blockchain") {
      categoryData = {
        name: "Blockchain Directory",
        description: "This Blockchain Directory connects you with companies at the forefront of blockchain technology. Access corporate details, meet innovative teams, and find opportunities to build partnerships that shape the future of decentralized solutions.",
        logo: "https://blockza.io/category_banner/blockchain.jpg",
        banner: "https://blockza.io/category_banner/blockchain.jpg",
      };
    } else if (params.category === "web3") {
      categoryData = {
        name: "Web3 Directory",
        description: "The Web3 Directory is your ultimate resource for discovering companies leading the decentralized internet revolution. Access corporate information, team profiles, and partnership opportunities to collaborate on transformative Web3 projects.",
        logo: "https://blockza.io/category_banner/web3.jpg",
        banner: "https://blockza.io/category_banner/web3.jpg",
      };
    } else if (params.category === "cryptocurrency") {
      categoryData = {
        name: "Crypto Directory",
        description: "This Crypto Directory brings you closer to companies revolutionizing the world of cryptocurrencies. Explore their corporate profiles, connect with visionary teams, and discover partnerships to fuel your crypto goals.",
        logo: "https://blockza.io/category_banner/crypto_currency.jpg",
        banner: "https://blockza.io/category_banner/crypto_currency.jpg",
      };
    } else if (params.category === "dao") {
      categoryData = {
        name: "DAO Directory",
        description: "Discover leading Decentralized Autonomous Organizations (DAOs) in this DAO Directory. Find corporate details and team insights to connect with DAOs and collaborate on innovative governance models.",
        logo: "https://blockza.io/category_banner/dao.jpg",
        banner: "https://blockza.io/category_banner/dao.jpg",
      };
    } 
    else if (params.category === "defi") {
      categoryData = {
        name: "DeFi Directory",
        description: "The DeFi Directory features companies reshaping finance through decentralized solutions. Access their corporate information, meet their teams, and collaborate on projects transforming the financial ecosystem.",
        logo: "https://blockza.io/category_banner/defi.jpg",
        banner: "https://blockza.io/category_banner/defi.jpg",
      };
    }
    else if (params.category === "metaverse") {
      categoryData = {
        name: "Metaverse Directory",
        description: "This Metaverse Directory connects you with companies creating immersive digital environments. Access corporate information and team profiles to collaborate on groundbreaking virtual world innovations.",
        logo: "https://blockza.io/category_banner/metaverse.jpg",
        banner: "https://blockza.io/category_banner/metaverse.jpg",
      };
    }
    else if (params.category === "nft") {
      categoryData = {
        name: "NFT Directory",
        description: "The NFT Directory helps you connect with companies leading the NFT revolution. Access corporate insights and team details to explore partnerships in art, gaming, and digital ownership.",
        logo: "https://blockza.io/category_banner/nft.jpg",
        banner: "https://blockza.io/category_banner/nft.jpg",
      };
    }
    else if (params.category === "blockchain_games") {
      categoryData = {
        name: "Blockchain Game Directory",
        description: "The Blockchain Game Directory connects you with companies merging gaming and blockchain technology. Discover corporate details, meet expert teams, and collaborate on the future of gaming.",
        logo: "https://blockza.io/category_banner/blockchain_game.jpg",
        banner: "https://blockza.io/category_banner/blockchain_game.jpg",
      };
    }
    else if (params.category === "nft") {
      categoryData = {
        name: "AI Directory: Intelligence Meets Decentralization",
        description: "This AI Directory introduces you to companies integrating AI with blockchain. Access corporate profiles, connect with teams, and partner on innovative projects driving smarter, decentralized solutions.",
        logo: "https://blockza.io/category_banner/artificial_Intelligence.jpg",
        banner: "https://blockza.io/category_banner/artificial_Intelligence.jpg",
      };
    }
    else if (params.category === "crypto_casinos") {
      categoryData = {
        name: "Crypto Casinos: Gamble with Digital Assets",
        description: "Explore the world of crypto casinos where blockchain technology ensures fairness and transparency. Discover platforms offering thrilling games and opportunities to win using digital currencies.",
        logo: "https://blockza.io/category_banner/crypto_casinos.jpg",
        banner: "https://blockza.io/category_banner/crypto_casinos.jpg",
      };
    } else if (params.category === "crypto_exchange") {
      categoryData = {
        name: "Crypto Exchanges: Your Gateway to Digital Assets",
        description: "Find the most trusted and reliable crypto exchanges to trade, buy, and sell digital currencies. Compare platforms for fees, security, and user-friendly features.",
        logo: "https://blockza.io/category_banner/crypto_exchange.jpg",
        banner: "https://blockza.io/category_banner/crypto_exchange.jpg",
      };
    } else if (params.category === "metaverse_event") {
      categoryData = {
        name: "Metaverse Events: Enter Virtual Reality",
        description: "Stay updated on the latest metaverse events and conferences. Engage with cutting-edge projects, network with innovators, and explore the evolving virtual universe.",
        logo: "https://blockza.io/category_banner/metaverse_event.jpg",
        banner: "https://blockza.io/category_banner/metaverse_event.jpg",
      };
    } else if (params.category === "decentralized_identity") {
      categoryData = {
        name: "Decentralized Identity: Take Control of Your Data",
        description: "Learn about decentralized identity solutions that empower individuals to manage their personal data securely. Discover platforms prioritizing privacy and user autonomy.",
        logo: "https://blockza.io/category_banner/decentralized_identity.jpg",
        banner: "https://blockza.io/category_banner/decentralized_identity.jpg",
      };
    } else if (params.category === "play_to_earn_platform") {
      categoryData = {
        name: "Play-to-Earn Platforms: Gaming Meets Rewards",
        description: "Discover play-to-earn platforms where gaming meets earning potential. Explore projects offering unique in-game assets, tokens, and rewards for your skills.",
        logo: "https://blockza.io/category_banner/play_to_earn_platform.jpg",
        banner: "https://blockza.io/category_banner/play_to_earn_platform.jpg",
      };
    } else if (params.category === "yield_aggregators") {
      categoryData = {
        name: "Yield Aggregators: Maximize Your Returns",
        description: "Learn about yield aggregators that optimize your DeFi earnings. Find platforms that automate strategies for the best returns in the decentralized finance space.",
        logo: "https://blockza.io/category_banner/yield_aggregators.jpg",
        banner: "https://blockza.io/category_banner/yield_aggregators.jpg",
      };
    } else if (params.category === "stabelcoins") {
      categoryData = {
        name: "Stablecoins: Stability in the Crypto Market",
        description: "Explore the world of stablecoins, designed to minimize volatility and offer a secure store of value. Discover projects pegged to real-world assets or currencies.",
        logo: "https://blockza.io/category_banner/stablecoins.jpg",
        banner: "https://blockza.io/category_banner/stablecoins.jpg",
      };
    }
    
    else {
      categoryData = {
        name: `${params.category.charAt(0).toUpperCase()}${params.category.slice(1)} Web3 Directory`,
        description: `Discover top Web3 projects and platforms in the ${params.category} category.`,
        logo: "https://blockza.io/category_banner/default.jpg",
        banner: "https://blockza.io/category_banner/default.jpg",
      };
    }
    
  }

  return {
    title: `${categoryData.name} | BlockZa`,
    description: categoryData.description,
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} | BlockZa`,
      description: categoryData.description,
      images: [categoryData.banner],
      creator: siteConfig.twitterCreator,
    },
    openGraph: {
      url: `${siteConfig.url}/web3-directory/${params.category}/`,
      title: `${categoryData.name}  | BlockZa`,
      description: categoryData.description,
      siteName: 'BlockZa',
      images: [categoryData.banner],
      type: 'website',
      locale: LanguageForSchema,
    },
  };
}


export default async function RootLayout({ children, params }: LayoutProps) {
  let categoryData;

  try {
    const response = await fetch(`${siteConfig.aiurl}/categories/${params.category}/`);
    
    // Ensure the response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
      console.warn(`Unexpected Response: ${response.status} ${response.statusText}`);
      throw new Error('Invalid JSON response or API error');
    }

    categoryData = await response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);

    // Use fallback dummy data
    categoryData = {
      name: `${params.category.charAt(0).toUpperCase()}${params.category.slice(1)}`,
      description: `Explore top Web3 companies in the ${params.category} category. Learn about their mission, technology, and contributions to the Web3 ecosystem.`,
      logo: `${siteConfig.url}/images/default-logo.png`,
      banner: `${siteConfig.url}/images/default-banner.jpg`,
    };
    
  }

  return (
    <>
      <meta name="description" content={categoryData.description} />
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${categoryData.name} | BlockZa`,
      description: categoryData.description,
      url: `${siteConfig.url}/web3-directory/${params.category}/`,
      publisher: {
        "@type": "Organization",
        name: "Blockza",
        url: `${siteConfig.url}`,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/_next/static/media/headerlogo.9306cb65.png`,
        },
      },
    }),
  }}
/>

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${siteConfig.url}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Web3 Directory",
          "item": `${siteConfig.url}/web3-directory/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${params.category}`,
          "item": `${siteConfig.url}/web3-directory/${params.category}/`
        }
      ]
    })
  }}
/>



      {children}
    </>
  );
}