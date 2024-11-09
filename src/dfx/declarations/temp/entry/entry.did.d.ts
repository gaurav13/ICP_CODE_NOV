import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AnalysedData { 'title' : string, 'count' : bigint }
export interface Category {
  'creation_time' : bigint,
  'logo' : NewImageObject,
  'name' : string,
  'directoryCount' : bigint,
  'slug' : string,
  'user' : Principal,
  'totalCount' : bigint,
  'banner' : NewImageObject,
  'description' : string,
  'pressReleaseCount' : bigint,
  'parentCategoryId' : [] | [CategoryId__1],
  'children' : [] | [Array<CategoryId__1>],
  'articleCount' : bigint,
  'isChild' : boolean,
  'podcastCount' : bigint,
  'eventsCount' : bigint,
}
export type CategoryId = string;
export type CategoryId__1 = string;
export interface Entry {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'seoTitle' : string,
  'promotionICP' : bigint,
  'likedUsers' : Array<Principal>,
  'seoSlug' : string,
  'subscription' : boolean,
  'views' : bigint,
  'tags' : Array<string>,
  'user' : UserId__1,
  'podcastImg' : [] | [NewImageObject],
  'minters' : Array<Principal>,
  'isStatic' : boolean,
  'description' : string,
  'isPodcast' : boolean,
  'isPromoted' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'promotionHistory' : List,
  'pressRelease' : boolean,
  'caption' : string,
  'category' : Array<string>,
  'viewedUsers' : Array<Principal>,
  'image' : [] | [NewImageObject],
  'seoDescription' : string,
  'podcastVideoLink' : string,
  'isCompanySelected' : boolean,
  'seoExcerpt' : string,
  'podcastImgCation' : string,
  'companyId' : string,
}
export interface EntryCount {
  'podcastdrafts' : bigint,
  'pressreleaseapproved' : bigint,
  'totalEntries' : bigint,
  'totalpressrelease' : bigint,
  'pressreleaserejected' : bigint,
  'pendings' : bigint,
  'articlespendings' : bigint,
  'podcastpendings' : bigint,
  'pressreleasedrafts' : bigint,
  'approved' : bigint,
  'articlesapproved' : bigint,
  'podcastapproved' : bigint,
  'totalarticles' : bigint,
  'totalpodcasts' : bigint,
  'rejected' : bigint,
  'articlesrejected' : bigint,
  'podcastrejected' : bigint,
  'pressreleasependings' : bigint,
  'drafts' : bigint,
  'articlesdrafts' : bigint,
}
export type EntryId = string;
export interface EntryMetadata {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'seoTitle' : string,
  'seoSlug' : string,
  'tags' : Array<string>,
  'user' : UserId__1,
  'podcastImg' : [] | [NewImageObject],
  'description' : string,
  'isPodcast' : boolean,
  'isPromoted' : boolean,
  'pressRelease' : boolean,
  'caption' : string,
  'category' : Array<string>,
  'image' : [] | [NewImageObject],
  'seoDescription' : string,
  'podcastVideoLink' : string,
  'isCompanySelected' : boolean,
  'dateModified' : bigint,
  'seoExcerpt' : string,
  'podcastImgCation' : string,
  'categoryIds' : Array<string>,
  'companyId' : string,
}
export type EntryStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export type EntryStatus__1 = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export interface Event {
  'lat' : number,
  'lng' : number,
  'creation_time' : bigint,
  'month' : bigint,
  'organiser' : string,
  'title' : string,
  'country' : string,
  'seoTitle' : string,
  'linkdin' : string,
  'endDate' : bigint,
  'twitter' : string,
  'seoSlug' : string,
  'city' : string,
  'date' : bigint,
  'instagram' : string,
  'tags' : Array<string>,
  'user' : UserId__1,
  'applyTicket' : string,
  'isStatic' : boolean,
  'description' : string,
  'website' : string,
  'discountTicket' : string,
  'shortDescription' : string,
  'facebook' : string,
  'category' : Array<string>,
  'image' : NewImageObject,
  'seoDescription' : string,
  'freeTicket' : string,
  'seoExcerpt' : string,
  'location' : string,
  'telegram' : string,
}
export interface EventCount {
  'all' : bigint,
  'upcoming' : bigint,
  'ongoing' : bigint,
  'pasts' : bigint,
}
export type EventId = string;
export type EventId__1 = string;
export interface EventMetadata {
  'creation_time' : bigint,
  'month' : bigint,
  'organiser' : string,
  'title' : string,
  'country' : string,
  'seoTitle' : string,
  'endDate' : bigint,
  'seoSlug' : string,
  'city' : string,
  'date' : bigint,
  'tags' : Array<string>,
  'user' : UserId__1,
  'applyTicket' : string,
  'description' : string,
  'website' : string,
  'shortDescription' : string,
  'category' : Array<string>,
  'image' : NewImageObject,
  'seoDescription' : string,
  'dateModified' : bigint,
  'freeTicket' : string,
  'seoExcerpt' : string,
  'location' : string,
  'categoryIds' : Array<string>,
}
export type EventStatus = { 'all' : null } |
  { 'upcoming' : null } |
  { 'past' : null } |
  { 'ongoing' : null };
