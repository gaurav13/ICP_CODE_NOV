import { dao_Category_Link } from "./routes";

// Define the mapping for category names to category IDs
export const CATEGORY_MAP: Record<string, string> = {
    blockchain: "1718641457527889243", 
    web3: "1718641230817970431",
    metaverse: "1718641722539268658",
    defi: "1719210427243611048",
    nft: "1718968029182069160",
    blockchain_games: "1719210909413102943",
    dao: "1719211072131510431",
    artificial_intelligence: "1718645044417924753",
    cryptocurrency: "1719210557164450999",
    crypto_casinos: "1733372612188333953",
    crypto_exchange: "1719996329928054919",
    metaverse_event: "1733811680276587369",
    decentralized_identity: "1733812308626822422",
    play_to_earn_platform: "1733812196425088158",
    yield_aggregators: "1733812098678890519",
    stabelcoins: "1733812032008771908",
    web3_quest_platforms: "1733893281096454324",
  };
  
  // Optional: Reverse mapping for category IDs to names
  export const CATEGORY_NAME_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
  );