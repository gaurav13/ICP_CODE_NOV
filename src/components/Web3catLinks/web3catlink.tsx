import React from "react";

// Export the utility function to get the Web3 category link
export const getWeb3CategoryLink = (categoryId: string): string => {
  const web3categories = [
    { name: "blockchain", id: "1718641457527889243" },
    { name: "web3", id: "1718641230817970431" },
    { name: "metaverse", id: "1718641722539268658" },
    { name: "defi", id: "1719210427243611048" },
    { name: "nft", id: "1718968029182069160" },
    { name: "blockchain_games", id: "1719210909413102943" },
    { name: "dao", id: "1719211072131510431" },
    { name: "artificial_intelligence", id: "1718645044417924753" },
    { name: "cryptocurrency", id: "1719210557164450999" },
    { name: "crypto_casinos", id: "1733372612188333953" },
    { name: "crypto_exchange", id: "1719996329928054919" },
    { name: "metaverse_event", id: "1733811680276587369" },
    { name: "decentralized_identity", id: "1733812308626822422" },
    { name: "play_to_earn_platform", id: "1733812196425088158" },
    { name: "yield_aggregators", id: "1733812098678890519" },
    { name: "stabelcoins", id: "1733812032008771908" },
    { name: "web3_quest_platforms", id: "1733893281096454324" },
    { name: "art_and_collectibles", id: "1734755238584631722" },
    { name: "trading_tools", id: "1734694106651227147" },
    { name: "crypto_staking", id: "1734693999550706547" },
    { name: "crypto_launchpad", id: "1734693916560140791" },
    { name: "rwa_token", id: "1734693792312640861" },
    { name: "ai_token", id: "1734693690370917845" },
    { name: "memes_token", id: "1734693633491771452" },
    { name: "crypto_influencer", id: "1734693506407308537" },
    { name: "crypto_researcher", id: "1734693434218287154" },
    { name: "crypto_wallets", id: "1734693367505013990" },
    { name: "crypto_payment", id: "1734693286462153755" },
    { name: "crypto_exchanges", id: "1734693187972887198" },
    { name: "game_yield", id: "1734691423559751365" },
    { name: "game_developers", id: "1734691336642323972" },
    { name: "game_nfts", id: "1734691245391613588" },
    { name: "esports", id: "1734691156243443891" },
    { name: "play_to_earn_platforms", id: "1734691021602384200" },
    { name: "ai_tools", id: "1734690830682032730" },
    { name: "tokenized_global_bonds", id: "1734687473022341658" },
    { name: "us_treasuries", id: "1734687085396474546" },
    { name: "tokenization_protocols", id: "1734686933366281010" },
  ];

  const category = web3categories.find((cat) => cat.id === categoryId);
  return category
    ? `/web3-directory/${category.name}` // Found slug
    : `/web3-directory/?category=${categoryId}`; // Fallback URL
};

// Web3CategoryLink Component
interface Web3CategoryLinkProps {
  categoryId: string;
  children?: React.ReactNode;
}

const Web3CategoryLink: React.FC<Web3CategoryLinkProps> = ({
  categoryId,
  children,
}) => {
  // Use the utility function to get the link
  const href = getWeb3CategoryLink(categoryId);

  // Render an anchor tag with the resolved link
  return (
    <a  style={{
      borderColor: "#1e5fb3", // Border color
      color: "#1e5fb3", // Text color
      borderRadius: "4px", // Slight rounding
      textAlign: "center",
      background: "#ffc1073b", // Semi-transparent yellow background
      fontSize: "12px", // Font size
    }}
    href={href} className="web3-category-link inline-flex items-center shadow border border-solid rounded px-2 py-1 leading-3 text-decoration-none">
      {children || href}
    </a>
  );
};

export default Web3CategoryLink;