export interface Event__1 {
  'lat' : number,
  'lng' : number,
  'creation_time' : bigint,
  'month' : bigint,
  'organiser' : string,
  'title' : string,
  'country' : string,
  'seoTitle' : string,
  'linkdin' : string,
  'endDate' : bigint,
  'twitter' : string,
  'seoSlug' : string,
  'city' : string,
  'date' : bigint,
  'instagram' : string,
  'tags' : Array<string>,
  'user' : UserId__1,
  'applyTicket' : string,
  'isStatic' : boolean,
  'description' : string,
  'website' : string,
  'discountTicket' : string,
  'shortDescription' : string,
  'facebook' : string,
  'category' : Array<string>,
  'image' : NewImageObject,
  'seoDescription' : string,
  'freeTicket' : string,
  'seoExcerpt' : string,
  'location' : string,
  'telegram' : string,
}
export type Events = Array<[EventId__1, Event]>;
export interface FeaturedCampaign {
  'creation_time' : bigint,
  'endDate' : bigint,
  'createdBy' : Principal,
  'isActive' : boolean,
  'entryId' : string,
  'startDate' : bigint,
}
export interface FeaturedCampaignItem {
  'creation_time' : bigint,
  'title' : string,
  'endDate' : bigint,
  'createdBy' : Principal,
  'isActive' : boolean,
  'entryId' : string,
  'startDate' : bigint,
}
export interface InputCategory {
  'logo' : NewImageObject,
  'name' : string,
  'slug' : string,
  'banner' : NewImageObject,
  'description' : string,
  'parentCategoryId' : [] | [CategoryId__1],
}
export interface InputEntry {
  'userName' : string,
  'title' : string,
  'seoTitle' : string,
  'promotionICP' : bigint,
  'seoSlug' : string,
  'subscription' : boolean,
  'tags' : Array<string>,
  'podcastImg' : [] | [NewImageObject],
  'description' : string,
  'isPodcast' : boolean,
  'isPromoted' : boolean,
  'isDraft' : boolean,
  'pressRelease' : boolean,
  'caption' : string,
  'category' : Array<string>,
  'image' : [] | [NewImageObject],
  'seoDescription' : string,
  'podcastVideoLink' : string,
  'isCompanySelected' : boolean,
  'seoExcerpt' : string,
  'podcastImgCation' : string,
  'companyId' : string,
}
export interface InputEvent {
  'lat' : number,
  'lng' : number,
  'month' : bigint,
  'organiser' : string,
  'title' : string,
  'country' : string,
  'seoTitle' : string,
  'linkdin' : string,
  'endDate' : bigint,
  'twitter' : string,
  'seoSlug' : string,
  'city' : string,
  'date' : bigint,
  'instagram' : string,
  'tags' : Array<string>,
  'applyTicket' : string,
  'description' : string,
  'website' : string,
  'discountTicket' : string,
  'shortDescription' : string,
  'facebook' : string,
  'category' : Array<string>,
  'image' : NewImageObject,
  'seoDescription' : string,
  'freeTicket' : string,
  'seoExcerpt' : string,
  'location' : string,
  'telegram' : string,
}
export interface InputFeaturedCampaign {
  'endDate' : bigint,
  'isActive' : boolean,
  'entryId' : string,
  'startDate' : bigint,
}
export interface InputQuestion {
  'title' : string,
  'correctAnswer' : Array<string>,
  'options' : Array<string>,
}
export interface InputQuiz {
  'title' : string,
  'duration' : bigint,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'description' : string,
  'entryId' : string,
  'attemptsPerUser' : bigint,
  'isGeneral' : boolean,
  'isAtive' : boolean,
  'passingMarks' : bigint,
  'usersWillGetReward' : bigint,
}
export interface InputServay {
  'title' : string,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'description' : string,
  'entryId' : string,
  'attemptsPerUser' : bigint,
  'isAtive' : boolean,
  'usersWillGetReward' : bigint,
}
export interface InputServayQuestion {
  'title' : string,
  'ifSelected' : [] | [bigint],
  'options' : Array<string>,
}
export type InputTransectionTypes = { 'all' : null } |
  { 'quiz' : null } |
  { 'survey' : null };
