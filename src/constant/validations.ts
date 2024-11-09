export const MAX_NAME_CHARACTERS = 40;
export const MAX_DESIGNATION_CHARACTERS = 100;
export const MIN_NAME_CHARACTERS = 3;
export const MAX_BIO_CHARACTERS = 140;
export const MAX_AUTHOR_INFO_CHARACTERS = 500;
export const MAX_AUTHOR_TITLE_CHARACTERS = 60;
export const MAX_AUTHOR_META_DESC_CHARACTERS = 160;
export const MAX_IMAGE_SIZE = 600000;
export const MAX_RESIZED_IMAGE_SIZE = 200000;
export const MIN_ARTICLE_READ_REWARD = 0;
export const MAX_ARTICLE_READ_REWARD = 10_000_000_000_000_000_000;
export const MIN_MINIMUM_REWARD_TO_CLAIM = 1;
export const MAX_MINIMUM_REWARD_TO_CLAIM = 10_000_000_000_000_000_000;
export const MIN_DAILY_LOGIN_REWARD = 1;
export const MAX_DAILY_LOGIN_REWARD= 10_000_000_000_000_000_000;
export const VALID_IMAGE_EXTENSIONS = {
  image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
};
export const MAX_CATEGORY_NAME_CHARACTERS = 100;
import useLocalization from "@/lib/UseLocalization"
import { LANG } from '@/constant/language';
export const MAX_CATEGORY_DESCRIPTION_CHARACTERS = 3000;
export const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
export const STRONG_PASSWORD_SMS = LANG === 'en' ?
  'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and minimum length of 6 characters.'
  : 'パスワードは、少なくとも大文字1文字、小文字1文字、数字1文字、特殊文字1文字を含み、6文字以上でなければなりません。'
  export const MINIMUM_TOKEN_TRANSFER= 10_000;
