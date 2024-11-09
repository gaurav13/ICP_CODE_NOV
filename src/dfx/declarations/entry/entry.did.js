export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const NewImageObject = IDL.Text;
  const InputEvent = IDL.Record({
    'lat' : IDL.Float64,
    'lng' : IDL.Float64,
    'month' : IDL.Nat,
    'organiser' : IDL.Text,
    'title' : IDL.Text,
    'country' : IDL.Text,
    'seoTitle' : IDL.Text,
    'linkdin' : IDL.Text,
    'endDate' : IDL.Int,
    'twitter' : IDL.Text,
    'seoSlug' : IDL.Text,
    'city' : IDL.Text,
    'date' : IDL.Int,
    'instagram' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'applyTicket' : IDL.Text,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'discountTicket' : IDL.Text,
    'shortDescription' : IDL.Text,
    'facebook' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'image' : NewImageObject,
    'seoDescription' : IDL.Text,
    'freeTicket' : IDL.Text,
    'seoExcerpt' : IDL.Text,
    'location' : IDL.Text,
    'telegram' : IDL.Text,
  });
  const EventId = IDL.Text;
  const Result_4 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, EventId),
    'err' : IDL.Text,
  });
  const InputQuestion = IDL.Record({
    'title' : IDL.Text,
    'correctAnswer' : IDL.Vec(IDL.Text),
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Bool),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const InputServayQuestion = IDL.Record({
    'title' : IDL.Text,
    'ifSelected' : IDL.Opt(IDL.Int),
    'options' : IDL.Vec(IDL.Text),
  });
  const InputQuiz = IDL.Record({
    'title' : IDL.Text,
    'duration' : IDL.Nat,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'attemptsPerUser' : IDL.Nat,
    'isGeneral' : IDL.Bool,
    'isAtive' : IDL.Bool,
    'passingMarks' : IDL.Nat,
    'usersWillGetReward' : IDL.Int,
  });
  const InputServay = IDL.Record({
    'title' : IDL.Text,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'attemptsPerUser' : IDL.Nat,
    'isAtive' : IDL.Bool,
    'usersWillGetReward' : IDL.Int,
  });
  const Key = IDL.Text;
  const InputFeaturedCampaign = IDL.Record({
    'endDate' : IDL.Int,
    'isActive' : IDL.Bool,
    'entryId' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const CategoryId__1 = IDL.Text;
  const InputCategory = IDL.Record({
    'logo' : NewImageObject,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'banner' : NewImageObject,
    'description' : IDL.Text,
    'parentCategoryId' : IDL.Opt(CategoryId__1),
  });
  const Category = IDL.Record({
    'creation_time' : IDL.Int,
    'logo' : NewImageObject,
    'name' : IDL.Text,
    'directoryCount' : IDL.Int,
    'slug' : IDL.Text,
    'user' : IDL.Principal,
    'totalCount' : IDL.Int,
    'banner' : NewImageObject,
    'description' : IDL.Text,
    'pressReleaseCount' : IDL.Int,
    'parentCategoryId' : IDL.Opt(CategoryId__1),
    'children' : IDL.Opt(IDL.Vec(CategoryId__1)),
    'articleCount' : IDL.Int,
    'isChild' : IDL.Bool,
    'podcastCount' : IDL.Int,
    'eventsCount' : IDL.Int,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, Category),
    'err' : IDL.Text,
  });
  const EntryStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const UserId__1 = IDL.Principal;
  List.fill(IDL.Opt(IDL.Tuple(IDL.Int, List)));
  const Entry = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'promotionICP' : IDL.Nat,
    'likedUsers' : IDL.Vec(IDL.Principal),
    'seoSlug' : IDL.Text,
    'subscription' : IDL.Bool,
    'views' : IDL.Nat,
    'tags' : IDL.Vec(IDL.Text),
    'user' : UserId__1,
    'podcastImg' : IDL.Opt(NewImageObject),
    'minters' : IDL.Vec(IDL.Principal),
    'isStatic' : IDL.Bool,
    'description' : IDL.Text,
    'isPodcast' : IDL.Bool,
    'isPromoted' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'promotionHistory' : List,
    'pressRelease' : IDL.Bool,
    'caption' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'viewedUsers' : IDL.Vec(IDL.Principal),
    'image' : IDL.Opt(NewImageObject),
    'seoDescription' : IDL.Text,
    'podcastVideoLink' : IDL.Text,
    'isCompanySelected' : IDL.Bool,
    'seoExcerpt' : IDL.Text,
    'podcastImgCation' : IDL.Text,
    'companyId' : IDL.Text,
  });
  const Result_16 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Opt(Entry)),
    'err' : IDL.Text,
  });
  const Result_18 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, Entry),
    'err' : IDL.Text,
  });
  const Result_17 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const CategoryId = IDL.Text;
  const ListCategory = IDL.Record({
    'creation_time' : IDL.Int,
    'logo' : NewImageObject,
    'name' : IDL.Text,
    'directoryCount' : IDL.Int,
    'slug' : IDL.Text,
    'user' : IDL.Principal,
    'totalCount' : IDL.Int,
    'description' : IDL.Text,
    'pressReleaseCount' : IDL.Int,
    'parentCategoryId' : IDL.Opt(CategoryId__1),
    'children' : IDL.Opt(IDL.Vec(CategoryId__1)),
    'articleCount' : IDL.Int,
    'isChild' : IDL.Bool,
    'podcastCount' : IDL.Int,
    'eventsCount' : IDL.Int,
  });
  const ListCategories = IDL.Vec(IDL.Tuple(CategoryId, ListCategory));
  const Result_15 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Opt(Category)),
    'err' : IDL.Text,
  });
  const EventCount = IDL.Record({
    'all' : IDL.Int,
    'upcoming' : IDL.Int,
    'ongoing' : IDL.Int,
    'pasts' : IDL.Int,
  });
  const SlugWithData = IDL.Record({
    'key' : IDL.Text,
    'creation_time' : IDL.Int,
    'modification_date' : IDL.Int,
  });
  const AnalysedData = IDL.Record({ 'title' : IDL.Text, 'count' : IDL.Int });
  const Result_14 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Text, IDL.Vec(AnalysedData)),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const Web3Status = IDL.Variant({
    'all' : IDL.Null,
    'un_verfied' : IDL.Null,
    'verfied' : IDL.Null,
  });
  const Web3 = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : Web3Status,
    'linkedin' : IDL.Opt(IDL.Text),
    'companyBanner' : NewImageObject,
    'founderName' : IDL.Text,
    'likedUsers' : IDL.Vec(IDL.Principal),
    'twitter' : IDL.Opt(IDL.Text),
    'views' : IDL.Nat,
    'founderImage' : NewImageObject,
    'instagram' : IDL.Opt(IDL.Text),
    'companyDetail' : IDL.Text,
    'user' : UserId__1,
    'totalCount' : IDL.Int,
    'isStatic' : IDL.Bool,
    'catagory' : IDL.Text,
    'pressReleaseCount' : IDL.Int,
    'likes' : IDL.Nat,
    'company' : IDL.Text,
    'shortDescription' : IDL.Text,
    'facebook' : IDL.Opt(IDL.Text),
    'companyLogo' : NewImageObject,
    'discord' : IDL.Opt(IDL.Text),
    'companyUrl' : IDL.Opt(IDL.Text),
    'articleCount' : IDL.Int,
    'telegram' : IDL.Opt(IDL.Text),
    'podcastCount' : IDL.Int,
    'founderEmail' : IDL.Text,
    'founderDetail' : IDL.Text,
  });
  const FeaturedCampaign = IDL.Record({
    'creation_time' : IDL.Int,
    'endDate' : IDL.Int,
    'createdBy' : IDL.Principal,
    'isActive' : IDL.Bool,
    'entryId' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const ListEntryItem = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'views' : IDL.Nat,
    'modificationDate' : IDL.Int,
    'user' : UserId__1,
    'podcastImg' : IDL.Opt(NewImageObject),
    'minters' : IDL.Vec(IDL.Principal),
    'isStatic' : IDL.Bool,
    'isPodcast' : IDL.Bool,
    'isPromoted' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'image' : IDL.Opt(NewImageObject),
    'podcastVideoLink' : IDL.Text,
    'isCompanySelected' : IDL.Bool,
    'seoExcerpt' : IDL.Text,
    'podcastImgCation' : IDL.Text,
    'companyId' : IDL.Text,
  });
  const EntryMetadata = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'seoSlug' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'user' : UserId__1,
    'podcastImg' : IDL.Opt(NewImageObject),
    'description' : IDL.Text,
    'isPodcast' : IDL.Bool,
    'isPromoted' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'caption' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'image' : IDL.Opt(NewImageObject),
    'seoDescription' : IDL.Text,
    'podcastVideoLink' : IDL.Text,
    'isCompanySelected' : IDL.Bool,
    'dateModified' : IDL.Int,
    'seoExcerpt' : IDL.Text,
    'podcastImgCation' : IDL.Text,
    'categoryIds' : IDL.Vec(IDL.Text),
    'companyId' : IDL.Text,
  });
  const EventMetadata = IDL.Record({
    'creation_time' : IDL.Int,
    'month' : IDL.Nat,
    'organiser' : IDL.Text,
    'title' : IDL.Text,
    'country' : IDL.Text,
    'seoTitle' : IDL.Text,
    'endDate' : IDL.Int,
    'seoSlug' : IDL.Text,
    'city' : IDL.Text,
    'date' : IDL.Int,
    'tags' : IDL.Vec(IDL.Text),
    'user' : UserId__1,
    'applyTicket' : IDL.Text,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'shortDescription' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'image' : NewImageObject,
    'seoDescription' : IDL.Text,
    'dateModified' : IDL.Int,
    'freeTicket' : IDL.Text,
    'seoExcerpt' : IDL.Text,
    'location' : IDL.Text,
    'categoryIds' : IDL.Vec(IDL.Text),
  });
  const EventId__1 = IDL.Text;
  const Event = IDL.Record({
    'lat' : IDL.Float64,
    'lng' : IDL.Float64,
    'creation_time' : IDL.Int,
    'month' : IDL.Nat,
    'organiser' : IDL.Text,
    'title' : IDL.Text,
    'country' : IDL.Text,
    'seoTitle' : IDL.Text,
    'linkdin' : IDL.Text,
    'endDate' : IDL.Int,
    'twitter' : IDL.Text,
    'seoSlug' : IDL.Text,
    'city' : IDL.Text,
    'date' : IDL.Int,
    'instagram' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'user' : UserId__1,
    'applyTicket' : IDL.Text,
    'isStatic' : IDL.Bool,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'discountTicket' : IDL.Text,
    'shortDescription' : IDL.Text,
    'facebook' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'image' : NewImageObject,
    'seoDescription' : IDL.Text,
    'freeTicket' : IDL.Text,
    'seoExcerpt' : IDL.Text,
    'location' : IDL.Text,
    'telegram' : IDL.Text,
  });
  const Events = IDL.Vec(IDL.Tuple(EventId__1, Event));
  const FeaturedCampaignItem = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'endDate' : IDL.Int,
    'createdBy' : IDL.Principal,
    'isActive' : IDL.Bool,
    'entryId' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const TakenBy = IDL.Record({
    'status' : IDL.Int,
    'reward' : IDL.Opt(IDL.Nat),
    'attemptAt' : IDL.Int,
    'user' : IDL.Principal,
    'score' : IDL.Int,
    'remainingAttempts' : IDL.Int,
    'timestamp' : IDL.Int,
  });
  const Quiz = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'duration' : IDL.Nat,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'takenBy' : IDL.Vec(TakenBy),
    'attemptsPerUser' : IDL.Nat,
    'isGeneral' : IDL.Bool,
    'isAtive' : IDL.Bool,
    'oldRewardPerUser' : IDL.Opt(IDL.Nat),
    'passingMarks' : IDL.Nat,
    'remaningUserCanTakeReward' : IDL.Int,
    'usersWillGetReward' : IDL.Int,
    'questionCount' : IDL.Int,
  });
  const Question = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'correctAnswer' : IDL.Vec(IDL.Text),
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_13 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Opt(Quiz), IDL.Vec(Question)),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const Result_12 = IDL.Variant({
    'ok' : IDL.Tuple(
      IDL.Opt(Quiz),
      IDL.Record({ 'entries' : IDL.Vec(Question), 'amount' : IDL.Nat }),
    ),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const ServayTakenBy = IDL.Record({
    'reward' : IDL.Opt(IDL.Nat),
    'attemptAt' : IDL.Int,
    'user' : IDL.Principal,
  });
  const Servay = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'takenBy' : IDL.Vec(ServayTakenBy),
    'attemptsPerUser' : IDL.Nat,
    'isAtive' : IDL.Bool,
    'oldRewardPerUser' : IDL.Opt(IDL.Nat),
    'remaningUserCanTakeReward' : IDL.Int,
    'usersWillGetReward' : IDL.Int,
    'questionCount' : IDL.Int,
  });
  const ServayQuestionTakenBy__1 = IDL.Record({
    'creation_time' : IDL.Int,
    'userSuggestion' : IDL.Text,
    'userName' : IDL.Text,
    'user' : IDL.Principal,
    'selectedOption' : IDL.Vec(IDL.Text),
  });
  const ServayQuestion = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'ifSelected' : IDL.Opt(IDL.Int),
    'takenBy' : IDL.Vec(ServayQuestionTakenBy__1),
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_11 = IDL.Variant({
    'ok' : IDL.Tuple(
      IDL.Opt(Servay),
      IDL.Record({ 'entries' : IDL.Vec(ServayQuestion), 'amount' : IDL.Nat }),
    ),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const Result_10 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Opt(Servay), IDL.Vec(ServayQuestion)),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const InputTransectionTypes = IDL.Variant({
    'all' : IDL.Null,
    'quiz' : IDL.Null,
    'survey' : IDL.Null,
  });
  const TransectionTypes = IDL.Variant({
    'quiz' : IDL.Null,
    'survey' : IDL.Null,
  });
  const TransactionHistoryOfServayAndQuiz = IDL.Record({
    'id' : IDL.Text,
    'creation_time' : IDL.Int,
    'admin' : IDL.Nat,
    'entryType' : TransectionTypes,
    'user' : IDL.Principal,
    'gasFee' : IDL.Nat,
    'platform' : IDL.Nat,
    'promotional' : IDL.Nat,
  });
  const QuizForUser = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'duration' : IDL.Nat,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'participatedCount' : IDL.Int,
    'entryId' : IDL.Text,
    'isTaken' : IDL.Bool,
    'isAtive' : IDL.Bool,
    'usersWillGetReward' : IDL.Int,
    'questionCount' : IDL.Int,
  });
  const ReturnQuizWithTitle = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'duration' : IDL.Nat,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'takenBy' : IDL.Vec(TakenBy),
    'attemptsPerUser' : IDL.Nat,
    'isGeneral' : IDL.Bool,
    'isAtive' : IDL.Bool,
    'oldRewardPerUser' : IDL.Opt(IDL.Nat),
    'passingMarks' : IDL.Nat,
    'remaningUserCanTakeReward' : IDL.Int,
    'usersWillGetReward' : IDL.Int,
    'entryTitle' : IDL.Text,
    'questionCount' : IDL.Int,
  });
  const EntryStatus__1 = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const ListPodcastItem = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'likedUsers' : IDL.Vec(IDL.Principal),
    'views' : IDL.Nat,
    'user' : UserId__1,
    'podcastImg' : IDL.Opt(NewImageObject),
    'minters' : IDL.Vec(IDL.Principal),
    'isStatic' : IDL.Bool,
    'isPodcast' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'image' : IDL.Opt(NewImageObject),
    'podcastVideoLink' : IDL.Text,
    'isCompanySelected' : IDL.Bool,
    'seoExcerpt' : IDL.Text,
    'companyId' : IDL.Text,
  });
  const ServayForUser = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'isTaken' : IDL.Bool,
    'attemptsPerUser' : IDL.Nat,
    'isAtive' : IDL.Bool,
    'oldRewardPerUser' : IDL.Opt(IDL.Nat),
    'remaningUserCanTakeReward' : IDL.Int,
    'usersWillGetReward' : IDL.Int,
    'questionCount' : IDL.Int,
  });
  const ServaywithTitle = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'shouldRewarded' : IDL.Bool,
    'rewardPerUser' : IDL.Opt(IDL.Nat),
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'entryId' : IDL.Text,
    'takenBy' : IDL.Vec(ServayTakenBy),
    'attemptsPerUser' : IDL.Nat,
    'isAtive' : IDL.Bool,
    'oldRewardPerUser' : IDL.Opt(IDL.Nat),
    'remaningUserCanTakeReward' : IDL.Int,
    'usersWillGetReward' : IDL.Int,
    'entryTitle' : IDL.Text,
    'questionCount' : IDL.Int,
  });
  const UserId = IDL.Principal;
  const TakenByWithTitle = IDL.Record({
    'status' : IDL.Int,
    'reward' : IDL.Opt(IDL.Nat),
    'title' : IDL.Text,
    'attemptAt' : IDL.Int,
    'user' : IDL.Principal,
    'score' : IDL.Int,
    'remainingAttempts' : IDL.Int,
    'timestamp' : IDL.Int,
  });
  const ServayTakenByList = IDL.Record({
    'reward' : IDL.Opt(IDL.Nat),
    'title' : IDL.Text,
    'attemptAt' : IDL.Int,
    'user' : IDL.Principal,
  });
  const ServayQuestionTakenBy = IDL.Record({
    'creation_time' : IDL.Int,
    'userSuggestion' : IDL.Text,
    'userName' : IDL.Text,
    'user' : IDL.Principal,
    'selectedOption' : IDL.Vec(IDL.Text),
  });
  const Result_9 = IDL.Variant({
    'ok' : IDL.Tuple(
      IDL.Text,
      IDL.Record({
        'entries' : IDL.Vec(ServayQuestionTakenBy),
        'amount' : IDL.Nat,
      }),
    ),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const Web3Status__1 = IDL.Variant({
    'all' : IDL.Null,
    'un_verfied' : IDL.Null,
    'verfied' : IDL.Null,
  });
  const Web3DashboardList = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : Web3Status,
    'founderName' : IDL.Text,
    'views' : IDL.Nat,
    'user' : UserId__1,
    'isStatic' : IDL.Bool,
    'catagory' : IDL.Text,
    'company' : IDL.Text,
    'companyLogo' : NewImageObject,
    'companyUrl' : IDL.Opt(IDL.Text),
    'founderEmail' : IDL.Text,
  });
  const Web3List = IDL.Record({
    'creation_time' : IDL.Int,
    'views' : IDL.Nat,
    'totalCount' : IDL.Int,
    'isStatic' : IDL.Bool,
    'catagory' : IDL.Text,
    'pressReleaseCount' : IDL.Int,
    'company' : IDL.Text,
    'articleCount' : IDL.Int,
    'podcastCount' : IDL.Int,
    'founderEmail' : IDL.Text,
  });
  const Web3MetaData = IDL.Record({
    'categoryId' : IDL.Text,
    'creation_time' : IDL.Int,
    'status' : Web3Status,
    'linkedin' : IDL.Opt(IDL.Text),
    'companyBanner' : NewImageObject,
    'founderName' : IDL.Text,
    'twitter' : IDL.Opt(IDL.Text),
    'founderImage' : NewImageObject,
    'instagram' : IDL.Opt(IDL.Text),
    'companyDetail' : IDL.Text,
    'user' : UserId__1,
    'catagory' : IDL.Text,
    'company' : IDL.Text,
    'shortDescription' : IDL.Text,
    'facebook' : IDL.Opt(IDL.Text),
    'companyLogo' : NewImageObject,
    'discord' : IDL.Opt(IDL.Text),
    'companyUrl' : IDL.Opt(IDL.Text),
    'dateModified' : IDL.Int,
    'telegram' : IDL.Opt(IDL.Text),
    'founderDetail' : IDL.Text,
  });
  const TopWeb3Category = IDL.Record({
    'creation_time' : IDL.Int,
    'logo' : NewImageObject,
    'name' : IDL.Text,
    'directoryCount' : IDL.Int,
    'slug' : IDL.Text,
    'totalCount' : IDL.Int,
    'pressReleaseCount' : IDL.Int,
    'parentCategoryId' : IDL.Opt(CategoryId__1),
    'children' : IDL.Opt(IDL.Vec(CategoryId__1)),
    'articleCount' : IDL.Int,
    'isChild' : IDL.Bool,
    'podcastCount' : IDL.Int,
    'eventsCount' : IDL.Int,
  });
  const TopWeb3Categories = IDL.Vec(IDL.Tuple(CategoryId, TopWeb3Category));
  const Event__1 = IDL.Record({
    'lat' : IDL.Float64,
    'lng' : IDL.Float64,
    'creation_time' : IDL.Int,
    'month' : IDL.Nat,
    'organiser' : IDL.Text,
    'title' : IDL.Text,
    'country' : IDL.Text,
    'seoTitle' : IDL.Text,
    'linkdin' : IDL.Text,
    'endDate' : IDL.Int,
    'twitter' : IDL.Text,
    'seoSlug' : IDL.Text,
    'city' : IDL.Text,
    'date' : IDL.Int,
    'instagram' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'user' : UserId__1,
    'applyTicket' : IDL.Text,
    'isStatic' : IDL.Bool,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'discountTicket' : IDL.Text,
    'shortDescription' : IDL.Text,
    'facebook' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'image' : NewImageObject,
    'seoDescription' : IDL.Text,
    'freeTicket' : IDL.Text,
    'seoExcerpt' : IDL.Text,
    'location' : IDL.Text,
    'telegram' : IDL.Text,
  });
  const RewardConfig = IDL.Record({
    'admin' : IDL.Nat,
    'platform' : IDL.Nat,
    'master' : IDL.Nat,
  });
  const EventStatus = IDL.Variant({
    'all' : IDL.Null,
    'upcoming' : IDL.Null,
    'past' : IDL.Null,
    'ongoing' : IDL.Null,
  });
  const InputEntry = IDL.Record({
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'promotionICP' : IDL.Nat,
    'seoSlug' : IDL.Text,
    'subscription' : IDL.Bool,
    'tags' : IDL.Vec(IDL.Text),
    'podcastImg' : IDL.Opt(NewImageObject),
    'description' : IDL.Text,
    'isPodcast' : IDL.Bool,
    'isPromoted' : IDL.Bool,
    'isDraft' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'caption' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'image' : IDL.Opt(NewImageObject),
    'seoDescription' : IDL.Text,
    'podcastVideoLink' : IDL.Text,
    'isCompanySelected' : IDL.Bool,
    'seoExcerpt' : IDL.Text,
    'podcastImgCation' : IDL.Text,
    'companyId' : IDL.Text,
  });
  const EntryId = IDL.Text;
  const Result_8 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, EntryId),
    'err' : IDL.Text,
  });
  const InputWeb3 = IDL.Record({
    'linkedin' : IDL.Text,
    'companyBanner' : NewImageObject,
    'founderName' : IDL.Text,
    'twitter' : IDL.Text,
    'founderImage' : NewImageObject,
    'instagram' : IDL.Text,
    'companyDetail' : IDL.Text,
    'catagory' : IDL.Text,
    'company' : IDL.Text,
    'shortDescription' : IDL.Text,
    'facebook' : IDL.Text,
    'companyLogo' : NewImageObject,
    'discord' : IDL.Text,
    'companyUrl' : IDL.Text,
    'telegram' : IDL.Text,
    'founderEmail' : IDL.Text,
    'founderDetail' : IDL.Text,
  });
  const Web3Id = IDL.Text;
  const Result_7 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, Web3Id),
    'err' : IDL.Text,
  });
  const Result_6 = IDL.Variant({
    'ok' : IDL.Record({ 'isStatic' : IDL.Bool, 'isPodcast' : IDL.Bool }),
    'err' : IDL.Null,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Bool),
    'err' : IDL.Text,
  });
  const PromotedArticles = IDL.Record({
    'totalEntries' : IDL.Int,
    'promotionIcp' : IDL.Int,
  });
  const QuizCount = IDL.Record({
    'all' : IDL.Int,
    'active' : IDL.Int,
    'not_active' : IDL.Int,
  });
  const UserServayResponse = IDL.Record({
    'title' : IDL.Text,
    'seggestion' : IDL.Text,
    'selectedOption' : IDL.Vec(IDL.Text),
  });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat), IDL.Bool),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const SurveyCount = IDL.Record({
    'all' : IDL.Int,
    'active' : IDL.Int,
    'not_active' : IDL.Int,
  });
  const TrendingEntryItemSidebar = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'views' : IDL.Nat,
    'user' : UserId__1,
    'isStatic' : IDL.Bool,
    'isPromoted' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'image' : IDL.Opt(NewImageObject),
    'isCompanySelected' : IDL.Bool,
    'seoExcerpt' : IDL.Text,
    'companyId' : IDL.Text,
  });
  const LikeReward = IDL.Nat;
  const EntryCount = IDL.Record({
    'podcastdrafts' : IDL.Int,
    'pressreleaseapproved' : IDL.Int,
    'totalEntries' : IDL.Int,
    'totalpressrelease' : IDL.Int,
    'pressreleaserejected' : IDL.Int,
    'pendings' : IDL.Int,
    'articlespendings' : IDL.Int,
    'podcastpendings' : IDL.Int,
    'pressreleasedrafts' : IDL.Int,
    'approved' : IDL.Int,
    'articlesapproved' : IDL.Int,
    'podcastapproved' : IDL.Int,
    'totalarticles' : IDL.Int,
    'totalpodcasts' : IDL.Int,
    'rejected' : IDL.Int,
    'articlesrejected' : IDL.Int,
    'podcastrejected' : IDL.Int,
    'pressreleasependings' : IDL.Int,
    'drafts' : IDL.Int,
    'articlesdrafts' : IDL.Int,
  });
  const QuestionAnswer = IDL.Record({
    'title' : IDL.Text,
    'correctAnswer' : IDL.Vec(IDL.Text),
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Int, IDL.Int, IDL.Int),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const Web3Count = IDL.Record({
    'verified' : IDL.Int,
    'total_web' : IDL.Int,
    'un_verified' : IDL.Int,
  });
  const anon_class_25_1 = IDL.Service({
    'addCategory' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Vec(IDL.Text)],
        [],
      ),
    'addEvent' : IDL.Func([InputEvent, IDL.Text, IDL.Text], [Result_4], []),
    'addMultipleQuestions' : IDL.Func(
        [IDL.Text, IDL.Vec(InputQuestion), IDL.Text],
        [Result_3],
        [],
      ),
    'addMultipleQuestionsToSurvey' : IDL.Func(
        [IDL.Text, IDL.Vec(InputServayQuestion), IDL.Text],
        [Result_3],
        [],
      ),
    'addQuestion' : IDL.Func(
        [IDL.Text, InputQuestion, IDL.Text],
        [Result_3],
        [],
      ),
    'addQuiz' : IDL.Func([InputQuiz, IDL.Text], [Result_3], []),
    'addServay' : IDL.Func([InputServay, IDL.Text], [Result_3], []),
    'addServayQuestion' : IDL.Func(
        [IDL.Text, InputServayQuestion, IDL.Text],
        [Result_3],
        [],
      ),
    'addView' : IDL.Func([Key], [IDL.Bool], []),
    'addWeb3View' : IDL.Func([Key], [IDL.Bool], []),
    'addWeb3postCount' : IDL.Func([Key, IDL.Text], [IDL.Bool], []),
    'add_campaign' : IDL.Func(
        [InputFeaturedCampaign, IDL.Text],
        [Result_3],
        [],
      ),
    'add_category' : IDL.Func(
        [InputCategory, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'adminDeleteEntry' : IDL.Func([Key, IDL.Text, IDL.Text], [Result_16], []),
    'approveArticle' : IDL.Func(
        [IDL.Text, IDL.Text, Key, IDL.Bool],
        [Result_18],
        [],
      ),
    'approvePodcast' : IDL.Func(
        [IDL.Text, IDL.Text, Key, IDL.Bool],
        [Result_18],
        [],
      ),
    'buyNFTStudio24Tokens' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [Result_17],
        [],
      ),
    'changeStatusOfServay' : IDL.Func(
        [IDL.Bool, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'changeTheStatusOfQuiz' : IDL.Func(
        [IDL.Bool, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'child_to_category' : IDL.Func(
        [IDL.Vec(CategoryId)],
        [ListCategories],
        ['query'],
      ),
    'deleteDraftEntry' : IDL.Func([Key, IDL.Text], [Result_16], []),
    'deleteQuestion' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_3], []),
    'deleteServayQuestion' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'deleteSurveyQuestions' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Text],
        [Result_3],
        [],
      ),
    'delete_campaign' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'delete_category' : IDL.Func(
        [CategoryId, IDL.Text, IDL.Text],
        [Result_15],
        [],
      ),
    'delete_event' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_3], []),
    'delete_quiz' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'delete_servay' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'delete_web3' : IDL.Func([Key, IDL.Text, IDL.Text], [Result_3], []),
    'deletequizQuestions' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Text],
        [Result_3],
        [],
      ),
    'editViews' : IDL.Func([Key, IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
    'editWeb3Views' : IDL.Func(
        [Key, IDL.Nat, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'event_types' : IDL.Func([], [EventCount], ['query']),
    'getAllCategoriesIds' : IDL.Func([], [IDL.Vec(SlugWithData)], ['query']),
    'getAllEntries' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getAllEntryIds' : IDL.Func([IDL.Bool], [IDL.Vec(SlugWithData)], ['query']),
    'getAllEventsIds' : IDL.Func([], [IDL.Vec(SlugWithData)], ['query']),
    'getAllWeb3Ids' : IDL.Func([], [IDL.Vec(SlugWithData)], ['query']),
    'getAnalysis' : IDL.Func([IDL.Text, IDL.Text], [Result_14], []),
    'getApprovedWeb3List' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(Key, Web3))],
        ['query'],
      ),
    'getCampaignById_forAdmin' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(FeaturedCampaign)],
        ['query'],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getEntriesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getEntriesList' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getEntriesNew' : IDL.Func(
        [CategoryId, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getEntriesNewlatest' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getEntriesOfWeb3' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getEntry' : IDL.Func([Key], [IDL.Opt(Entry)], ['query']),
    'getEntryMeta' : IDL.Func([Key], [EntryMetadata], ['query']),
    'getEntry_admin' : IDL.Func([Key], [IDL.Opt(Entry)], ['query']),
    'getEventMeta' : IDL.Func([Key], [EventMetadata], ['query']),
    'getEventsOfWeb3' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
        ],
        [IDL.Record({ 'entries' : Events, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'getFeaturedCampaignList' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, FeaturedCampaignItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getFeaturedEntriesList' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getOnlyActiveQuizOfArticle' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Text)],
        [],
      ),
    'getOnlyActiveQuizOfArticles' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat)))],
        [],
      ),
    'getOnlyActiveSurveyOfArticle' : IDL.Func([Key], [IDL.Vec(IDL.Text)], []),
    'getOnlyArticles' : IDL.Func(
        [IDL.Nat, IDL.Vec(IDL.Text)],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getOnlyPressRelease' : IDL.Func(
        [IDL.Nat, IDL.Vec(IDL.Text)],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getPaginatedEntries' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getPendingWeb3List' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(Key, Web3))],
        ['query'],
      ),
    'getPressEntries' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getPromotedEntries' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getPromotionAmountOfQuiz' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Nat)],
        ['query'],
      ),
    'getQuestionsOfQuiz' : IDL.Func([IDL.Text], [Result_13], []),
    'getQuestionsOfQuiz_admin' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [Result_12],
        [],
      ),
    'getQuestionsOfServay_admin' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [Result_11],
        [],
      ),
    'getQuestionsOfSurvey' : IDL.Func([IDL.Text], [Result_10], []),
    'getQuizAndServayTransectionForAdmin' : IDL.Func(
        [InputTransectionTypes, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(
              IDL.Tuple(IDL.Text, TransactionHistoryOfServayAndQuiz)
            ),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getQuizById' : IDL.Func([IDL.Text], [IDL.Opt(Quiz)], ['query']),
    'getQuizById_foradmin' : IDL.Func([IDL.Text], [IDL.Opt(Quiz)], ['query']),
    'getQuizIdsList_Of_article' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], []),
    'getQuizList' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, QuizForUser)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getQuizList_for_admin' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Int, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, ReturnQuizWithTitle)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getQuizList_for_auther' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Int, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, ReturnQuizWithTitle)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getQuriedEntries' : IDL.Func(
        [IDL.Opt(CategoryId), IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getReviewEntries' : IDL.Func(
        [IDL.Text, IDL.Text, EntryStatus__1, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getReviewPodcast' : IDL.Func(
        [IDL.Text, IDL.Text, EntryStatus__1, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListPodcastItem)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getRewardsOfQuizandSurvey' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'getSearchedEntries' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getServayById' : IDL.Func([IDL.Text], [IDL.Opt(Servay)], ['query']),
    'getServayById_foradmin' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(Servay)],
        ['query'],
      ),
    'getServayList' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, ServayForUser)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getServayList_for_admin' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Int, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, ServaywithTitle)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getServayList_for_auther' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Int, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, ServaywithTitle)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getSurveyIdsList_Of_article' : IDL.Func([Key], [IDL.Vec(IDL.Text)], []),
    'getTakenQuizOfUser' : IDL.Func(
        [UserId, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, TakenByWithTitle)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getTakenSurveyOfUser' : IDL.Func(
        [UserId, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(IDL.Text, ServayTakenByList)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getUniqueDataList' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListPodcastItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserEntries' : IDL.Func(
        [UserId, IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserEntriesList' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserFavouriteDirectories' : IDL.Func(
        [UserId, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'web3List' : IDL.Vec(IDL.Tuple(Key, Web3)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserFavouritePost' : IDL.Func(
        [UserId, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserSeggestionList' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Text],
        [Result_9],
        [],
      ),
    'getUserWeb3List' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'web3List' : IDL.Vec(IDL.Tuple(Key, Web3)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getWeb3' : IDL.Func([Key], [IDL.Opt(Web3)], ['query']),
    'getWeb3DirectoriesDashboard' : IDL.Func(
        [IDL.Text, Web3Status__1, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'web3List' : IDL.Vec(IDL.Tuple(Key, Web3DashboardList)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getWeb3List' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'web3List' : IDL.Vec(IDL.Tuple(Key, Web3List)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getWeb3ListOfAllUsers' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'web3List' : IDL.Vec(IDL.Tuple(Key, Web3)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getWeb3Meta' : IDL.Func([Key], [Web3MetaData], ['query']),
    'getWeb3_for_admin' : IDL.Func([Key, IDL.Text], [IDL.Opt(Web3)], []),
    'get_categories' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat, IDL.Bool],
        [IDL.Record({ 'entries' : TopWeb3Categories, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'get_categories_by_name' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(IDL.Tuple(CategoryId, Category))],
        ['query'],
      ),
    'get_category' : IDL.Func([IDL.Text], [IDL.Opt(Category)], ['query']),
    'get_event' : IDL.Func([IDL.Text], [IDL.Opt(Event__1)], ['query']),
    'get_events' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Text,
        ],
        [IDL.Record({ 'entries' : Events, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'get_like_reward' : IDL.Func([], [IDL.Nat], ['query']),
    'get_list_categories' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat, IDL.Bool],
        [IDL.Record({ 'entries' : ListCategories, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'get_list_category' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(ListCategory)],
        ['query'],
      ),
    'get_reward' : IDL.Func([], [RewardConfig], ['query']),
    'get_upcoming_events' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          EventStatus,
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Text,
        ],
        [IDL.Record({ 'entries' : Events, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'insertEntry' : IDL.Func(
        [InputEntry, IDL.Text, IDL.Bool, IDL.Text, IDL.Text],
        [Result_8],
        [],
      ),
    'insertWeb3' : IDL.Func(
        [InputWeb3, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
        [Result_7],
        [],
      ),
    'isEntryPodcast' : IDL.Func([Key], [Result_6], ['query']),
    'isEntryVerifiedPublicFn' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'isMinted' : IDL.Func([Key], [IDL.Bool], []),
    'likeEntry' : IDL.Func([Key, IDL.Text, IDL.Text], [Result], []),
    'likeWeb3' : IDL.Func([Key, IDL.Text, IDL.Text], [Result], []),
    'makeStatic' : IDL.Func([Key], [IDL.Bool], []),
    'makeStaticEvent' : IDL.Func([Key], [IDL.Bool], []),
    'makeStaticWeb3' : IDL.Func([Key], [IDL.Bool], []),
    'mintEntry' : IDL.Func([Key, IDL.Text], [Result], []),
    'promoteTheServay' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'promotedTheQuiz' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Result_3], []),
    'promotedarticles_count' : IDL.Func([], [PromotedArticles], ['query']),
    'quiz_list' : IDL.Func([], [QuizCount], ['query']),
    'saveUserResponseToServay' : IDL.Func(
        [IDL.Text, IDL.Vec(UserServayResponse), IDL.Text],
        [Result_5],
        [],
      ),
    'survey_list' : IDL.Func([], [SurveyCount], ['query']),
    'total_events' : IDL.Func([], [IDL.Int], ['query']),
    'trendingEntryItemSidebar' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(Key, TrendingEntryItemSidebar))],
        ['query'],
      ),
    'trendingPressReleaseItemSidebar' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(Key, TrendingEntryItemSidebar))],
        ['query'],
      ),
    'updateEntry' : IDL.Func([Entry, IDL.Text], [IDL.Bool], []),
    'updateEvent' : IDL.Func(
        [InputEvent, IDL.Text, IDL.Text, IDL.Text],
        [Result_4],
        [],
      ),
    'updateQuestion' : IDL.Func(
        [IDL.Text, IDL.Text, InputQuestion, IDL.Text],
        [Result_3],
        [],
      ),
    'updateQuiz' : IDL.Func([InputQuiz, IDL.Text, IDL.Text], [Result_3], []),
    'updateServay' : IDL.Func(
        [InputServay, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'updateServayQuestion' : IDL.Func(
        [IDL.Text, IDL.Text, InputServayQuestion, IDL.Text],
        [Result_3],
        [],
      ),
    'updateUserEntries' : IDL.Func([UserId, IDL.Text], [IDL.Bool], []),
    'update_campaign' : IDL.Func(
        [IDL.Text, InputFeaturedCampaign, IDL.Text],
        [Result_3],
        [],
      ),
    'update_category' : IDL.Func(
        [InputCategory, CategoryId, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'update_count_category' : IDL.Func([CategoryId, IDL.Text], [Result], []),
    'update_like_reward' : IDL.Func([IDL.Text, LikeReward], [LikeReward], []),
    'update_reward' : IDL.Func([IDL.Text, RewardConfig], [RewardConfig], []),
    'user_count' : IDL.Func([], [EntryCount], ['query']),
    'validateQuiz' : IDL.Func(
        [IDL.Text, IDL.Int, IDL.Vec(QuestionAnswer), IDL.Text],
        [Result_1],
        [],
      ),
    'verifyWeb3' : IDL.Func([Key, IDL.Text, IDL.Text, IDL.Bool], [Result], []),
    'web_list' : IDL.Func([], [Web3Count], ['query']),
  });
  return anon_class_25_1;
};
export const init = ({ IDL }) => { return []; };