export interface InputWeb3 {
  'linkedin' : string,
  'companyBanner' : NewImageObject,
  'founderName' : string,
  'twitter' : string,
  'founderImage' : NewImageObject,
  'instagram' : string,
  'companyDetail' : string,
  'catagory' : string,
  'company' : string,
  'shortDescription' : string,
  'facebook' : string,
  'companyLogo' : NewImageObject,
  'discord' : string,
  'companyUrl' : string,
  'telegram' : string,
  'founderEmail' : string,
  'founderDetail' : string,
}
export type Key = string;
export type LikeReward = bigint;
export type List = [] | [[bigint, List]];
export type ListCategories = Array<[CategoryId, ListCategory]>;
export interface ListCategory {
  'creation_time' : bigint,
  'logo' : NewImageObject,
  'name' : string,
  'directoryCount' : bigint,
  'slug' : string,
  'user' : Principal,
  'totalCount' : bigint,
  'description' : string,
  'pressReleaseCount' : bigint,
  'parentCategoryId' : [] | [CategoryId__1],
  'children' : [] | [Array<CategoryId__1>],
  'articleCount' : bigint,
  'isChild' : boolean,
  'podcastCount' : bigint,
  'eventsCount' : bigint,
}
export interface ListEntryItem {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'views' : bigint,
  'modificationDate' : bigint,
  'user' : UserId__1,
  'podcastImg' : [] | [NewImageObject],
  'minters' : Array<Principal>,
  'isStatic' : boolean,
  'isPodcast' : boolean,
  'isPromoted' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'pressRelease' : boolean,
  'category' : Array<string>,
  'image' : [] | [NewImageObject],
  'podcastVideoLink' : string,
  'isCompanySelected' : boolean,
  'seoExcerpt' : string,
  'podcastImgCation' : string,
  'companyId' : string,
}
export interface ListPodcastItem {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'likedUsers' : Array<Principal>,
  'views' : bigint,
  'user' : UserId__1,
  'podcastImg' : [] | [NewImageObject],
  'minters' : Array<Principal>,
  'isStatic' : boolean,
  'isPodcast' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'pressRelease' : boolean,
  'category' : Array<string>,
  'image' : [] | [NewImageObject],
  'podcastVideoLink' : string,
  'isCompanySelected' : boolean,
  'seoExcerpt' : string,
  'companyId' : string,
}
export type NewImageObject = string;
export interface PromotedArticles {
  'totalEntries' : bigint,
  'promotionIcp' : bigint,
}
export interface Question {
  'creation_time' : bigint,
  'title' : string,
  'correctAnswer' : Array<string>,
  'options' : Array<string>,
}
export interface QuestionAnswer {
  'title' : string,
  'correctAnswer' : Array<string>,
}
export interface Quiz {
  'creation_time' : bigint,
  'title' : string,
  'duration' : bigint,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'createdBy' : Principal,
  'description' : string,
  'entryId' : string,
  'takenBy' : Array<TakenBy>,
  'attemptsPerUser' : bigint,
  'isGeneral' : boolean,
  'isAtive' : boolean,
  'oldRewardPerUser' : [] | [bigint],
  'passingMarks' : bigint,
  'remaningUserCanTakeReward' : bigint,
  'usersWillGetReward' : bigint,
  'questionCount' : bigint,
}
export interface QuizCount {
  'all' : bigint,
  'active' : bigint,
  'not_active' : bigint,
}
export interface QuizForUser {
  'creation_time' : bigint,
  'title' : string,
  'duration' : bigint,
  'rewardPerUser' : [] | [bigint],
  'participatedCount' : bigint,
  'entryId' : string,
  'isTaken' : boolean,
  'isAtive' : boolean,
  'usersWillGetReward' : bigint,
  'questionCount' : bigint,
}
export type Result = { 'ok' : [string, boolean] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [string, bigint, bigint, bigint] } |
  { 'err' : [string, boolean] };
export type Result_10 = { 'ok' : [[] | [Servay], Array<ServayQuestion>] } |
  { 'err' : [string, boolean] };
export type Result_11 = {
    'ok' : [
      [] | [Servay],
      { 'entries' : Array<ServayQuestion>, 'amount' : bigint },
    ]
  } |
  { 'err' : [string, boolean] };
export type Result_12 = {
    'ok' : [[] | [Quiz], { 'entries' : Array<Question>, 'amount' : bigint }]
  } |
  { 'err' : [string, boolean] };
export type Result_13 = { 'ok' : [[] | [Quiz], Array<Question>] } |
  { 'err' : [string, boolean] };
export type Result_14 = { 'ok' : [string, string, Array<AnalysedData>] } |
  { 'err' : [string, boolean] };
export type Result_15 = { 'ok' : [string, [] | [Category]] } |
  { 'err' : string };
export type Result_16 = { 'ok' : [string, [] | [Entry]] } |
  { 'err' : string };
export type Result_17 = { 'ok' : string } |
  { 'err' : string };
export type Result_18 = { 'ok' : [string, Entry] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [string, Category] } |
  { 'err' : string };
export type Result_3 = { 'ok' : [string, boolean] } |
  { 'err' : [string, boolean] };
export type Result_4 = { 'ok' : [string, EventId] } |
  { 'err' : string };
export type Result_5 = { 'ok' : [string, [] | [bigint], boolean] } |
  { 'err' : [string, boolean] };
