import Time "mo:base/Time";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import ImageType "ImageType";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Image "../service/Image";

module EntryType {

  type ImageObject = ImageType.ImageObject;
  type NewImageObject = ImageType.NewImageObject;
  public type UserId = Principal;
  public type PromotedArticles = {
    totalEntries : Int;
    promotionIcp : Int;
  };
  public type EntryCount = {
    totalEntries : Int;
    pendings : Int;
    approved : Int;
    rejected : Int;
    drafts : Int;
    articlespendings : Int;
    articlesapproved : Int;
    articlesrejected : Int;
    totalarticles : Int;
    articlesdrafts : Int;
    podcastpendings : Int;
    podcastapproved : Int;
    podcastrejected : Int;
    totalpodcasts : Int;
    podcastdrafts : Int;
    pressreleasependings : Int;
    pressreleaseapproved : Int;
    pressreleaserejected : Int;
    totalpressrelease : Int;
    pressreleasedrafts : Int;
  };
  public type Web3Count = {
    verified : Int;
    un_verified : Int;
    total_web : Int;
  };
  public type EventCount = {
    pasts : Int;
    ongoing : Int;
    all : Int;
    upcoming : Int;
  };
  public type QuizCount = {
    not_active : Int;
    active : Int;
    all : Int;
  };
  public type SurveyCount = {
    not_active : Int;
    active : Int;
    all : Int;
  };
  public type EntryStatus = {
    #approved;
    #rejected;
    #pending;
  };
  public type Web3Status = {
    #verfied;
    #un_verfied;
    #all;
  };
  public type EntryId = Text;

