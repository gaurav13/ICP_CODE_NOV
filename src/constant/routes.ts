import { EN_SITE_URL, JP_SITE_URL } from '@/constant/config';
import { LANG } from '@/constant/language';

export const TAG_CONTENT_ROUTE = '/content';
export const EVENT_TAG_CONTENT_ROUTE = '/event-content';

export const PATHS = [
  '/article',
  '/podcast',
  '/article-details',
  '/podcast-details',
];
export const ARTICLE_DYNAMIC_PATH_2 = '/article-details/';
export const PODCAST_DYNAMIC_PATH_2 = '/podcast-details/';
export const DIRECTORY_DYNAMIC_PATH_2 = '/directory-detail/';
export const EVENT_DYNAMIC_PATH_2 = '/event-detail/';


// export const Event_STATIC_PATH = '/event-detail/';
// export const DIRECTORY_STATIC_PATH = '/directory-detail/';

// export const Podcast_DINAMIC_PATH = '/podcast?podcastId=';
// export const ARTICLE_DINAMIC_PATH = '/article?articleId=';
// export const DIRECTORY_DINAMIC_PATH = '/directory?directoryId=';
// export const Event_DINAMIC_PATH = '/event-details?eventId=';


export const ARTICLE_STATIC_PATH = '/article/';
export const Podcast_STATIC_PATH = '/podcast/';
export const Event_STATIC_PATH = '/event-details/';
export const DIRECTORY_STATIC_PATH = '/directory/';

export const ARTICLE_DINAMIC_PATH = '/article-details/?articleId=';
export const Podcast_DINAMIC_PATH = '/podcast-details/?podcastId=';
export const Event_DINAMIC_PATH = '/event-detail/?eventId=';
export const DIRECTORY_DINAMIC_PATH = '/directory-detail/?directoryId=';
export const QUIZ_ROUTE = '/quiz/';
export const SURVEY_ROUTE = '/survey/';
export const CATEGORY_ROUTE ="/category-details?category=";
export const EDITOR_POLICY_ROUTE ="/editor-policy";
export const LATEST_NEW_PAGE ="/latest-news";
export const LOGIN_PAGE ="/login/";




export const GOOGLEMAP_URL = 'https://www.google.com/maps/place/?q=';

// export const BLOCKCHAIN_CATEGORY_ID=LANG=="jp"?"1710822432496415429":"1708320123762996670";


export const BLOCKCHAIN_CATEGORY_ID = LANG == "jp" ? "1710822432496415429" : "1718641457527889243";
export const WEB3_CATEGORY_ID = LANG == "jp" ? "1710137112381095238" : "1718641230817970431";
export const AI_CATEGORY_ID = LANG == "jp" ? "1710821043195619936" : "1718645044417924753";
export const NFT_CATEGORY_ID = LANG == "jp" ? "1710822374423109041" : "1718968029182069160";
export const BLOCKCHAIN_GAMES_CATEGORY_ID = LANG == "jp" ? "1710822404046076093" : "1719210909413102943";
export const DEFI_CATEGORY_ID = LANG == "jp" ? "1710822512655241150" : "1719210427243611048";
export const DAO_CATEGORY_ID = LANG == "jp" ? "1710822326165086912" : "1719211072131510431";
export const METAVERCE_CATEGORY_ID = LANG == "jp" ? "1710822461756881598" : "1718641722539268658";
export const CRYPTO_CATEGORY_ID = LANG == "jp" ? "1710822487300013125" : "1719210557164450999";
export const LATEST_NEW_CATEGORY_ID = LANG == "jp" ? "1710822550939375077" : "1719210557164450999";


export const SITE_LINK = LANG == "jp" ? JP_SITE_URL : EN_SITE_URL;