export type Result_6 = {
    'ok' : { 'isStatic' : boolean, 'isPodcast' : boolean }
  } |
  { 'err' : null };
export type Result_7 = { 'ok' : [string, Web3Id] } |
  { 'err' : string };
export type Result_8 = { 'ok' : [string, EntryId] } |
  { 'err' : string };
export type Result_9 = {
    'ok' : [
      string,
      { 'entries' : Array<ServayQuestionTakenBy>, 'amount' : bigint },
    ]
  } |
  { 'err' : [string, boolean] };
export interface ReturnQuizWithTitle {
  'creation_time' : bigint,
  'title' : string,
  'duration' : bigint,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'createdBy' : Principal,
  'description' : string,
  'entryId' : string,
  'takenBy' : Array<TakenBy>,
  'attemptsPerUser' : bigint,
  'isGeneral' : boolean,
  'isAtive' : boolean,
  'oldRewardPerUser' : [] | [bigint],
  'passingMarks' : bigint,
  'remaningUserCanTakeReward' : bigint,
  'usersWillGetReward' : bigint,
  'entryTitle' : string,
  'questionCount' : bigint,
}
export interface RewardConfig {
  'admin' : bigint,
  'platform' : bigint,
  'master' : bigint,
}
export interface Servay {
  'creation_time' : bigint,
  'title' : string,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'createdBy' : Principal,
  'description' : string,
  'entryId' : string,
  'takenBy' : Array<ServayTakenBy>,
  'attemptsPerUser' : bigint,
  'isAtive' : boolean,
  'oldRewardPerUser' : [] | [bigint],
  'remaningUserCanTakeReward' : bigint,
  'usersWillGetReward' : bigint,
  'questionCount' : bigint,
}
export interface ServayForUser {
  'creation_time' : bigint,
  'title' : string,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'createdBy' : Principal,
  'description' : string,
  'entryId' : string,
  'isTaken' : boolean,
  'attemptsPerUser' : bigint,
  'isAtive' : boolean,
  'oldRewardPerUser' : [] | [bigint],
  'remaningUserCanTakeReward' : bigint,
  'usersWillGetReward' : bigint,
  'questionCount' : bigint,
}
export interface ServayQuestion {
  'creation_time' : bigint,
  'title' : string,
  'ifSelected' : [] | [bigint],
  'takenBy' : Array<ServayQuestionTakenBy__1>,
  'options' : Array<string>,
}
export interface ServayQuestionTakenBy {
  'creation_time' : bigint,
  'userSuggestion' : string,
  'userName' : string,
  'user' : Principal,
  'selectedOption' : Array<string>,
}
export interface ServayQuestionTakenBy__1 {
  'creation_time' : bigint,
  'userSuggestion' : string,
  'userName' : string,
  'user' : Principal,
  'selectedOption' : Array<string>,
}
export interface ServayTakenBy {
  'reward' : [] | [bigint],
  'attemptAt' : bigint,
  'user' : Principal,
}
export interface ServayTakenByList {
  'reward' : [] | [bigint],
  'title' : string,
  'attemptAt' : bigint,
  'user' : Principal,
}
export interface ServaywithTitle {
  'creation_time' : bigint,
  'title' : string,
  'shouldRewarded' : boolean,
  'rewardPerUser' : [] | [bigint],
  'createdBy' : Principal,
  'description' : string,
  'entryId' : string,
  'takenBy' : Array<ServayTakenBy>,
  'attemptsPerUser' : bigint,
  'isAtive' : boolean,
  'oldRewardPerUser' : [] | [bigint],
  'remaningUserCanTakeReward' : bigint,
  'usersWillGetReward' : bigint,
  'entryTitle' : string,
  'questionCount' : bigint,
}
export interface SlugWithData {
  'key' : string,
  'creation_time' : bigint,
  'modification_date' : bigint,
}
export interface SurveyCount {
  'all' : bigint,
  'active' : bigint,
  'not_active' : bigint,
}
export interface TakenBy {
  'status' : bigint,
  'reward' : [] | [bigint],
  'attemptAt' : bigint,
  'user' : Principal,
  'score' : bigint,
  'remainingAttempts' : bigint,
  'timestamp' : bigint,
}
export interface TakenByWithTitle {
  'status' : bigint,
  'reward' : [] | [bigint],
  'title' : string,
  'attemptAt' : bigint,
  'user' : Principal,
  'score' : bigint,
  'remainingAttempts' : bigint,
  'timestamp' : bigint,
}
export type TopWeb3Categories = Array<[CategoryId, TopWeb3Category]>;
export interface TopWeb3Category {
  'creation_time' : bigint,
  'logo' : NewImageObject,
  'name' : string,
  'directoryCount' : bigint,
  'slug' : string,
  'totalCount' : bigint,
  'pressReleaseCount' : bigint,
  'parentCategoryId' : [] | [CategoryId__1],
  'children' : [] | [Array<CategoryId__1>],
  'articleCount' : bigint,
  'isChild' : boolean,
  'podcastCount' : bigint,
  'eventsCount' : bigint,
}
export interface TransactionHistoryOfServayAndQuiz {
  'id' : string,
  'creation_time' : bigint,
  'admin' : bigint,
  'entryType' : TransectionTypes,
  'user' : Principal,
  'gasFee' : bigint,
  'platform' : bigint,
  'promotional' : bigint,
}
export type TransectionTypes = { 'quiz' : null } |
  { 'survey' : null };