  public type Entry = {
    title : Text;
    description : Text;
    image : ?NewImageObject;
    likes : Nat;
    likedUsers : [Principal];
    views : Nat;
    viewedUsers : [Principal];
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    subscription : Bool;
    isDraft : Bool;
    isPromoted : Bool;
    minters : [Principal];
    status : EntryStatus;
    pressRelease : Bool;
    // promotionLikesTarget : Nat;
    promotionICP : Nat;
    promotionHistory : List.List<Int>;
    podcastImgCation : Text;
    podcastImg : ?NewImageObject;
    caption : Text;
    tags : [Text];
    isCompanySelected : Bool;
    companyId : Text;
    isPodcast : Bool;
    podcastVideoLink : Text;
    isStatic : Bool;
  };
  public type EntryMetadata = {
    title : Text;
    image : ?NewImageObject;
    description : Text;
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    isPromoted : Bool;
    status : EntryStatus;
    pressRelease : Bool;
    podcastImgCation : Text;
    podcastImg : ?NewImageObject;
    caption : Text;
    tags : [Text];
    isCompanySelected : Bool;
    companyId : Text;
    isPodcast : Bool;
    podcastVideoLink : Text;
    dateModified : Int;
    categoryIds : [Text];

  };
  public type EventMetadata = {
    title : Text;
    shortDescription : Text;
    date : Int;
    endDate : Int;
    location : Text;
    country : Text;
    city : Text;
    website : Text;
    category : [Text];
    tags : [Text];
    organiser : Text;
    image : NewImageObject;
    creation_time : Int;
    month : Nat;
    user : UserId;
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    description : Text;
    freeTicket : Text;
    applyTicket : Text;
    dateModified : Int;
    categoryIds : [Text];

  };
  public type Web3MetaData = {
    company : Text;
    shortDescription : Text;
    companyUrl : ?Text;
    facebook : ?Text;
    instagram : ?Text;
    linkedin : ?Text;
    discord : ?Text;
    telegram : ?Text;
    twitter : ?Text;
    founderName : Text;
    companyBanner : NewImageObject;
    catagory : Text;
    founderDetail : Text;
    founderImage : NewImageObject;
    companyDetail : Text;
    creation_time : Int;
    dateModified : Int;
    user : UserId;
    status : Web3Status;
    companyLogo : NewImageObject;
     categoryId : Text;
  };
  public type InputEntry = {
    title : Text;
    description : Text;
    image : ?NewImageObject;
    userName : Text;
    // user : UserId;
    category : [Text];
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    subscription : Bool;
    isDraft : Bool;
    isPromoted : Bool;
    promotionICP : Nat;
    pressRelease : Bool;
    isPodcast : Bool;
    podcastVideoLink : Text;
    podcastImgCation : Text;
    podcastImg : ?NewImageObject;
    caption : Text;
    tags : [Text];
    isCompanySelected : Bool;
    companyId : Text;

    // promotionLikesTarget : Nat;
    // promotion: ;

  };
  public type ListEntryItem = {
    title : Text;
    image : ?NewImageObject;
    likes : Nat;
    views : Nat;
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    isDraft : Bool;
    minters : [Principal];
    status : EntryStatus;
    isPromoted : Bool;
    pressRelease : Bool;
    isCompanySelected : Bool;
    companyId : Text;
    podcastImgCation : Text;
    podcastImg : ?NewImageObject;
    podcastVideoLink : Text;
    isPodcast : Bool;
    seoExcerpt : Text;
    isStatic : Bool;
    modificationDate : Int;
  };
  public type TrendingEntryItemSidebar = {
    title : Text;
    likes : Nat;
    views : Nat;
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    isDraft : Bool;
    status : EntryStatus;
    isPromoted : Bool;
    pressRelease : Bool;
    isCompanySelected : Bool;
    companyId : Text;
    image : ?NewImageObject;
    seoExcerpt : Text;
    isStatic : Bool;
  };
  public type ListPodcastItem = {
    title : Text;
    image : ?NewImageObject;
    likes : Nat;
    views : Nat;
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    isDraft : Bool;
    minters : [Principal];
    status : EntryStatus;
    pressRelease : Bool;
    isCompanySelected : Bool;
    companyId : Text;
    isPodcast : Bool;
    podcastVideoLink : Text;
    podcastImg : ?NewImageObject;
    likedUsers : [Principal];
    seoExcerpt : Text;
    isStatic : Bool;
  };
  public type Web3 = {
    company : Text;
    shortDescription : Text;
    founderName : Text;
    founderDetail : Text;
    founderImage : NewImageObject;
    companyBanner : NewImageObject;
    catagory : Text;
    creation_time : Int;
    user : UserId;
    status : Web3Status;
    likes : Nat;
    companyUrl : ?Text;
    facebook : ?Text;
    instagram : ?Text;
    linkedin : ?Text;
    discord : ?Text;
    telegram : ?Text;
    twitter : ?Text;
    companyDetail : Text;
    likedUsers : [Principal];
    companyLogo : NewImageObject;
    views : Nat;
    articleCount : Int;
    podcastCount : Int;
    pressReleaseCount : Int;
    totalCount : Int;
    isStatic : Bool;
    founderEmail : Text;
  };
  public type Web3List = {
    company : Text;
    catagory : Text;
    creation_time : Int;
    views : Nat;
    articleCount : Int;
    podcastCount : Int;
    pressReleaseCount : Int;
    totalCount : Int;
    isStatic : Bool;
    founderEmail : Text;

  };
  public type Web3DashboardList = {
    company : Text;
    catagory : Text;
    companyLogo : NewImageObject;
    status : Web3Status;
    founderName : Text;
    companyUrl : ?Text;
    user : UserId;
    creation_time : Int;
    views : Nat;
    isStatic : Bool;
    founderEmail : Text;

  };
  public type InputWeb3 = {
    company : Text;
    shortDescription : Text;
    founderName : Text;
    founderDetail : Text;
    founderImage : NewImageObject;
    companyBanner : NewImageObject;
    catagory : Text;
    companyUrl : Text;
    facebook : Text;
    instagram : Text;
    linkedin : Text;
    discord : Text;
    telegram : Text;
    twitter : Text;
    companyDetail : Text;
    companyLogo : NewImageObject;
    founderEmail : Text;

  };
  public type CategoryId = Text;
  public type Category = {
    name : Text;
    slug : Text;
    description : Text;
    logo : NewImageObject;
    banner : NewImageObject;
    creation_time : Int;
    user : Principal;
    parentCategoryId : ?CategoryId;
    children : ?[CategoryId];
    isChild : Bool;
    articleCount : Int;
    podcastCount : Int;
    eventsCount : Int;
    directoryCount : Int;
    pressReleaseCount : Int;
    totalCount : Int;

  };
  public type NestedCategory = {
    name : Text;
    slug : Text;
    description : Text;
    creation_time : Int;
    user : Principal;
    parentCategoryId : ?CategoryId;
    children : ?[(CategoryId, NestedCategory)];
    isChild : Bool;
    hasMore : Bool;
    articleCount : Int;
    podcastCount : Int;
    eventsCount : Int;
    directoryCount : Int;
    pressReleaseCount : Int;
    totalCount : Int;
  };
  public type InputCategory = {
    name : Text;
    slug : Text;
    description : Text;
    logo : NewImageObject;
    banner : NewImageObject;
    parentCategoryId : ?CategoryId;
  };
  public type ListCategory = {
    name : Text;
    slug : Text;
    description : Text;
    creation_time : Int;
    logo : NewImageObject;
    user : Principal;
    parentCategoryId : ?CategoryId;
    children : ?[CategoryId];
    isChild : Bool;
    articleCount : Int;
    podcastCount : Int;
    eventsCount : Int;
    directoryCount : Int;
    pressReleaseCount : Int;
    totalCount : Int;
  };
  public type TopWeb3Category = {
    name : Text;
    slug : Text;
    creation_time : Int;
    logo : NewImageObject;
    parentCategoryId : ?CategoryId;
    children : ?[CategoryId];
    isChild : Bool;
    articleCount : Int;
    podcastCount : Int;
    eventsCount : Int;
    directoryCount : Int;
    pressReleaseCount : Int;
    totalCount : Int;
  };
  public type EntryStorage = Map.HashMap<EntryId, Entry>;
  public type Web3Storage = Map.HashMap<Text, Web3>;
  public type Subscriber = {
    user : Principal;
    subscribed_on : Int;
  };
  public type SubKey = Principal;
  public type EventId = Text;
  public type Event = {
    title : Text;
    shortDescription : Text;
    description : Text;
    date : Int;
    endDate : Int;
    location : Text;
    country : Text;
    city : Text;
    website : Text;
    category : [Text];
    tags : [Text];
    linkdin : Text;
    facebook : Text;
    telegram : Text;
    instagram : Text;
    twitter : Text;
    organiser : Text;
    image : NewImageObject;
    creation_time : Int;
    month : Nat;
    user : UserId;
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    freeTicket : Text;
    applyTicket : Text;
    lat : Float;
    lng : Float;
    isStatic : Bool;
    discountTicket : Text;
  };
  public type Events = [(EventId, Event)];
  public type InputEvent = {
    title : Text;
    shortDescription : Text;
    description : Text;
    date : Int;
    endDate : Int;
    location : Text;
    country : Text;
    city : Text;
    website : Text;
    category : [Text];
    tags : [Text];
    linkdin : Text;
    facebook : Text;
    telegram : Text;
    instagram : Text;
    twitter : Text;
    organiser : Text;
    image : NewImageObject;
    month : Nat;
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    freeTicket : Text;
    applyTicket : Text;
    lat : Float;
    lng : Float;
    discountTicket : Text;
  };
  public type EventStatus = {
    #all;
    #upcoming;
    #ongoing;
    #past;
  };
  public func generateNewRemoteObjectId() : EntryId {
    return Int.toText(Time.now());
  };