export const CATEGORY_PATH = {
  WEB3: `${SITE_LINK+CATEGORY_ROUTE+WEB3_CATEGORY_ID}`,
  AI: `${SITE_LINK+CATEGORY_ROUTE+AI_CATEGORY_ID}`,
  NFT:
    `${SITE_LINK+CATEGORY_ROUTE+NFT_CATEGORY_ID}`,
  BLOCKCHAIN_GAMES: `${SITE_LINK+CATEGORY_ROUTE+BLOCKCHAIN_GAMES_CATEGORY_ID}`,
  BLOCKCHAIN_NEWS: `${SITE_LINK+CATEGORY_ROUTE+BLOCKCHAIN_CATEGORY_ID}`,
  DEFI: `${SITE_LINK+CATEGORY_ROUTE+DEFI_CATEGORY_ID}`,
  DAO: `${SITE_LINK+CATEGORY_ROUTE+DAO_CATEGORY_ID}`,
  METAVERCE: `${SITE_LINK+CATEGORY_ROUTE+METAVERCE_CATEGORY_ID}`,
  CRYPTO: `${SITE_LINK+CATEGORY_ROUTE+CRYPTO_CATEGORY_ID}`,
  // LATEST_NEW:
  //   LANG == 'jp'
  //     ? `${JP_SITE_URL+CATEGORY_ROUTE+10822550939375077`
  //     : `${EN_SITE_URL+CATEGORY_ROUTE+10824990554939585`,
  LATEST_NEW: `${SITE_LINK+CATEGORY_ROUTE+LATEST_NEW_CATEGORY_ID}&news=latest`



};
// quil routes
export const ADD_ARTICLE = "/add-article/"
export const ADD_WEB3 = "/add-directory";
export const ADD_QUIZ_ROUTE_USER = '/add-quiz';
export const ALL_ARTICLES = '/articles/';
export const ADD_QUIZ_ROUTE_ADMIN = '/super-admin/add-quiz/';
export const ADD_SURVEY_ROUTE_USER = '/add-survey';
export const ADD_SURVEY_ROUTE_ADMIN = '/super-admin/add-survey/';
export const ALL_SURVEY_ROUTE_USER = '/all-survey/';
export const ALL_QUIZ_ROUTE_USER = '/all-quiz/'
export const ALL_QUIZ_ROUTE_ADMIN = '/super-admin/manage-quiz/';
export const MANAGE_SURVEY_ADMIN = "/super-admin/manage-survey/"
export const USER_ACTIVITES_DASHBOARD = "/super-admin/user-activities/"
export const token_claims_page = "/super-admin/claims-requests/"


export const SURVEY = "/take-survey";
export const BLOCKED = "/blocked";
export const TAKE_QUIZ = "/take-quiz";
export const JSONLD_IMG_WIDTH = 1200;
export const JSONLD_IMG_HEIGHT = 630;
export const BUYTOKENS = '/buy-tokens/';
export const CONTACT_US = LANG == "jp" ? "/contact-us/" : 'https://blockza.io/contact-us/';
export const PRIVACY_POLICY = LANG == "jp" ? "/privacy-policy/" : 'https://blockza.io/privacy-policy/';
export const EDITOR_POLICY = '/editor-policy/';
export const ETHICS_POLICY = LANG == "jp" ? "/ethics-policy/" : 'https://blockza.io/ethics-policy/';
export const PRESSRELEASE = '/press-release/';
export const EVENTS = '/events/';
export const TERMSOFUSE = LANG == "jp" ? "/terms-of-use/" : 'https://blockza.io/terms-of-use/';
export const DONTNOTSELL = LANG == "jp" ? "/do-not-sell/" : 'https://blockza.io/contact-us/do-not-sell-my-personal-info/';
export const CAREERS = LANG == "jp" ? "/careers/" : 'https://blockza.io/contact-us/careers/';
export const HINZAASIF = LANG == "jp" ? "/hinza-asif/" : 'https://blockza.io/hinza-asif/';
export const DISCLAIMER = LANG == "jp" ? "/disclaimer/" : 'https://blockza.io/contact-us/disclaimer/';
export const QUIZ = '/quiz/';
export const PODCASTSPG = '/podcasts/';
export const TAKESURVEYPAGE = '/take-survey?id=';
export const TAKEQUIZPAGE = '/take-quiz?id=';
export const USERPROFILELINK = '/profile/?userId=';
export const CAMPAIGNS = "/campaigns/"
export const Blockchain_Category_Link = LANG == "jp" ? "/blockchain/" : 'https://pro.blockza.io/blockchain/';
export const Web3_Category_Link = LANG == "jp" ? "/web3/" : 'https://pro.blockza.io/web3/';
export const crypto_Category_Link = LANG == "jp" ? "/crypto/" : 'https://pro.blockza.io/crypto/';
export const defi_Category_Link = LANG == "jp" ? "/defi/" : 'https://pro.blockza.io/defi/';
export const dao_Category_Link = LANG == "jp" ? "/dao/" : 'https://pro.blockza.io/dao/';
export const nft_Category_Link = LANG == "jp" ? "/nft/" : 'https://pro.blockza.io/nft/';
export const metaverse_Category_Link = LANG == "jp" ? "/metaverse/" : 'https://pro.blockza.io/metaverse/';
export const blockchaingame_Category_Link = LANG == "jp" ? "/blockchain_game/" : 'https://pro.blockza.io/blockchain_game/';
export const ai_Category_Link = LANG == "jp" ? "/ai/" : 'https://pro.blockza.io/ai/';