export interface TrendingEntryItemSidebar {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'views' : bigint,
  'user' : UserId__1,
  'isStatic' : boolean,
  'isPromoted' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'pressRelease' : boolean,
  'category' : Array<string>,
  'image' : [] | [NewImageObject],
  'isCompanySelected' : boolean,
  'seoExcerpt' : string,
  'companyId' : string,
}
export type UserId = Principal;
export type UserId__1 = Principal;
export interface UserServayResponse {
  'title' : string,
  'seggestion' : string,
  'selectedOption' : Array<string>,
}
export interface Web3 {
  'creation_time' : bigint,
  'status' : Web3Status,
  'linkedin' : [] | [string],
  'companyBanner' : NewImageObject,
  'founderName' : string,
  'likedUsers' : Array<Principal>,
  'twitter' : [] | [string],
  'views' : bigint,
  'founderImage' : NewImageObject,
  'instagram' : [] | [string],
  'companyDetail' : string,
  'user' : UserId__1,
  'totalCount' : bigint,
  'isStatic' : boolean,
  'catagory' : string,
  'pressReleaseCount' : bigint,
  'likes' : bigint,
  'company' : string,
  'shortDescription' : string,
  'facebook' : [] | [string],
  'companyLogo' : NewImageObject,
  'discord' : [] | [string],
  'companyUrl' : [] | [string],
  'articleCount' : bigint,
  'telegram' : [] | [string],
  'podcastCount' : bigint,
  'founderEmail' : string,
  'founderDetail' : string,
}
export interface Web3Count {
  'verified' : bigint,
  'total_web' : bigint,
  'un_verified' : bigint,
}
export interface Web3DashboardList {
  'creation_time' : bigint,
  'status' : Web3Status,
  'founderName' : string,
  'views' : bigint,
  'user' : UserId__1,
  'isStatic' : boolean,
  'catagory' : string,
  'company' : string,
  'companyLogo' : NewImageObject,
  'companyUrl' : [] | [string],
  'founderEmail' : string,
}
export type Web3Id = string;
export interface Web3List {
  'creation_time' : bigint,
  'views' : bigint,
  'totalCount' : bigint,
  'isStatic' : boolean,
  'catagory' : string,
  'pressReleaseCount' : bigint,
  'company' : string,
  'articleCount' : bigint,
  'podcastCount' : bigint,
  'founderEmail' : string,
}
export interface Web3MetaData {
  'categoryId' : string,
  'creation_time' : bigint,
  'status' : Web3Status,
  'linkedin' : [] | [string],
  'companyBanner' : NewImageObject,
  'founderName' : string,
  'twitter' : [] | [string],
  'founderImage' : NewImageObject,
  'instagram' : [] | [string],
  'companyDetail' : string,
  'user' : UserId__1,
  'catagory' : string,
  'company' : string,
  'shortDescription' : string,
  'facebook' : [] | [string],
  'companyLogo' : NewImageObject,
  'discord' : [] | [string],
  'companyUrl' : [] | [string],
  'dateModified' : bigint,
  'telegram' : [] | [string],
  'founderDetail' : string,
}
export type Web3Status = { 'all' : null } |
  { 'un_verfied' : null } |
  { 'verfied' : null };
export type Web3Status__1 = { 'all' : null } |
  { 'un_verfied' : null } |
  { 'verfied' : null };