  public func entryIdKey(x : EntryId) : Trie.Key<EntryId> {
    { key = x; hash = Text.hash(x) };
  };
  public type Question = {
    title : Text;
    correctAnswer : [Text];
    options : [Text];
    creation_time : Int;

  };
  public type InputQuestion = {
    title : Text;
    correctAnswer : [Text];
    options : [Text];

  };
  public type QuestionAnswer = {
    title : Text;
    correctAnswer : [Text];

  };
  public type TakenBy = {
    user : Principal;
    score : Int;
    status : Int;
    timestamp : Int;
    reward : ?Nat;
    remainingAttempts : Int;
    attemptAt : Int

  };
  public type TakenByWithTitle = {
    title : Text;
    user : Principal;
    score : Int;
    status : Int;
    timestamp : Int;
    reward : ?Nat;
    remainingAttempts : Int;
    attemptAt : Int;
  };
  public type Quiz = {
    title : Text;
    description : Text;
    createdBy : Principal;
    isGeneral : Bool;
    entryId : Text;
    takenBy : [TakenBy];
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    duration : Nat;
    creation_time : Int;
    questionCount : Int;
    usersWillGetReward : Int;
    attemptsPerUser : Nat;
    passingMarks : Nat;
    remaningUserCanTakeReward : Int;
    oldRewardPerUser : ?Nat;

  };
  public type QuizForUser = {
    isTaken : Bool;
    title : Text;
    entryId : Text;
    participatedCount : Int;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    duration : Nat;
    creation_time : Int;
    questionCount : Int;
    usersWillGetReward : Int;
  };
  public type ReturnQuizWithTitle = {
    title : Text;
    description : Text;
    createdBy : Principal;
    isGeneral : Bool;
    entryId : Text;
    takenBy : [TakenBy];
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    duration : Nat;
    creation_time : Int;
    questionCount : Int;
    usersWillGetReward : Int;
    attemptsPerUser : Nat;
    passingMarks : Nat;
    remaningUserCanTakeReward : Int;
    oldRewardPerUser : ?Nat;
    entryTitle : Text;

  };
  public type InputQuiz = {
    title : Text;
    description : Text;
    isGeneral : Bool;
    entryId : Text;
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    usersWillGetReward : Int;
    isAtive : Bool;
    duration : Nat;
    attemptsPerUser : Nat;
    passingMarks : Nat;

  };
  // ===== servay =====
  public type ServayTakenBy = {
    user : Principal;
    attemptAt : Int;
    reward : ?Nat;
  };
  public type ServayTakenByList = {
    title : Text;
    user : Principal;
    attemptAt : Int;
    reward : ?Nat;
  };
  public type ServayQuestionTakenBy = {
    userSuggestion : Text;
    selectedOption : [Text];
    user : Principal;
    creation_time : Int;
    userName : Text;
  };
  public type AnalysedData = { title : Text; count : Int };
  public type ServayQuestion = {
    title : Text;
    options : [Text];
    ifSelected : ?Int;
    takenBy : [ServayQuestionTakenBy];
    creation_time : Int;
  };
  public type UserServayResponse = {
    title : Text;
    selectedOption : [Text];
    seggestion : Text;
  };
  public type InputServayQuestion = {
    title : Text;
    options : [Text];
    ifSelected : ?Int;
  };
  public type Servay = {
    title : Text;
    description : Text;
    createdBy : Principal;
    takenBy : [ServayTakenBy];
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    creation_time : Int;
    questionCount : Int;
    usersWillGetReward : Int;
    attemptsPerUser : Nat;
    remaningUserCanTakeReward : Int;
    oldRewardPerUser : ?Nat;
    entryId : Text;
  };
   public type ServayForUser = {
    title : Text;
    description : Text;
    createdBy : Principal;
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    creation_time : Int;
    questionCount : Int;
    usersWillGetReward : Int;
    attemptsPerUser : Nat;
    remaningUserCanTakeReward : Int;
    oldRewardPerUser : ?Nat;
    entryId : Text;
    isTaken : Bool;
  };
  public type ServaywithTitle = {
    title : Text;
    description : Text;
    createdBy : Principal;
    takenBy : [ServayTakenBy];
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    creation_time : Int;
    questionCount : Int;
    usersWillGetReward : Int;
    attemptsPerUser : Nat;
    remaningUserCanTakeReward : Int;
    oldRewardPerUser : ?Nat;
    entryId : Text;
    entryTitle : Text

  };
  public type InputServay = {
    title : Text;
    description : Text;
    shouldRewarded : Bool;
    rewardPerUser : ?Nat;
    isAtive : Bool;
    usersWillGetReward : Int;
    attemptsPerUser : Nat;
    entryId : Text;
  };
  public type FeaturedCampaign = {
    entryId : Text;
    startDate : Int;
    endDate : Int;
    isActive : Bool;
    createdBy : Principal;
    creation_time : Int;
  };
  public type FeaturedCampaignItem = {
    entryId : Text;
    startDate : Int;
    endDate : Int;
    isActive : Bool;
    createdBy : Principal;
    creation_time : Int;
    title : Text;
  };
  public type InputFeaturedCampaign = {
    entryId : Text;
    startDate : Int;
    endDate : Int;
    isActive : Bool;
  };
  // transetions
  public type TransectionTypes = {
    #survey;
    #quiz;

  };
  public type InputTransectionTypes = {
    #survey;
    #quiz;
    #all

  };
  public type TransactionHistoryOfServayAndQuiz = {
    user : Principal;
    platform : Nat;
    admin : Nat;
    promotional : Nat;
    creation_time : Int;
    entryType : TransectionTypes;
    id : Text;
    gasFee : Nat;
  };
  public type EntriesModificationDate = {
    creation_time : Int;
    modification_date : Int;
  };
  public type SlugWithData = {
    creation_time : Int;
    modification_date : Int;
    key : Text;
  };
};
