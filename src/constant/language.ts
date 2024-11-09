import { lang } from '@/types/languages';

// Change this to "jp" for japenese canister deployment and "en" for english canister deployment
export const LANG: lang = 'jp'; //!please also change the link in sitemap.xml and robots.txt files in EntriesSlugs and next.sitemap.config.js
export const GET_ENTRY_URL: string = LangVal(LANG, 'getEntry', 'getEntryJP'); // 'getEntryJP' for jp and 'getEntry' for en
export const GET_EVENT_URL = LangVal(LANG, 'getEvent', 'getEventJP'); // 'getEventJP' for jp and 'getEvent' for en
export const GET_DIRECTORY_URL = LangVal(
  LANG,
  'getDirectory',
  'getDirectoryJP'
); // 'getDirectoryJP' for jp and 'getDirectory' for en

function LangVal(LANG: lang, enVal: string, jpVal: string) {
  if (LANG === 'en') {
    return enVal;
  } else {
    return jpVal;
  }
}

export const LanguageForSchema = LANG == 'en' ? 'en_US' : 'ja-JP';