export interface anon_class_25_1 {
  'addCategory' : ActorMethod<[string, string, string], Array<string>>,
  'addEvent' : ActorMethod<[InputEvent, string, string], Result_4>,
  'addMultipleQuestions' : ActorMethod<
    [string, Array<InputQuestion>, string],
    Result_3
  >,
  'addMultipleQuestionsToSurvey' : ActorMethod<
    [string, Array<InputServayQuestion>, string],
    Result_3
  >,
  'addQuestion' : ActorMethod<[string, InputQuestion, string], Result_3>,
  'addQuiz' : ActorMethod<[InputQuiz, string], Result_3>,
  'addServay' : ActorMethod<[InputServay, string], Result_3>,
  'addServayQuestion' : ActorMethod<
    [string, InputServayQuestion, string],
    Result_3
  >,
  'addView' : ActorMethod<[Key], boolean>,
  'addWeb3View' : ActorMethod<[Key], boolean>,
  'addWeb3postCount' : ActorMethod<[Key, string], boolean>,
  'add_campaign' : ActorMethod<[InputFeaturedCampaign, string], Result_3>,
  'add_category' : ActorMethod<[InputCategory, string, string], Result_2>,
  'adminDeleteEntry' : ActorMethod<[Key, string, string], Result_16>,
  'approveArticle' : ActorMethod<[string, string, Key, boolean], Result_18>,
  'approvePodcast' : ActorMethod<[string, string, Key, boolean], Result_18>,
  'buyNFTStudio24Tokens' : ActorMethod<[string, bigint, bigint], Result_17>,
  'changeStatusOfServay' : ActorMethod<[boolean, string, string], Result_3>,
  'changeTheStatusOfQuiz' : ActorMethod<[boolean, string, string], Result_3>,
  'child_to_category' : ActorMethod<[Array<CategoryId>], ListCategories>,
  'deleteDraftEntry' : ActorMethod<[Key, string], Result_16>,
  'deleteQuestion' : ActorMethod<[string, string, string], Result_3>,
  'deleteServayQuestion' : ActorMethod<[string, string, string], Result_3>,
  'deleteSurveyQuestions' : ActorMethod<
    [string, Array<string>, string],
    Result_3
  >,
  'delete_campaign' : ActorMethod<[string, string], Result_3>,
  'delete_category' : ActorMethod<[CategoryId, string, string], Result_15>,
  'delete_event' : ActorMethod<[string, string, string], Result_3>,
  'delete_quiz' : ActorMethod<[string, string], Result_3>,
  'delete_servay' : ActorMethod<[string, string], Result_3>,
  'delete_web3' : ActorMethod<[Key, string, string], Result_3>,
  'deletequizQuestions' : ActorMethod<
    [string, Array<string>, string],
    Result_3
  >,
  'editViews' : ActorMethod<[Key, bigint, string, string], boolean>,
  'editWeb3Views' : ActorMethod<[Key, bigint, string, string], boolean>,
  'event_types' : ActorMethod<[], EventCount>,
  'getAllCategoriesIds' : ActorMethod<[], Array<SlugWithData>>,
  'getAllEntries' : ActorMethod<[string], Array<[Key, Entry]>>,
  'getAllEntryIds' : ActorMethod<[boolean], Array<SlugWithData>>,
  'getAllEventsIds' : ActorMethod<[], Array<SlugWithData>>,
  'getAllWeb3Ids' : ActorMethod<[], Array<SlugWithData>>,
  'getAnalysis' : ActorMethod<[string, string], Result_14>,
  'getApprovedWeb3List' : ActorMethod<[bigint], Array<[Key, Web3]>>,
  'getCampaignById_forAdmin' : ActorMethod<[string], [] | [FeaturedCampaign]>,
  'getCategories' : ActorMethod<[], Array<string>>,
  'getEntriesByCategory' : ActorMethod<[string], Array<[Key, Entry]>>,
  'getEntriesList' : ActorMethod<
    [string, boolean, string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'getEntriesNew' : ActorMethod<
    [CategoryId, string, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getEntriesNewlatest' : ActorMethod<
    [string, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getEntriesOfWeb3' : ActorMethod<
    [string, string, string, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getEntry' : ActorMethod<[Key], [] | [Entry]>,
  'getEntryMeta' : ActorMethod<[Key], EntryMetadata>,
  'getEntry_admin' : ActorMethod<[Key], [] | [Entry]>,
  'getEventMeta' : ActorMethod<[Key], EventMetadata>,
  'getEventsOfWeb3' : ActorMethod<
    [
      string,
      bigint,
      bigint,
      [] | [bigint],
      [] | [string],
      [] | [string],
      string,
      string,
    ],
    { 'entries' : Events, 'amount' : bigint }
  >,
  'getFeaturedCampaignList' : ActorMethod<
    [string, bigint, bigint],
    { 'entries' : Array<[Key, FeaturedCampaignItem]>, 'amount' : bigint }
  >,
  'getFeaturedEntriesList' : ActorMethod<
    [string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'getOnlyActiveQuizOfArticle' : ActorMethod<[string], Array<string>>,
  'getOnlyActiveQuizOfArticles' : ActorMethod<
    [string],
    Array<[string, [] | [bigint]]>
  >,
  'getOnlyActiveSurveyOfArticle' : ActorMethod<[Key], Array<string>>,
  'getOnlyArticles' : ActorMethod<[bigint, Array<string>], Array<[Key, Entry]>>,
  'getOnlyPressRelease' : ActorMethod<
    [bigint, Array<string>],
    Array<[Key, Entry]>
  >,
  'getPaginatedEntries' : ActorMethod<
    [bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getPendingWeb3List' : ActorMethod<[bigint], Array<[Key, Web3]>>,
  'getPressEntries' : ActorMethod<[string], Array<[Key, Entry]>>,
  'getPromotedEntries' : ActorMethod<[bigint], Array<[Key, Entry]>>,
  'getPromotionAmountOfQuiz' : ActorMethod<[string], [] | [bigint]>,
  'getQuestionsOfQuiz' : ActorMethod<[string], Result_13>,
  'getQuestionsOfQuiz_admin' : ActorMethod<
    [string, string, bigint, bigint],
    Result_12
  >,
  'getQuestionsOfServay_admin' : ActorMethod<
    [string, string, bigint, bigint],
    Result_11
  >,
  'getQuestionsOfSurvey' : ActorMethod<[string], Result_10>,
  'getQuizAndServayTransectionForAdmin' : ActorMethod<
    [InputTransectionTypes, string, bigint, bigint],
    {
      'entries' : Array<[string, TransactionHistoryOfServayAndQuiz]>,
      'amount' : bigint,
    }
  >,
  'getQuizById' : ActorMethod<[string], [] | [Quiz]>,
  'getQuizById_foradmin' : ActorMethod<[string], [] | [Quiz]>,
  'getQuizIdsList_Of_article' : ActorMethod<[string], Array<string>>,
  'getQuizList' : ActorMethod<
    [[] | [string], string, bigint, bigint],
    { 'entries' : Array<[string, QuizForUser]>, 'amount' : bigint }
  >,
  'getQuizList_for_admin' : ActorMethod<
    [[] | [string], bigint, string, bigint, bigint],
    { 'entries' : Array<[string, ReturnQuizWithTitle]>, 'amount' : bigint }
  >,
  'getQuizList_for_auther' : ActorMethod<
    [[] | [string], bigint, string, bigint, bigint],
    { 'entries' : Array<[string, ReturnQuizWithTitle]>, 'amount' : bigint }
  >,
  'getQuriedEntries' : ActorMethod<
    [[] | [CategoryId], string, string, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getReviewEntries' : ActorMethod<
    [string, string, EntryStatus__1, string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'getReviewPodcast' : ActorMethod<
    [string, string, EntryStatus__1, string, bigint, bigint],
    { 'entries' : Array<[Key, ListPodcastItem]>, 'amount' : bigint }
  >,
  'getRewardsOfQuizandSurvey' : ActorMethod<[string], bigint>,
  'getSearchedEntries' : ActorMethod<
    [string, string, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getServayById' : ActorMethod<[string], [] | [Servay]>,
  'getServayById_foradmin' : ActorMethod<[string], [] | [Servay]>,
  'getServayList' : ActorMethod<
    [string, bigint, bigint],
    { 'entries' : Array<[string, ServayForUser]>, 'amount' : bigint }
  >,
  'getServayList_for_admin' : ActorMethod<
    [[] | [string], bigint, string, bigint, bigint],
    { 'entries' : Array<[string, ServaywithTitle]>, 'amount' : bigint }
  >,
  'getServayList_for_auther' : ActorMethod<
    [[] | [string], bigint, string, bigint, bigint],
    { 'entries' : Array<[string, ServaywithTitle]>, 'amount' : bigint }
  >,
  'getSurveyIdsList_Of_article' : ActorMethod<[Key], Array<string>>,
  'getTakenQuizOfUser' : ActorMethod<
    [UserId, string, bigint, bigint],
    { 'entries' : Array<[string, TakenByWithTitle]>, 'amount' : bigint }
  >,
  'getTakenSurveyOfUser' : ActorMethod<
    [UserId, string, bigint, bigint],
    { 'entries' : Array<[string, ServayTakenByList]>, 'amount' : bigint }
  >,
  'getUniqueDataList' : ActorMethod<
    [string, boolean, string, bigint, bigint, bigint],
    { 'entries' : Array<[Key, ListPodcastItem]>, 'amount' : bigint }
  >,
  'getUserEntries' : ActorMethod<
    [UserId, boolean, string, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getUserEntriesList' : ActorMethod<
    [string, boolean, string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'getUserFavouriteDirectories' : ActorMethod<
    [UserId, string, bigint, bigint],
    { 'web3List' : Array<[Key, Web3]>, 'amount' : bigint }
  >,
  'getUserFavouritePost' : ActorMethod<
    [UserId, bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getUserSeggestionList' : ActorMethod<
    [string, string, string, bigint, bigint, string],
    Result_9
  >,
  'getUserWeb3List' : ActorMethod<
    [string, string, bigint, bigint],
    { 'web3List' : Array<[Key, Web3]>, 'amount' : bigint }
  >,
  'getWeb3' : ActorMethod<[Key], [] | [Web3]>,
  'getWeb3DirectoriesDashboard' : ActorMethod<
    [string, Web3Status__1, string, string, bigint, bigint],
    { 'web3List' : Array<[Key, Web3DashboardList]>, 'amount' : bigint }
  >,
  'getWeb3List' : ActorMethod<
    [string, string, bigint, bigint],
    { 'web3List' : Array<[Key, Web3List]>, 'amount' : bigint }
  >,
  'getWeb3ListOfAllUsers' : ActorMethod<
    [string, string, bigint, bigint],
    { 'web3List' : Array<[Key, Web3]>, 'amount' : bigint }
  >,
  'getWeb3Meta' : ActorMethod<[Key], Web3MetaData>,
  'getWeb3_for_admin' : ActorMethod<[Key, string], [] | [Web3]>,
  'get_categories' : ActorMethod<
    [string, bigint, bigint, boolean],
    { 'entries' : TopWeb3Categories, 'amount' : bigint }
  >,
  'get_categories_by_name' : ActorMethod<
    [Array<string>],
    Array<[CategoryId, Category]>
  >,
  'get_category' : ActorMethod<[string], [] | [Category]>,
  'get_event' : ActorMethod<[string], [] | [Event__1]>,
  'get_events' : ActorMethod<
    [
      string,
      bigint,
      bigint,
      [] | [bigint],
      [] | [string],
      [] | [string],
      string,
    ],
    { 'entries' : Events, 'amount' : bigint }
  >,
  'get_like_reward' : ActorMethod<[], bigint>,
  'get_list_categories' : ActorMethod<
    [string, bigint, bigint, boolean],
    { 'entries' : ListCategories, 'amount' : bigint }
  >,
  'get_list_category' : ActorMethod<[string], [] | [ListCategory]>,
  'get_reward' : ActorMethod<[], RewardConfig>,
  'get_upcoming_events' : ActorMethod<
    [
      string,
      bigint,
      bigint,
      EventStatus,
      [] | [bigint],
      [] | [string],
      [] | [string],
      string,
    ],
    { 'entries' : Events, 'amount' : bigint }
  >,
  'insertEntry' : ActorMethod<
    [InputEntry, string, boolean, string, string],
    Result_8
  >,
  'insertWeb3' : ActorMethod<
    [InputWeb3, string, string, string, boolean],
    Result_7
  >,
  'isEntryPodcast' : ActorMethod<[Key], Result_6>,
  'isEntryVerifiedPublicFn' : ActorMethod<[string], boolean>,
  'isMinted' : ActorMethod<[Key], boolean>,
  'likeEntry' : ActorMethod<[Key, string, string], Result>,
  'likeWeb3' : ActorMethod<[Key, string, string], Result>,
  'makeStatic' : ActorMethod<[Key], boolean>,
  'makeStaticEvent' : ActorMethod<[Key], boolean>,
  'makeStaticWeb3' : ActorMethod<[Key], boolean>,
  'mintEntry' : ActorMethod<[Key, string], Result>,
  'promoteTheServay' : ActorMethod<[bigint, string, string], Result_3>,
  'promotedTheQuiz' : ActorMethod<[bigint, string, string], Result_3>,
  'promotedarticles_count' : ActorMethod<[], PromotedArticles>,
  'quiz_list' : ActorMethod<[], QuizCount>,
  'saveUserResponseToServay' : ActorMethod<
    [string, Array<UserServayResponse>, string],
    Result_5
  >,
  'survey_list' : ActorMethod<[], SurveyCount>,
  'total_events' : ActorMethod<[], bigint>,
  'trendingEntryItemSidebar' : ActorMethod<
    [bigint],
    Array<[Key, TrendingEntryItemSidebar]>
  >,
  'trendingPressReleaseItemSidebar' : ActorMethod<
    [bigint],
    Array<[Key, TrendingEntryItemSidebar]>
  >,
  'updateEntry' : ActorMethod<[Entry, string], boolean>,
  'updateEvent' : ActorMethod<[InputEvent, string, string, string], Result_4>,
  'updateQuestion' : ActorMethod<
    [string, string, InputQuestion, string],
    Result_3
  >,
  'updateQuiz' : ActorMethod<[InputQuiz, string, string], Result_3>,
  'updateServay' : ActorMethod<[InputServay, string, string], Result_3>,
  'updateServayQuestion' : ActorMethod<
    [string, string, InputServayQuestion, string],
    Result_3
  >,
  'updateUserEntries' : ActorMethod<[UserId, string], boolean>,
  'update_campaign' : ActorMethod<
    [string, InputFeaturedCampaign, string],
    Result_3
  >,
  'update_category' : ActorMethod<
    [InputCategory, CategoryId, string, string],
    Result_2
  >,
  'update_count_category' : ActorMethod<[CategoryId, string], Result>,
  'update_like_reward' : ActorMethod<[string, LikeReward], LikeReward>,
  'update_reward' : ActorMethod<[string, RewardConfig], RewardConfig>,
  'user_count' : ActorMethod<[], EntryCount>,
  'validateQuiz' : ActorMethod<
    [string, bigint, Array<QuestionAnswer>, string],
    Result_1
  >,
  'verifyWeb3' : ActorMethod<[Key, string, string, boolean], Result>,
  'web_list' : ActorMethod<[], Web3Count>,
}
export interface _SERVICE extends anon_class_25_1 {}
