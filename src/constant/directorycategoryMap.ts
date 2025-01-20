import { dao_Category_Link } from "./routes";
import { LANG } from '@/constant/language';
// Define the mapping for category names to category IDs
export const CATEGORY_MAP: Record<string, string> = 
  LANG === 'jp'
    ? {
        blockchain: "1710822432496415429",
        web3: "1710137112381095238",
        metaverse: "1710822461756881598",
        defi: "1710822512655241150",
        nft: "1710822374423109041",
        blockchain_games: "1710822404046076093",
        dao: "1710822326165086912",
        artificial_intelligence: "1710821043195619936",
        cryptocurrency: "1710822487300013125",
      }
    : {
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
        art_and_collectibles: "1734755238584631722",
        trading_tools: "1734694106651227147",
        crypto_staking: "1734693999550706547",
        crypto_launchpad: "1734693916560140791",
        rwa_token: "1734693792312640861",
        ai_token: "1734693690370917845",
        memes_token: "1734693633491771452",
        crypto_influencer: "1734693506407308537",
        crypto_researcher: "1734693434218287154",
        crypto_wallets: "1734693367505013990",
        crypto_payment: "1734693286462153755",
        crypto_exchanges: "1734693187972887198",
        game_yield: "1734691423559751365",
        game_developers: "1734691336642323972",
        game_nfts: "1734691245391613588",
        esports: "1734691156243443891",
        play_to_earn_platforms: "1734691021602384200",
        ai_tools: "1734690830682032730",
        tokenized_global_bonds: "1734687473022341658",
        us_treasuries: "1734687085396474546",
        tokenization_protocols: "1734686933366281010",
      };

  
  // Optional: Reverse mapping for category IDs to names
  export const CATEGORY_NAME_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
  );