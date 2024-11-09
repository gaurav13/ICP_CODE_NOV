import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import ImageType "../model/ImageType";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Float "mo:base/Float";
import Int16 "mo:base/Int16";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Order "mo:base/Order";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import EntryType "../model/EntryType";
import Prim "mo:prim";
import EntryStoreHelper "../helper/EntryStoreHelper";
import Web3StoreHelper "../helper/web3StoreHelper";

import UserType "../model/UserType";

shared ({ caller = initializer }) actor class () {

type Title = Text;
type Key = Text;
type Entry = EntryType.Entry;
type UserId = EntryType.UserId;
type InputEntry = EntryType.InputEntry;
type EntryId = EntryType.EntryId;
type Web3Id = Text;
type EntryStatus = EntryType.EntryStatus;
type ListEntryItem = EntryType.ListEntryItem;
type ListPodcastItem = EntryType.ListPodcastItem;
type Entries = [(Key, Entry)];
type Permission = UserType.Permission;
type User = UserType.User;
type ActivityType = UserType.ActivityType;
type AdminActivityType = UserType.AdminActivityType;
type RewardConfig = { master : Nat; admin : Nat; platform : Nat };
type LikeReward = Nat;
type Web3 = EntryType.Web3;
type InputWeb3 = EntryType.InputWeb3;
type Web3List = EntryType.Web3List;
type TrendingEntryItemSidebar = EntryType.TrendingEntryItemSidebar;

type Web3DashboardList = EntryType.Web3DashboardList;
type Web3Status = EntryType.Web3Status;

type ImageObject = ImageType.ImageObject;
type NewImageObject = ImageType.NewImageObject;
type SubAccount = UserType.SubAccount;
type Icrc1Timestamp = UserType.Icrc1Timestamp;
type Icrc1Tokens = UserType.Icrc1Tokens;
type Icrc1BlockIndex = UserType.Icrc1BlockIndex;

type Account = UserType.Account;
type TransferFromArgs = UserType.TransferFromArgs;
type TransferFromResult = UserType.TransferFromResult;

type TransferFromError = UserType.TransferFromError;
type CategoryId = EntryType.CategoryId;
type Category = EntryType.Category;
type ListCategory = EntryType.ListCategory;
type TopWeb3Category = EntryType.TopWeb3Category;

type NestedCategory = EntryType.NestedCategory;
type InputCategory = EntryType.InputCategory;
type Categories = [(CategoryId, Category)];
type NestedCategories = [(CategoryId, NestedCategory)];
type ListCategories = [(CategoryId, ListCategory)];
type TopWeb3Categories = [(CategoryId, TopWeb3Category)];

type EventId = EntryType.EventId;
type Event = EntryType.Event;
type Events = EntryType.Events;
type EventCount = EntryType.EventCount;
type QuizCount = EntryType.QuizCount;
type SurveyCount = EntryType.SurveyCount;
type InputEvent = EntryType.InputEvent;
type EntryMetadata = EntryType.EntryMetadata;
type EventMetadata = EntryType.EventMetadata;
type Web3MetaData = EntryType.Web3MetaData;
type EntryCount = EntryType.EntryCount;
type PromotedArticles = EntryType.PromotedArticles;
type Web3Count = EntryType.Web3Count;
type EventStatus = EntryType.EventStatus;
// ===== quiz =====
type Quiz = EntryType.Quiz;
type ReturnQuizWithTitle = EntryType.ReturnQuizWithTitle;
type Question = EntryType.Question;
type InputQuiz = EntryType.InputQuiz;
type InputQuestion = EntryType.InputQuestion;
type QuestionAnswer = EntryType.QuestionAnswer;
type TakenBy = EntryType.TakenBy;
type TakenByWithTitle = EntryType.TakenByWithTitle;
type ServayTakenByList = EntryType.ServayTakenByList;
type QuizForUser = EntryType.QuizForUser;
type ServayForUser = EntryType.ServayForUser;



// ===== servay =====
type InputServay = EntryType.InputServay;
type Servay = EntryType.Servay;
type ServaywithTitle = EntryType.ServaywithTitle;
type InputServayQuestion = EntryType.InputServayQuestion;
type ServayQuestion = EntryType.ServayQuestion;
type ServayTakenBy = EntryType.ServayTakenBy;
type ServayQuestionTakenBy = EntryType.ServayQuestionTakenBy;
type UserServayResponse = EntryType.UserServayResponse;
type AnalysedData = EntryType.AnalysedData;
// ======= featured campaing =======

type FeaturedCampaign = EntryType.FeaturedCampaign;
type FeaturedCampaignItem = EntryType.FeaturedCampaignItem;

type InputFeaturedCampaign = EntryType.InputFeaturedCampaign;
// transection
type TransectionTypes = EntryType.TransectionTypes;
type InputTransectionTypes = EntryType.InputTransectionTypes;
type TransactionHistoryOfServayAndQuiz = EntryType.TransactionHistoryOfServayAndQuiz;
type TransactionHistoryItem = {
  user : Principal;
  platform : Nat;
  admin : Nat;
  creation_time : Int;
};
type EntriesModificationDate = EntryType.EntriesModificationDate;
type SlugWithData = EntryType.SlugWithData;

type TransactionHistory = List.List<TransactionHistoryItem>;

var MAX_TRANSACTIONS = 10;
let MASTER_WALLET = UserType.MASTER_WALLET;
let PLATFORM_WALLET = UserType.PLATFORM_WALLET;
let ADMIN_WALLET = UserType.ADMIN_WALLET;
let MASTER_Token_WALLET = UserType.MASTER_WALLET;
let TOKEN_CANISTER_ID = UserType.TOKEN_CANISTER_ID;

private let MAX_CATEGORY_NAME_CHARS = 100;
private let MAX_CATEGORY_DESCRIPTION_CHARS = 3000;
private let MAX_CATEGORY_SLUG_CHARS = 100;
let MAX_TITLE_CHARS = 300;
let MAX_SHORT_DESCRIPTION_CHARS = 500;
let MAX_LOCATION_CHARS = 500;
let MAX_COUNTRY_CHARS = 300;
let MAX_CITY_CHARS = 300;
let MAX_WEBSITE_CHARS = 500;
let MAX_CATEGORY_CHARS = 400;
let MAX_TAGS_CHARS = 500;
let MAX_LINKEDIN_CHARS = 2045;
let MAX_IMAGE_CHARS = 500;
let MAX_SEO_TITLE_CHARS = 500;
let MAX_SEO_SLUG_CHARS = 300;
let MAX_SEO_DESCRIPTION_CHARS = 500;
let MAX_SEO_EXCERPT_CHARS = 500;
private let MAX_NAME_CHARS = 40;
let E8S : Nat = 100000000;
// Stable Variables
stable var stable_entries : Entries = [];
stable var stable_events : Events = [];
stable var stable_categories : [Text] = ["Web 3 Blockchain", "Crypto", "Defi", "Dao", "NFT", "Metaverse Directory", "Event", "Blockchain Game"];
stable var tstable_categories : Categories = [];
stable var stable_web3 : [(Key, Web3)] = [];
stable var stable_modification_date : [(Key, EntriesModificationDate)] = [];
stable var reward_config : RewardConfig = {
  master = 80;
  admin = 10;
  platform = 10;
};
stable var like_reward : LikeReward = 1000;
stable var transaction_history : TransactionHistory = List.nil();
stable var quiz_transaction_history : TransactionHistory = List.nil();
// modification date of web3,article and podcast
var entryModificationStorage = Map.fromIter<Key, EntriesModificationDate>(stable_modification_date.vals(), 0, Text.equal, Text.hash);

// Data Structures

var categoryStorage = Map.fromIter<CategoryId, Category>(tstable_categories.vals(), 0, Text.equal, Text.hash);
var eventStorage = Map.fromIter<EventId, Event>(stable_events.vals(), 0, Text.equal, Text.hash);

var entryStorage = Map.fromIter<Key, Entry>(stable_entries.vals(), 0, Text.equal, Text.hash);
var web3Storage = Map.fromIter<Key, Web3>(stable_web3.vals(), 0, Text.equal, Text.hash);
// == quiz storage ===
stable var stableQuiz : [(Text, Quiz)] = [];

stable var stableQuestions : [(Text, [Question])] = [];
var quizStorage = Map.fromIter<Text, Quiz>(stableQuiz.vals(), 0, Text.equal, Text.hash);
var qustionsStorage = Map.fromIter<Text, [Question]>(stableQuestions.vals(), 0, Text.equal, Text.hash);
// ===== servay =====
stable var stableServay : [(Text, Servay)] = [];
stable var stableServayQuestions : [(Text, [ServayQuestion])] = [];

var servayStorage = Map.fromIter<Text, Servay>(stableServay.vals(), 0, Text.equal, Text.hash);
var servayQustionsStorage = Map.fromIter<Text, [ServayQuestion]>(stableServayQuestions.vals(), 0, Text.equal, Text.hash);
// ===== featured campaign =====

stable var stableFeaturedCampaign : [(Text, FeaturedCampaign)] = [];
var featuredCampaignStorage = Map.fromIter<Text, FeaturedCampaign>(stableFeaturedCampaign.vals(), 0, Text.equal, Text.hash);

// transection record
stable var stable_quiz_and_survey_record : [(Key, TransactionHistoryOfServayAndQuiz)] = [];

var quizAndSurveyTransectionsStorage = Map.fromIter<Key, TransactionHistoryOfServayAndQuiz>(stable_quiz_and_survey_record.vals(), 0, Text.equal, Text.hash);

private var sectek = "#cosa@erwe0ss1s<e}s*dfCc<e>c!dwa)<vvde>";
// var entryStorage = Map.HashMap<Key, Entry>(0, Text.equal, Text.hash);
// entries count(podcast , articles , pressrelease)
func getCurrentDate() : Int {
  return Time.now() / 1_000_000;
};
func getModificationdate(key : Key, currentDate : Int) : Int {
  let isModDate = entryModificationStorage.get(key);
  switch (isModDate) {
    case (?isModDate) {
      return isModDate.modification_date;
    };
    case (null) {
      return currentDate;
    };
  };
};
public query ({ caller }) func user_count() : async EntryCount {
  let totalEntries = Iter.toArray(entryStorage.entries()).size();
  var totalpodcasts = 0;
  var totalarticles = 0;
  var totalpressrelease = 0;
  var drafts = 0;
  var pendings = 0;
  var rejected = 0;
  var approved = 0;
  var articlespendings = 0;
  var articlesapproved = 0;
  var articlesrejected = 0;
  var articlesdrafts = 0;
  var podcastpendings = 0;
  var podcastapproved = 0;
  var podcastrejected = 0;
  var podcastdrafts = 0;
  var pressreleasependings = 0;
  var pressreleaseapproved = 0;
  var pressreleaserejected = 0;
  var pressreleasedrafts = 0;
  // for ((id, user) in entryStorage.entries()) {

  //     if (user.isDraft) {
  //       drafts += 1;
  //     };
  //     if (user.pressRelease and not user.isPodcast) {
  //       totalpressrelease += 1;
  //     }
  //     else if (user.isPodcast and not user.pressRelease) {
  //       totalpodcasts += 1;
  //     }
  //     else {
  //       totalarticles += 1;
  //     };
  // };
  for ((id, entry) in entryStorage.entries()) {

    if (entry.pressRelease and not entry.isPodcast) {
      totalpressrelease += 1;
    } else if (entry.isPodcast and not entry.pressRelease) {
      totalpodcasts += 1;
    } else {
      totalarticles += 1;
    };
    switch (entry.status) {
      case (#approved) {
        approved += 1

      };
      case (#rejected) {
        rejected += 1;
      };
      case (#pending) {
        if (entry.isDraft) {
          drafts += 1;
        } else {

          pendings += 1;
        };
      };

    };

    // ============ //

    if (not entry.isPodcast and not entry.pressRelease) {

      switch (entry.status) {
        case (#approved) {
          articlesapproved += 1;

        };
        case (#rejected) {
          articlesrejected += 1;

        };
        case (#pending) {
          if (entry.isDraft) {
            articlesdrafts += 1;
          } else {

            articlespendings += 1;
          };

        };
      };
    };

    // =========== //

    if (entry.pressRelease) {

      switch (entry.status) {
        case (#approved) {
          pressreleaseapproved += 1;

        };
        case (#rejected) {
          pressreleaserejected += 1;

        };
        case (#pending) {
          if (entry.isDraft) {
            pressreleasedrafts += 1;
          } else {

            pressreleasependings += 1;
          };

        };
      };
    };

    // =================== //

    if (entry.isPodcast) {

      switch (entry.status) {
        case (#approved) {
          podcastapproved += 1;

        };
        case (#rejected) {
          podcastrejected += 1;

        };
        case (#pending) {
          if (entry.isDraft) {
            podcastdrafts += 1;
          } else {

            podcastpendings += 1;
          };

        };
      };
    };

  };
  return {
    totalEntries = totalEntries;
    pendings = pendings;
    approved = approved;
    rejected = rejected;
    drafts = drafts;
    articlespendings = articlespendings;
    articlesapproved = articlesapproved;
    articlesrejected = articlesrejected;
    totalarticles = totalarticles;
    articlesdrafts = articlesdrafts;
    podcastpendings = podcastpendings;
    podcastapproved = podcastapproved;
    podcastrejected = podcastrejected;
    totalpodcasts = totalpodcasts;
    podcastdrafts = podcastdrafts;
    pressreleasependings = pressreleasependings;
    pressreleaseapproved = pressreleaseapproved;
    pressreleaserejected = pressreleaserejected;
    totalpressrelease = totalpressrelease;
    pressreleasedrafts = pressreleasedrafts

  };
  // return (drafts ,pendings , approved , rejected) ;
};

// total web3 count

public query ({ caller }) func web_list() : async Web3Count {
  let total_web = Iter.toArray(web3Storage.entries()).size();
  var un_verified = 0;
  var verified = 0;
  for ((id, web) in web3Storage.entries()) {
    switch (web.status) {
      case (#un_verfied) {
        un_verified += 1;
      };
      case (#verfied) {
        verified += 1;
      };
    };
  };
  return {
    verified = verified;
    un_verified = un_verified;
    total_web = total_web;
  };
};

public query ({ caller }) func survey_list() : async SurveyCount {
  var all = Iter.toArray(servayStorage.entries()).size();
  var not_active = 0;
  var active = 0;
  for ((id, survey) in servayStorage.entries()) {
    if (survey.isAtive) {
      active += 1;
    };
    if (not survey.isAtive) {
      not_active += 1;
    };
  };
  return {
    all = all;
    active = active;
    not_active = not_active;
  };
};
// tota no of quiz

public query ({ caller }) func quiz_list() : async QuizCount {
  var not_active = 0;
  var active = 0;
  var all = Iter.toArray(quizStorage.entries()).size();
  for ((id, quiz) in quizStorage.entries()) {
    if (quiz.isAtive) {
      active += 1;
    };
    if (not quiz.isAtive) {
      not_active += 1;
    };
  };
  return {
    all = all;
    active = active;
    not_active = not_active;
  };
};

// no of events total

public query ({ caller }) func total_events() : async Int {
  let total_count = Iter.toArray(eventStorage.entries()).size();
  for ((id, totalevents) in eventStorage.entries()) {

  };
  return total_count;
};
// no of promted articles

public query func promotedarticles_count() : async PromotedArticles {
  // let totalEntries = Iter.toArray(entryStorage.entries()).size();
  var totalEntries = 0;
  var promotionIcp = 0;

  for ((id, entry) in entryStorage.entries()) {
    if (entry.isPromoted and entry.promotionICP > 0) {
      totalEntries += 1;
      promotionIcp += entry.promotionICP;
    };

  };
  return {
    totalEntries = totalEntries;
    promotionIcp = promotionIcp;
  };

};

public query ({ caller }) func event_types() : async EventCount {
  var upcoming = 0;
  var pasts = 0;
  var ongoing = 0;
  let all = Iter.toArray(eventStorage.entries()).size();
  let currentDate = getCurrentDate();
  let currentTime = currentDate;
  for ((id, data) in eventStorage.entries()) {

    if (data.date <= currentTime and data.endDate >= currentTime) {
      ongoing += 1;
    };
    if (data.date >= currentTime) {
      upcoming += 1;
    };
    if (data.endDate <= currentTime) {
      pasts += 1;
    };

  };
  return {
    upcoming = upcoming;
    ongoing = ongoing;
    pasts = pasts;
    all = all;
  };

};

func sortByCategory(inputCategory : Text, entriesList : Map.HashMap<Key, ListEntryItem>, key : Text, lisEntryItem : ListEntryItem, entry : Entry) : Map.HashMap<Key, ListEntryItem> {
  if (inputCategory == "All") {
    entriesList.put(key, lisEntryItem);
  } else {
    let tempCategories = entry.category;
    for (category in tempCategories.vals()) {
      if (category == inputCategory) {
        entriesList.put(key, lisEntryItem);
      };
    };
  };
  return entriesList;
};
func shouldSendEntry(entry : Entry) : Bool {
  if (not entry.isDraft and not entry.isPodcast) {
    switch (entry.status) {
      case (#approved) {
        // sortedEntries.put(key, entry);

        return true;
      };
      case (_) {
        return false;
      };
    };
  } else {
    return false;
  };
};
// it will send also podcast
func shouldSendAllEntry(entry : Entry) : Bool {
  if (not entry.isDraft) {
    switch (entry.status) {
      case (#approved) {
        // sortedEntries.put(key, entry);

        return true;
      };
      case (_) {
        return false;
      };
    };
  } else {
    return false;
  };
};
func shouldSendContent(entry : Entry) : Bool {
  if (not entry.isDraft) {
    switch (entry.status) {
      case (#approved) {
        // sortedEntries.put(key, entry);

        return true;
      };
      case (_) {
        return false;
      };
    };
  } else {
    return false;
  };
};
func shouldSendListEntry(status : EntryStatus) : Bool {
  switch (status) {
    case (#approved) {
      return true;
    };
    case (_) {
      return false;
    };
  };

};
func idsToCategoriest(childArray : [CategoryId]) : ListCategories {
  var nestedCategoriesMap = Map.HashMap<CategoryId, ListCategory>(0, Text.equal, Text.hash);
  for (id in childArray.vals()) {
    let isChildCategory = categoryStorage.get(id);
    switch (isChildCategory) {
      case (?childCategory) {
        // var nestedCategories : ?NestedCategories = ?[];
        var hasMore = false;

        let newChild : ListCategory = {
          name = childCategory.name;
          slug = childCategory.slug;
          description = childCategory.description;
          creation_time = childCategory.creation_time;
          user = childCategory.user;
          parentCategoryId = childCategory.parentCategoryId;
          children = childCategory.children;
          isChild = childCategory.isChild;
          articleCount = childCategory.articleCount;
          podcastCount = childCategory.podcastCount;
          eventsCount = childCategory.eventsCount;
          directoryCount = childCategory.directoryCount;
          pressReleaseCount = childCategory.pressReleaseCount;
          totalCount = childCategory.totalCount;
          logo = childCategory.logo;
        };
        nestedCategoriesMap.put(id, newChild);

      };
      case (null) {

      };
    };
  };
  return Iter.toArray(nestedCategoriesMap.entries());
};
func getCategoriesChildren(categories : Categories) : NestedCategories {
  var nestedCategories = Map.HashMap<CategoryId, NestedCategory>(0, Text.equal, Text.hash);

  for ((id, category) in categories.vals()) {
    switch (category.children) {
      case (?children) {
        let childCategories = idsToCategoriest(children);

      };
      case (null) {

      };
    };
  };
  let nestedArray = Iter.toArray(nestedCategories.entries());
  return nestedArray;
};
public query ({ caller }) func isEntryPodcast(key : Key) : async Result.Result<({ isPodcast : Bool; isStatic : Bool }), (Null)> {
  let isEntry = entryStorage.get(key);
  switch (isEntry) {
    case (null) {
      return #err(null);
    };
    case (?entry) {
      if (entry.isDraft) {
        return #err(null);

      } else {
        return #ok({ isPodcast = entry.isPodcast; isStatic = entry.isStatic });

      };

    };

  };
};
public shared ({ caller }) func insertEntry(entry : InputEntry, userCanisterId : Text, isDraftUpdate : Bool, draftId : Text, commentCanisterId : Text) : async Result.Result<(Text, EntryId), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    check_user_exists : (caller : Principal) -> async Bool;
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    get_NFT24Coin : () -> async Nat;
  };

  let isUser = await userCanister.check_user_exists(caller);
  assert isUser;
  let commentCanister = actor (commentCanisterId) : actor {
    addActivity : (user : Principal, target : Text, activityType : ActivityType, title : Text) -> async Bool;
  };
  let LEDGER = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor {
    icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
  };

  if (isDraftUpdate) {
    let maybeOldEntry = entryStorage.get(draftId);
    let isAdminUpdating = await userCanister.entry_require_permission(caller, #manage_article);

    switch (maybeOldEntry) {
      case (?oldEntry) {

        if (oldEntry.user != caller and not isAdminUpdating) {
          return #err("Error while saving draft");
        };
      };
      case (null) {
        return #err("Error while saving draft");
      };
    };
  };
  if (entry.isPromoted and entry.pressRelease) {
    return #err("Not Allowed");
  };
  if (entry.isPromoted) {
    if (List.size(transaction_history) >= MAX_TRANSACTIONS) {
      var totalPlatformFee = 0;
      var totalAdminFee = 0;
      func iterVals(item : TransactionHistoryItem) : Bool {
        totalPlatformFee := totalPlatformFee + item.platform;
        totalAdminFee := totalAdminFee + item.admin;
        return false;
      };
      let newHistory = List.filter<TransactionHistoryItem>(transaction_history, iterVals);
      transaction_history := List.nil();
      let platformRes = await LEDGER.icrc2_transfer_from({
        amount = totalPlatformFee;
        created_at_time = null;
        fee = null;
        from = {
          owner = Principal.fromText(MASTER_WALLET);
          subaccount = null;
        };
        memo = null;
        spender_subaccount = null;
        to = {
          owner = Principal.fromText(PLATFORM_WALLET);
          subaccount = null;
        };
      });
      let adminRes = await LEDGER.icrc2_transfer_from({
        amount = totalAdminFee;
        created_at_time = null;
        fee = null;
        from = {
          owner = Principal.fromText(MASTER_WALLET);
          subaccount = null;
        };
        memo = null;
        spender_subaccount = null;
        to = {
          owner = Principal.fromText(ADMIN_WALLET);
          subaccount = null;
        };
      });
    };

    let gasFee = (10000 * 2) / MAX_TRANSACTIONS;
    let rewardToGive = entry.promotionICP + gasFee;
    let response = await LEDGER.icrc2_transfer_from({
      amount = rewardToGive;
      created_at_time = null;
      fee = null;
      from = { owner = caller; subaccount = null };
      memo = null;
      spender_subaccount = null;
      to = { owner = Principal.fromText(MASTER_WALLET); subaccount = null };
    });
    let platformPercentage : Float = Float.fromInt(reward_config.platform) / 100;
    let adminPercentage : Float = Float.fromInt(reward_config.admin) / 100;
    let platformFee = (platformPercentage * Float.fromInt(entry.promotionICP));
    let adminFee = (adminPercentage * Float.fromInt(entry.promotionICP));
    let currentDate = getCurrentDate();
    var newTransaction : TransactionHistoryItem = {
      user = caller;
      platform = Int.abs(Float.toInt(platformFee));
      admin = Int.abs(Float.toInt(adminFee));
      creation_time = currentDate;
    };
    let new_transaction_history = List.push(newTransaction, transaction_history);
    transaction_history := new_transaction_history;

    switch (response) {
      case (#Ok(_)) {

      };
      case (#Err(_)) {
        return #err("Error during transaction");
      };
    };
  };
  let entryId = EntryType.generateNewRemoteObjectId();
  let masterPercentage : Float = Float.fromInt(reward_config.master) / 100;
  let articlePool = (masterPercentage * Float.fromInt(entry.promotionICP));
  // let articlePool : Nat = Int.abs(Float.toInt(masterPercentage));
  var coinsInOneIcp = await userCanister.get_NFT24Coin();

  let modificationDate = getCurrentDate();
  if (isDraftUpdate) {
    let isEntry = entryStorage.get(draftId);
    switch (isEntry) {
      case (?isEntry) {
        var res = updateModificationDate(draftId, modificationDate, isEntry.creation_time)

      };
      case (null) {

      };
    };
  } else {
    var res = updateModificationDate(entryId, modificationDate, modificationDate)

  };
  entryStorage := EntryStoreHelper.addNewEntry(entryStorage, entry, entryId, caller, isDraftUpdate, draftId, Int.abs(Float.toInt(articlePool)), stable_categories, coinsInOneIcp);
  if (not entry.isDraft) {
    if (isDraftUpdate) {
      if (entry.isPodcast) {
        let activited = commentCanister.addActivity(caller, draftId, #create_podcats, entry.title);

      } else if (entry.pressRelease) {
        let activited = commentCanister.addActivity(caller, draftId, #create_pressRelease, entry.title);

      } else {
        let activited = commentCanister.addActivity(caller, draftId, #create, entry.title);

      };
    } else {
      if (entry.isPodcast) {
        let activited = commentCanister.addActivity(caller, entryId, #create_podcats, entry.title);

      } else if (entry.pressRelease) {
        let activited = commentCanister.addActivity(caller, entryId, #create_pressRelease, entry.title);

      } else {
        if (entry.isPromoted) {
          let activited = commentCanister.addActivity(caller, entryId, #promote, entry.title);

        } else {
          let activited = commentCanister.addActivity(caller, entryId, #create, entry.title);

        };

      };

    };
  };
  if (isDraftUpdate) {
    return #ok("Published", draftId);
  } else {
    return #ok("Published", entryId);
  };
};
public shared ({ caller }) func updateEntry(tempEntry : Entry, key : Text) : async Bool {
  let newEntry = entryStorage.replace(key, tempEntry);
  return true;
};
public shared ({ caller }) func updateUserEntries(userId : UserId, userName : Text) : async Bool {
  assert not Principal.isAnonymous(caller);

  for ((key, entry) in entryStorage.entries()) {
    if (entry.user == userId) {
      //  Debug.print(debug_show (entry,userId,userName,"entry is here"));
      let tempEntry : Entry = {
        title = entry.title;
        description = entry.description;
        image = entry.image;
        creation_time = entry.creation_time;
        user = entry.user;
        views = entry.views;
        likes = entry.likes;
        category = entry.category;
        seoTitle = entry.seoTitle;
        seoSlug = entry.seoSlug;
        viewedUsers = entry.viewedUsers;
        likedUsers = entry.viewedUsers;
        seoDescription = entry.seoDescription;
        seoExcerpt = entry.seoExcerpt;
        subscription = entry.subscription;
        isDraft = entry.isDraft;
        isPromoted = entry.isPromoted;
        promotionICP = entry.promotionICP;
        minters = entry.minters;
        userName = userName;
        status = entry.status;
        promotionHistory = entry.promotionHistory;
        pressRelease = entry.pressRelease;
        caption = entry.caption;
        tags = entry.tags;
        isCompanySelected = entry.isCompanySelected;
        companyId = entry.companyId;
        isPodcast = entry.isPodcast;
        podcastVideoLink = entry.podcastVideoLink;
        podcastImgCation = entry.podcastImgCation;
        isStatic = entry.isStatic;
        podcastImg = entry.podcastImg;
      };
      let isok = entryStorage.replace(key, tempEntry);

    };

  };

  return true;

};

public query ({ caller }) func getEntry(key : Key) : async ?Entry {
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
        let date=getModificationdate(key,isEntry.creation_time);

      if (isEntry.status == #approved) {
        return ?{isEntry with creation_time=date};
      } else {
        if (isEntry.user == caller) {
          return ?{isEntry with creation_time=date};
        } else {
          return null;
        };
      };
    };
    case (null) {
      return null;
    };
  };
};
func getEntryTitle(key : Key) : Text {
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
      return isEntry.title;
    };
    case (null) {
      return "";
    };
  };
};
public query ({ caller }) func getEntry_admin(key : Key) : async ?Entry {

  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    
    case (?isEntry) {
       let date=getModificationdate(key,isEntry.creation_time);
      return ?{isEntry with creation_time=date};
    };
    case (null) {
      return null;
    };
  };
};
func getCategoryNameById(id : Text) : Text {
  let cat = categoryStorage.get(id);
  switch (cat) {
    case (?isCate) {
      return isCate.name;

    };
    case (null) {
      return "No category";
    };
  };
};
func getDirectoryNameById(id : Text) : Text {
  let directory = web3Storage.get(id);
  switch (directory) {
    case (?isDirectory) {
      return isDirectory.company;

    };
    case (null) {
      return "No organiser";
    };
  };
};
public query ({ caller }) func getEntryMeta(key : Key) : async EntryMetadata {
  let maybeEntry = entryStorage.get(key);
  let currentDate = getCurrentDate();
  switch (maybeEntry) {
    case (?isEntry) {
      let getCategoryName = getCategoryNameById(isEntry.category[0]);
      var tempDate = isEntry.creation_time;
      let isModDate = entryModificationStorage.get(key);
      switch (isModDate) {
        case (?isModDate) {
          tempDate := isModDate.modification_date;
        };
        case (null) {

        };
      };
      return {
        title = isEntry.title;
        caption = isEntry.caption;
        seoTitle = isEntry.seoTitle;
        companyId = isEntry.companyId;
        creation_time = isEntry.creation_time;
        dateModified = tempDate;
        isCompanySelected = isEntry.isCompanySelected;
        isPodcast = isEntry.isPodcast;
        podcastVideoLink = isEntry.podcastVideoLink;
        podcastImgCation = isEntry.podcastImgCation;
        podcastImg = isEntry.podcastImg;
        isPromoted = isEntry.isPromoted;
        pressRelease = isEntry.pressRelease;
        tags = isEntry.tags;
        seoExcerpt = isEntry.seoExcerpt;
        status = isEntry.status;
        user = isEntry.user;
        userName = isEntry.userName;
        seoSlug = isEntry.seoSlug;
        seoDescription = isEntry.seoDescription;
        image = isEntry.image;
        category = [getCategoryName];
        description = isEntry.description;
        categoryIds = isEntry.category
      };
    };
    case (null) {
      return {
        title = "Default field";
        caption = "Default field";
        seoTitle = "Default field";
        companyId = "Default field";
        creation_time = currentDate;
        dateModified = currentDate;
        isCompanySelected = false;
        isPodcast = false;
        podcastVideoLink = "Default field";
        podcastImgCation = "Default field";
        podcastImg = ?"Default field";
        isPromoted = false;
        pressRelease = false;
        tags = ["Default field"];
        seoExcerpt = "Default field";
        status = #pending;
        user = caller;
        userName = "Default field";
        seoSlug = "Default field";
        seoDescription = "Default field";
        image = ?"Default field";
        category = ["Default field"];
        description = "Default field";
        categoryIds = ["no category"]
      };
    };
  };
};
public query ({ caller }) func getEventMeta(key : Key) : async EventMetadata {
  let maybeEntry = eventStorage.get(key);
  let currentDate = getCurrentDate();
  switch (maybeEntry) {
    case (?isEntry) {
      let getCategoryName = getCategoryNameById(isEntry.category[0]);
      let directoryName = getDirectoryNameById(isEntry.organiser);

      var tempDate = isEntry.creation_time;
      let isModDate = entryModificationStorage.get(key);
      switch (isModDate) {
        case (?isModDate) {
          tempDate := isModDate.modification_date;
        };
        case (null) {

        };
      };
      return {
        title = isEntry.title;
        shortDescription = isEntry.shortDescription;
        date = isEntry.date;
        endDate = isEntry.endDate;
        location = isEntry.location;
        country = isEntry.country;
        city = isEntry.city;
        website = isEntry.website;
        category = [getCategoryName];
        tags = isEntry.tags;
        organiser = directoryName;
        image = isEntry.image;
        creation_time = isEntry.creation_time;
        month = isEntry.month;
        user = isEntry.user;
        seoTitle = isEntry.seoTitle;
        seoSlug = isEntry.seoSlug;
        seoDescription = isEntry.seoDescription;
        seoExcerpt = isEntry.seoExcerpt;
        description = isEntry.description;
        freeTicket = isEntry.freeTicket;
        applyTicket = isEntry.applyTicket;
        dateModified = tempDate;
        categoryIds = isEntry.category;
      };
    };
    case (null) {
      return {

        title = "Default field";
        shortDescription = "Default field";
        date = currentDate;
        endDate = currentDate;
        location = "Default location";
        country = "Default country";
        city = "Default city";
        website = "Default website";
        category = ["Default field"];
        tags = ["Default field"];
        organiser = "Default field";
        image = "Default field";
        creation_time = currentDate;
        dateModified = currentDate;
        month = 2;
        user = caller;
        seoTitle = "Default field";
        seoSlug = "Default field";
        seoDescription = "Default field";
        seoExcerpt = "Default field";
        description = "description";
        freeTicket = "freeTicket";
        applyTicket = "applyTicket";
        categoryIds = ["no category"]
      };
    };
  };
};
public shared ({ caller }) func makeStatic(key : Key) : async Bool {
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
      let newStatic = true;
      var tempEntry : Entry = {
        title = isEntry.title;
        description = isEntry.description;
        image = isEntry.image;
        creation_time = isEntry.creation_time;
        user = isEntry.user;
        views = isEntry.views;
        likes = isEntry.likes;
        category = isEntry.category;
        seoTitle = isEntry.seoTitle;
        seoSlug = isEntry.seoSlug;
        viewedUsers = isEntry.viewedUsers;
        likedUsers = isEntry.likedUsers;
        seoDescription = isEntry.seoDescription;
        seoExcerpt = isEntry.seoExcerpt;
        subscription = isEntry.subscription;
        isDraft = isEntry.isDraft;
        isPromoted = isEntry.isPromoted;
        minters = isEntry.minters;
        userName = isEntry.userName;
        promotionICP = isEntry.promotionICP;
        status = isEntry.status;
        promotionHistory = isEntry.promotionHistory;
        pressRelease = isEntry.pressRelease;
        caption = isEntry.caption;
        tags = isEntry.tags;
        isCompanySelected = isEntry.isCompanySelected;
        companyId = isEntry.companyId;
        isPodcast = isEntry.isPodcast;
        podcastVideoLink = isEntry.podcastVideoLink;
        podcastImgCation = isEntry.podcastImgCation;
        podcastImg = isEntry.podcastImg;
        isStatic = newStatic;
      };
      let old = entryStorage.replace(key, tempEntry);
      return true;
    };
    case (null) {
      return false;
    };
  };
};
public shared ({ caller }) func makeStaticEvent(key : Key) : async Bool {
  let maybeEntry = eventStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
      let newStatic = true;
      var tempEntry : Event = {
        title = isEntry.title;
        shortDescription = isEntry.shortDescription;
        description = isEntry.description;
        date = isEntry.date;
        endDate = isEntry.endDate;
        location = isEntry.location;
        country = isEntry.country;
        city = isEntry.city;
        website = isEntry.website;
        category = isEntry.category;
        tags = isEntry.tags;
        linkdin = isEntry.linkdin;
        image = isEntry.image;
        creation_time = isEntry.creation_time;
        user = isEntry.user;
        seoTitle = isEntry.seoTitle;
        seoSlug = isEntry.seoSlug;
        seoDescription = isEntry.seoDescription;
        seoExcerpt = isEntry.seoExcerpt;
        month = isEntry.month;
        facebook = isEntry.facebook;
        telegram = isEntry.telegram;
        instagram = isEntry.instagram;
        twitter = isEntry.twitter;
        organiser = isEntry.organiser;
        freeTicket = isEntry.freeTicket;
        applyTicket = isEntry.applyTicket;
        lat = isEntry.lat;
        lng = isEntry.lng;
        isStatic = newStatic;
        discountTicket = isEntry.discountTicket;

      };
      let old = eventStorage.replace(key, tempEntry);
      return true;
    };
    case (null) {
      return false;
    };
  };
};
public query ({ caller }) func getWeb3Meta(key : Key) : async Web3MetaData {
  let maybeEntry = web3Storage.get(key);
  let currentDate = getCurrentDate();
  switch (maybeEntry) {
    case (?isWeb3) {
      var tempDate = isWeb3.creation_time;
      let isModDate = entryModificationStorage.get(key);
      switch (isModDate) {
        case (?isModDate) {
          tempDate := isModDate.modification_date;
        };
        case (null) {

        };
      };

      let getCategoryName = getCategoryNameById(isWeb3.catagory);
      return {
        company = isWeb3.company;
        shortDescription = isWeb3.shortDescription;
        companyUrl = isWeb3.companyUrl;
        facebook = isWeb3.facebook;
        instagram = isWeb3.instagram;
        linkedin = isWeb3.linkedin;
        discord = isWeb3.discord;
        telegram = isWeb3.telegram;
        twitter = isWeb3.twitter;
        founderName = isWeb3.founderName;
        companyBanner = isWeb3.companyBanner;
        catagory = getCategoryName;
        founderDetail = isWeb3.founderDetail;
        founderImage = isWeb3.founderImage;
        companyDetail = isWeb3.companyDetail;
        creation_time = isWeb3.creation_time;
        dateModified = tempDate;
        user = isWeb3.user;
        status = isWeb3.status;
        companyLogo = isWeb3.companyLogo;
        categoryId = isWeb3.catagory
      };
    };
    case (null) {
      return {
        company = "company";
        shortDescription = "shortDescription";
        companyUrl = ?"companyUrl";
        facebook = ?"facebook";
        instagram = ?"instagram";
        linkedin = ?"linkedin";
        discord = ?"discord";
        telegram = ?"telegram";
        twitter = ?"twitter";
        founderName = "founderName";
        companyBanner = "companyBanner";
        catagory = "catagory";
        founderDetail = "founderDetail";
        founderImage = "founderImage";
        companyDetail = "companyDetail";
        creation_time = currentDate;
        dateModified = currentDate;
        user = caller;
        status = #un_verfied;
        companyLogo = "companyLogo";
        categoryId = "no category"
      };
    };
  };
};
/**

function for get creation_time, modification_date,key

@param null
@returns {
       creation_time : Int;
     modification_date : Int;
     key : Text;
  }; object.
*/
public query func getAllWeb3Ids() : async [SlugWithData] {
  var filteredKeys : [SlugWithData] = [];
  for (key in web3Storage.keys()) {
    let entry = web3Storage.get(key);
    switch (entry) {
      case (null) {
        // Handle null case if needed
      };
      case (?entryValue) {
        switch (entryValue.status) {
          case (#verfied) {

            let isModDate = entryModificationStorage.get(key);
            switch (isModDate) {
              case (?isModDate) {
                let data : SlugWithData = {
                  key = key;
                  creation_time = isModDate.creation_time;
                  modification_date = isModDate.modification_date;

                };
                filteredKeys := Array.append(filteredKeys, [data]);

              };
              case (null) {
                let data : SlugWithData = {
                  key = key;
                  creation_time = entryValue.creation_time;
                  modification_date = entryValue.creation_time;

                };
                filteredKeys := Array.append(filteredKeys, [data]);

              };
            };

          };
          case (_) {

          };
        };

      };
    };
  };
  return filteredKeys;

};
public shared ({ caller }) func makeStaticWeb3(key : Key) : async Bool {
  let maybeEntry = web3Storage.get(key);
  switch (maybeEntry) {
    case (?web3) {

      let tempWeb3 : Web3 = {
        company = web3.company;
        shortDescription = web3.shortDescription;
        founderName = web3.founderName;
        founderDetail = web3.founderDetail;
        founderImage = web3.founderImage;
        companyBanner = web3.companyBanner;
        catagory = web3.catagory;
        creation_time = web3.creation_time;
        user = web3.user;
        status = web3.status;
        likes = web3.likes;
        likedUsers = web3.likedUsers;
        companyUrl = web3.companyUrl;
        facebook = web3.facebook;
        instagram = web3.instagram;
        linkedin = web3.linkedin;
        companyDetail = web3.companyDetail;
        companyLogo = web3.companyLogo;
        discord = web3.discord;
        telegram = web3.telegram;
        twitter = web3.twitter;
        views = web3.views;
        articleCount = web3.articleCount;
        podcastCount = web3.podcastCount;
        pressReleaseCount = web3.pressReleaseCount;
        totalCount = web3.totalCount;
        isStatic = true;
        founderEmail = web3.founderEmail;

      };
      let newEntry = web3Storage.replace(key, tempWeb3);
      return true;
    };
    case (null) {
      return false;
    };
  };
};
public shared ({ caller }) func addView(key : Key) : async Bool {
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
      if (isEntry.status != #approved) return false;

      let newViews = isEntry.views + 1;

      var tempEntry : Entry = {
        title = isEntry.title;
        description = isEntry.description;
        image = isEntry.image;
        creation_time = isEntry.creation_time;
        user = isEntry.user;
        views = newViews;
        likes = isEntry.likes;
        category = isEntry.category;
        seoTitle = isEntry.seoTitle;
        seoSlug = isEntry.seoSlug;
        viewedUsers = isEntry.viewedUsers;
        likedUsers = isEntry.likedUsers;
        seoDescription = isEntry.seoDescription;
        seoExcerpt = isEntry.seoExcerpt;
        subscription = isEntry.subscription;
        isDraft = isEntry.isDraft;
        isPromoted = isEntry.isPromoted;
        minters = isEntry.minters;
        userName = isEntry.userName;
        promotionICP = isEntry.promotionICP;
        status = isEntry.status;
        promotionHistory = isEntry.promotionHistory;
        pressRelease = isEntry.pressRelease;
        caption = isEntry.caption;
        tags = isEntry.tags;
        isCompanySelected = isEntry.isCompanySelected;
        companyId = isEntry.companyId;
        isPodcast = isEntry.isPodcast;
        podcastVideoLink = isEntry.podcastVideoLink;
        podcastImgCation = isEntry.podcastImgCation;
        podcastImg = isEntry.podcastImg;
        isStatic = isEntry.isStatic;

      };
      let newEntry = entryStorage.replace(key, tempEntry);
      return true;

    };

    case (null) {
      return false;
    };
  };
};
public shared ({ caller }) func addWeb3View(key : Key) : async Bool {
  let maybeEntry = web3Storage.get(key);
  switch (maybeEntry) {
    case (?web3) {
      var tempviews = web3.views +1;
      let tempWeb3 : Web3 = {
        company = web3.company;
        shortDescription = web3.shortDescription;
        founderName = web3.founderName;
        founderDetail = web3.founderDetail;
        founderImage = web3.founderImage;
        companyBanner = web3.companyBanner;
        catagory = web3.catagory;
        creation_time = web3.creation_time;
        user = web3.user;
        status = web3.status;
        likes = web3.likes;
        likedUsers = web3.likedUsers;
        companyUrl = web3.companyUrl;
        facebook = web3.facebook;
        instagram = web3.instagram;
        linkedin = web3.linkedin;
        companyDetail = web3.companyDetail;
        companyLogo = web3.companyLogo;
        discord = web3.discord;
        telegram = web3.telegram;
        twitter = web3.twitter;
        views = tempviews;
        articleCount = web3.articleCount;
        podcastCount = web3.podcastCount;
        pressReleaseCount = web3.pressReleaseCount;
        totalCount = web3.totalCount;
        isStatic = web3.isStatic;
        founderEmail = web3.founderEmail;

      };
      let newEntry = web3Storage.replace(key, tempWeb3);
      return true;
    };
    case (null) {
      return false;
    };
  };
};
public shared ({ caller }) func addWeb3postCount(key : Key, creationType : Text) : async Bool {
  let maybeEntry = web3Storage.get(key);
  switch (maybeEntry) {
    case (?web3) {

      var tempPodcastCount = web3.podcastCount;
      var temppressReleaseCount = web3.pressReleaseCount;
      var temparticleCount = web3.articleCount;
      var temptotalCount = web3.totalCount +1;
      if (creationType == "podcast") {
        tempPodcastCount += 1;
      };
      if (creationType == "pressRelease") {
        temppressReleaseCount += 1;
      };
      if (creationType == "article") {
        temparticleCount += 1;
      };
      let tempWeb3 : Web3 = {
        company = web3.company;
        shortDescription = web3.shortDescription;
        founderName = web3.founderName;
        founderDetail = web3.founderDetail;
        founderImage = web3.founderImage;
        companyBanner = web3.companyBanner;
        catagory = web3.catagory;
        creation_time = web3.creation_time;
        user = web3.user;
        status = web3.status;
        likes = web3.likes;
        likedUsers = web3.likedUsers;
        companyUrl = web3.companyUrl;
        facebook = web3.facebook;
        instagram = web3.instagram;
        linkedin = web3.linkedin;
        companyDetail = web3.companyDetail;
        companyLogo = web3.companyLogo;
        discord = web3.discord;
        telegram = web3.telegram;
        twitter = web3.twitter;
        views = web3.views;
        articleCount = temparticleCount;
        podcastCount = tempPodcastCount;
        pressReleaseCount = temppressReleaseCount;
        totalCount = temptotalCount;
        isStatic = web3.isStatic;
        founderEmail = web3.founderEmail;

      };
      let newEntry = web3Storage.replace(key, tempWeb3);
      return true;
    };
    case (null) {
      return false;
    };
  };
};
public shared ({ caller }) func editViews(key : Key, inputViews : Nat, userCanisterId : Text, commentCanisterId : Text) : async Bool {

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  assert not Principal.isAnonymous(caller);
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
      if (isEntry.status != #approved) return false;
      let newViews = inputViews;
      var tempEntry : Entry = {
        title = isEntry.title;
        description = isEntry.description;
        image = isEntry.image;
        creation_time = isEntry.creation_time;
        user = isEntry.user;
        views = newViews;
        likes = isEntry.likes;
        category = isEntry.category;
        seoTitle = isEntry.seoTitle;
        seoSlug = isEntry.seoSlug;
        viewedUsers = isEntry.viewedUsers;
        likedUsers = isEntry.likedUsers;
        seoDescription = isEntry.seoDescription;
        seoExcerpt = isEntry.seoExcerpt;
        subscription = isEntry.subscription;
        isDraft = isEntry.isDraft;
        isPromoted = isEntry.isPromoted;
        minters = isEntry.minters;
        userName = isEntry.userName;
        promotionICP = isEntry.promotionICP;
        status = isEntry.status;
        promotionHistory = isEntry.promotionHistory;
        pressRelease = isEntry.pressRelease;
        caption = isEntry.caption;
        tags = isEntry.tags;
        isCompanySelected = isEntry.isCompanySelected;
        companyId = isEntry.companyId;
        isPodcast = isEntry.isPodcast;
        podcastVideoLink = isEntry.podcastVideoLink;
        podcastImgCation = isEntry.podcastImgCation;
        podcastImg = isEntry.podcastImg;
        isStatic = isEntry.isStatic;
      };
      let activitied = commentCanister.addAdminActivity(caller, key, #editViews, isEntry.title);
      let newEntry = entryStorage.replace(key, tempEntry);
      return true;
    };
    case (null) {
      return false;
    };
  };
};
public shared ({ caller }) func editWeb3Views(key : Key, inputViews : Nat, userCanisterId : Text, commentCanisterId : Text) : async Bool {

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  assert not Principal.isAnonymous(caller);
  let maybeEntry = web3Storage.get(key);
  switch (maybeEntry) {
    case (?web3) {
      let tempWeb3 : Web3 = {
        company = web3.company;
        shortDescription = web3.shortDescription;
        founderName = web3.founderName;
        founderDetail = web3.founderDetail;
        founderImage = web3.founderImage;
        companyBanner = web3.companyBanner;
        catagory = web3.catagory;
        creation_time = web3.creation_time;
        user = web3.user;
        status = web3.status;
        likes = web3.likes;
        likedUsers = web3.likedUsers;
        companyUrl = web3.companyUrl;
        facebook = web3.facebook;
        instagram = web3.instagram;
        linkedin = web3.linkedin;
        companyDetail = web3.companyDetail;
        companyLogo = web3.companyLogo;
        discord = web3.discord;
        telegram = web3.telegram;
        twitter = web3.twitter;
        views = inputViews;
        articleCount = web3.articleCount;
        podcastCount = web3.podcastCount;
        pressReleaseCount = web3.pressReleaseCount;
        totalCount = web3.totalCount;
        isStatic = web3.isStatic;
        founderEmail = web3.founderEmail;

      };

      let activitied = commentCanister.addAdminActivity(caller, key, #editWeb3Views, web3.company);
      let newEntry = web3Storage.replace(key, tempWeb3);
      return true;
    };
    case (null) {
      return false;
    };
  };
};

public query func getCategories() : async [Text] {
  return stable_categories;
};
public shared ({ caller }) func addCategory(categoryName : Text, userCanisterId : Text, commentCanisterId : Text) : async [Text] {
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let newCategories = Array.append<Text>([categoryName], stable_categories);

  stable_categories := newCategories;
  // stable_categories := ["AI", "BlockChain", "Guide", "GameReview"];
  return newCategories;
};
public shared ({ caller }) func likeEntry(key : Key, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Bool), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    add_reward : (caller : Principal, like_reward : Nat, enum : Text) -> async Bool;
    check_user_exists : (caller : Principal) -> async Bool;
    get_NFT24Coin : () -> async Nat;
  };
  let commentCanister = actor (commentCanisterId) : actor {
    addActivity : (user : Principal, target : Text, activityType : ActivityType, title : Text) -> async Bool;
  };

  let isUser = await userCanister.check_user_exists(caller);
  assert isUser;

  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {
      var tempLikedUsers = isEntry.likedUsers;
      var isLiked = Array.find<Principal>(tempLikedUsers, func x = x == caller);
      var isPromoted = isEntry.isPromoted;
      var newPromoted = false;

      if (isPromoted) {
        switch (isLiked) {
          case (?liked) {
            return #err("Not Allowed");
          };
          case (null) {
            // let isTargetReached = isEntry.likes >= isEntry.promotionLikesTarget;
            // if (isTargetReached) {
            //   newPromoted := false;
            // } else {
            //   newPromoted := true;
            // };
            var oneCoinsValue = await userCanister.get_NFT24Coin();
            // var tempRewardAmount = oneCoinsValue * like_reward;
            var newPromotionTokens : Nat = isEntry.promotionICP;

            var shouldReward = false;

            if ((newPromotionTokens - like_reward) : Int == 0) {
              newPromotionTokens := newPromotionTokens - like_reward;
              newPromoted := false;
              shouldReward := true;
            } else if ((newPromotionTokens - like_reward) : Int <= 0) {
              shouldReward := false;
              newPromoted := false;
            } else {
              newPromotionTokens := newPromotionTokens - like_reward;
              newPromoted := true;
              shouldReward := true;
            };
            let newLikedUsers = Array.append(tempLikedUsers, [caller]);
            var isUserRewarded = true;
            if (shouldReward) {
              isUserRewarded := await userCanister.add_reward(caller, like_reward, "a");
            };

            if (isUserRewarded) {
              var tempcompanyId = "";
              var tempImg : ?NewImageObject = null;
              if (isEntry.image != null) {

                tempImg := isEntry.image;

              };
              var temppodcastImg : ?NewImageObject = null;
              if (isEntry.podcastImg != null) {

                temppodcastImg := isEntry.podcastImg;

              };
              tempcompanyId := isEntry.companyId;
              var tempEntry : Entry = {
                title = isEntry.title;
                description = isEntry.description;
                image = tempImg;
                creation_time = isEntry.creation_time;
                user = isEntry.user;
                views = isEntry.views;
                likes = isEntry.likes +1;
                category = isEntry.category;
                seoTitle = isEntry.seoTitle;
                seoSlug = isEntry.seoSlug;
                viewedUsers = isEntry.viewedUsers;
                likedUsers = newLikedUsers;
                seoDescription = isEntry.seoDescription;
                seoExcerpt = isEntry.seoExcerpt;
                subscription = isEntry.subscription;
                isDraft = isEntry.isDraft;
                isPromoted = newPromoted;
                minters = isEntry.minters;
                userName = isEntry.userName;
                // promotionLikesTarget = isEntry.promotionLikesTarget;
                promotionICP = newPromotionTokens;
                status = isEntry.status;
                promotionHistory = isEntry.promotionHistory;
                pressRelease = isEntry.pressRelease;
                caption = isEntry.caption;
                tags = isEntry.tags;
                isCompanySelected = isEntry.isCompanySelected;
                companyId = tempcompanyId;
                isPodcast = isEntry.isPodcast;
                podcastVideoLink = isEntry.podcastVideoLink;
                podcastImgCation = isEntry.podcastImgCation;
                podcastImg = temppodcastImg;
                isStatic = isEntry.isStatic;

              };
              let newEntry = entryStorage.replace(key, tempEntry);
              let activited = commentCanister.addActivity(caller, key, #like, isEntry.title);
              return #ok("Article Liked Successfully", true);

            } else {
              var tempcompanyId = "";
              tempcompanyId := isEntry.companyId;
              var tempImg : ?NewImageObject = null;
              if (isEntry.image != null) {

                tempImg := isEntry.image;

              };
              var temppodcastImg : ?NewImageObject = null;
              if (isEntry.podcastImg != null) {

                temppodcastImg := isEntry.podcastImg;

              };
              var tempEntry : Entry = {
                title = isEntry.title;
                description = isEntry.description;
                image = tempImg;
                creation_time = isEntry.creation_time;
                user = isEntry.user;
                views = isEntry.views;
                likes = isEntry.likes +1;
                category = isEntry.category;
                seoTitle = isEntry.seoTitle;
                seoSlug = isEntry.seoSlug;
                viewedUsers = isEntry.viewedUsers;
                likedUsers = newLikedUsers;
                seoDescription = isEntry.seoDescription;
                seoExcerpt = isEntry.seoExcerpt;
                subscription = isEntry.subscription;
                isDraft = isEntry.isDraft;
                minters = isEntry.minters;
                userName = isEntry.userName;
                isPromoted = isEntry.isPromoted;
                // promotionLikesTarget = isEntry.promotionLikesTarget;
                promotionICP = isEntry.promotionICP;
                status = isEntry.status;
                promotionHistory = isEntry.promotionHistory;
                pressRelease = isEntry.pressRelease;
                caption = isEntry.caption;
                tags = isEntry.tags;
                isCompanySelected = isEntry.isCompanySelected;
                companyId = tempcompanyId;
                isPodcast = isEntry.isPodcast;
                podcastVideoLink = isEntry.podcastVideoLink;
                podcastImgCation = isEntry.podcastImgCation;
                podcastImg = temppodcastImg;
                isStatic = isEntry.isStatic;
              };
              let newEntry = entryStorage.replace(key, tempEntry);
              return #ok("Error while liking", true);
            };
            //  return #err("HIIIIi");
          };
        };
      } else {

        switch (isLiked) {
          case (?liked) {
            var newLikedUsers : [Principal] = [];
            for (item : Principal in tempLikedUsers.vals()) {
              if (item != caller) {
                newLikedUsers := Array.append<Principal>(newLikedUsers, [item]);
              };
            };
            var newLikesCount = 0;
            if (isEntry.likes > 0) {
              newLikesCount := isEntry.likes -1;
            };
            var tempcompanyId = "";
            tempcompanyId := isEntry.companyId;
            var tempImg : ?NewImageObject = null;
            if (isEntry.image != null) {

              tempImg := isEntry.image;

            };
            var temppodcastImg : ?NewImageObject = null;
            if (isEntry.podcastImg != null) {

              temppodcastImg := isEntry.podcastImg;

            };
            var tempEntry : Entry = {
              title = isEntry.title;
              description = isEntry.description;
              image = tempImg;
              creation_time = isEntry.creation_time;
              user = isEntry.user;
              views = isEntry.views;
              likes = newLikesCount;
              category = isEntry.category;
              seoTitle = isEntry.seoTitle;
              seoSlug = isEntry.seoSlug;
              viewedUsers = isEntry.viewedUsers;
              likedUsers = newLikedUsers;
              seoDescription = isEntry.seoDescription;
              seoExcerpt = isEntry.seoExcerpt;
              subscription = isEntry.subscription;
              minters = isEntry.minters;
              isDraft = isEntry.isDraft;
              isPromoted = isEntry.isPromoted;
              // promotionLikesTarget = isEntry.promotionLikesTarget;
              userName = isEntry.userName;
              promotionICP = isEntry.promotionICP;
              status = isEntry.status;
              promotionHistory = isEntry.promotionHistory;
              pressRelease = isEntry.pressRelease;
              caption = isEntry.caption;
              tags = isEntry.tags;
              isCompanySelected = isEntry.isCompanySelected;
              companyId = tempcompanyId;
              isPodcast = isEntry.isPodcast;
              podcastVideoLink = isEntry.podcastVideoLink;
              podcastImgCation = isEntry.podcastImgCation;
              podcastImg = temppodcastImg;
              isStatic = isEntry.isStatic;
            };
            let newEntry = entryStorage.replace(key, tempEntry);
            #ok("Article Unliked Successfully", false);
            // #err("Article Already Liked", false);
          };
          case (null) {
            let newLikedUsers = Array.append(tempLikedUsers, [caller]);
            var tempcompanyId = "";
            tempcompanyId := isEntry.companyId;
            var tempImg : ?NewImageObject = null;
            if (isEntry.image != null) {

              tempImg := isEntry.image;

            };
            var temppodcastImg : ?NewImageObject = null;
            if (isEntry.podcastImg != null) {

              temppodcastImg := isEntry.podcastImg;

            };
            var tempEntry : Entry = {
              title = isEntry.title;
              description = isEntry.description;
              image = tempImg;
              creation_time = isEntry.creation_time;
              user = isEntry.user;
              views = isEntry.views;
              likes = isEntry.likes +1;
              category = isEntry.category;
              seoTitle = isEntry.seoTitle;
              seoSlug = isEntry.seoSlug;
              viewedUsers = isEntry.viewedUsers;
              likedUsers = newLikedUsers;
              seoDescription = isEntry.seoDescription;
              seoExcerpt = isEntry.seoExcerpt;
              subscription = isEntry.subscription;
              isDraft = isEntry.isDraft;
              minters = isEntry.minters;
              isPromoted = isEntry.isPromoted;
              userName = isEntry.userName;
              // promotionLikesTarget = isEntry.promotionLikesTarget;
              promotionICP = isEntry.promotionICP;
              status = isEntry.status;
              pressRelease = isEntry.pressRelease;
              promotionHistory = isEntry.promotionHistory;
              caption = isEntry.caption;
              tags = isEntry.tags;
              isCompanySelected = isEntry.isCompanySelected;
              companyId = tempcompanyId;
              isPodcast = isEntry.isPodcast;
              podcastVideoLink = isEntry.podcastVideoLink;
              podcastImgCation = isEntry.podcastImgCation;
              podcastImg = temppodcastImg;
              isStatic = isEntry.isStatic;
            };
            let newEntry = entryStorage.replace(key, tempEntry);
            let activited = commentCanister.addActivity(caller, key, #like, isEntry.title);
            #ok("Article Liked Successfully", true);
          };
        };
      };
    };
    case (null) {
      #err("No Article Found")

    };
  };
};
public shared ({ caller }) func mintEntry(key : Key, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    check_user_exists : (caller : Principal) -> async Bool;
  };
  let isUser = await userCanister.check_user_exists(caller);
  assert isUser;

  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {

      var tempMinters = isEntry.minters;
      var isMinted = Array.find<Principal>(tempMinters, func x = x == caller);
      switch (isMinted) {
        case (?minted) {
          #err("Not Allowed");
        };
        case (null) {
          let newMinted : [Principal] = Array.append(tempMinters, [caller]);
          var tempcompanyId = "";
          tempcompanyId := isEntry.companyId;
          var tempImg : ?NewImageObject = null;
          if (isEntry.image != null) {

            tempImg := isEntry.image;

          };
          var temppodcastImg : ?NewImageObject = null;
          if (isEntry.podcastImg != null) {

            temppodcastImg := isEntry.podcastImg;

          };
          var tempEntry : Entry = {
            title = isEntry.title;
            description = isEntry.description;
            image = tempImg;
            creation_time = isEntry.creation_time;
            user = isEntry.user;
            views = isEntry.views;
            likes = isEntry.likes;
            category = isEntry.category;
            seoTitle = isEntry.seoTitle;
            seoSlug = isEntry.seoSlug;
            viewedUsers = isEntry.viewedUsers;
            likedUsers = isEntry.likedUsers;
            seoDescription = isEntry.seoDescription;
            seoExcerpt = isEntry.seoExcerpt;
            subscription = isEntry.subscription;
            isDraft = isEntry.isDraft;
            minters = newMinted;
            isPromoted = isEntry.isPromoted;
            promotionICP = isEntry.promotionICP;
            userName = isEntry.userName;
            caption = isEntry.caption;
            tags = isEntry.tags;

            status = isEntry.status;
            // promotionLikesTarget = isEntry.promotionLikesTarget;
            pressRelease = isEntry.pressRelease;
            promotionHistory = isEntry.promotionHistory;
            isCompanySelected = isEntry.isCompanySelected;
            companyId = tempcompanyId;
            isPodcast = isEntry.isPodcast;
            podcastVideoLink = isEntry.podcastVideoLink;
            podcastImgCation = isEntry.podcastImgCation;
            podcastImg = temppodcastImg;
            isStatic = isEntry.isStatic;
          };

          let newEntry = entryStorage.replace(key, tempEntry);
          #ok("Article Minted Successfully", true);
        };
      };

    };
    case (null) {
      #err("No Article Found")

    };
  };
  //  public query func getEntry(key : Key) : async Result.Result<(Entry, Text), Text> {
  //   var entry = entryStorage.get(key);
  //   switch (entry) {
  //     case (?isEntry) {
  //       return #ok(isEntry, "Entery get successfully");
  //     };
  //     case (null) {
  //       return #err("Entry not found");
  //     };
  //   };
  // };
};
public shared ({ caller }) func isMinted(key : Key) : async Bool {
  assert not Principal.isAnonymous(caller);

  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?isEntry) {

      var tempMinters = isEntry.minters;
      var isMinted = Array.find<Principal>(tempMinters, func x = x == caller);
      switch (isMinted) {
        case (?minted) {
          return true;
        };
        case (null) {
          return false;
        };
      };

    };
    case (null) {
      return false;

    };
  };
  //  public query func getEntry(key : Key) : async Result.Result<(Entry, Text), Text> {
  //   var entry = entryStorage.get(key);
  //   switch (entry) {
  //     case (?isEntry) {
  //       return #ok(isEntry, "Entery get successfully");
  //     };
  //     case (null) {
  //       return #err("Entry not found");
  //     };
  //   };
  // };
};
public query func getUserEntries(user : UserId, isPodcast : Bool, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Key, Entry)];
  amount : Nat;
} {
  var sortedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (entry.user == user and not entry.isDraft and isPodcast == entry.isPodcast) {
      switch (entry.status) {
        case (#approved) {
          sortedEntries.put(key, entry);
        };
        case (_) {

        };
      };

    };
  };

  let entryArray = Iter.toArray(sortedEntries.entries());
  return EntryStoreHelper.paginateEntriesByLatest(entryArray, startIndex, length, getModificationdate);
};
public query func getUserFavouritePost(user : UserId, startIndex : Nat, length : Nat) : async {
  entries : [(Key, Entry)];
  amount : Nat;
} {
  var sortedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (not entry.isDraft) {

      switch (entry.status) {
        case (#approved) {
          let isLiked = Array.find<Principal>(entry.likedUsers, func p = p == user);
          switch (isLiked) {
            case (null) {

            };
            case (?liked) {
              sortedEntries.put(key, entry);

            };

          };

        };
        case (_) {

        };
      };

    };
  };

  let entryArray = Iter.toArray(sortedEntries.entries());
  return EntryStoreHelper.paginateEntriesByLatest(entryArray, startIndex, length, getModificationdate);
};
public query ({ caller }) func getUserFavouriteDirectories(user : UserId, search : Text, startIndex : Nat, length : Nat) : async {
  web3List : [(Key, Web3)];
  amount : Nat;
} {

  var web3List = Map.HashMap<Key, Web3>(0, Text.equal, Text.hash);

  for ((key, web3) in web3Storage.entries()) {
    let status = web3.status;
    let shouldSend = shouldSendWeb3(status);
    if (shouldSend) {
      let isLiked = Array.find<Principal>(web3.likedUsers, func p = p == user);
      switch (isLiked) {
        case (null) {

        };
        case (?liked) {
          web3List.put(key, web3);

        };
      };

    };

  };
  let web3Array = Iter.toArray(web3List.entries());
  let tempStoreage = Web3StoreHelper.searchSortList(web3List, search, startIndex, length, getModificationdate);

};
public query func getEntriesByCategory(inputCategory : Text) : async [(Key, Entry)] {
  // stable to entrystorage
  var sortedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    // if (entry.user == user) {
    //   sortedEntries.put(key, entry);
    // };
    if (shouldSendEntry(entry)) {
      let tempCategories = entry.category;
      for (category in tempCategories.vals()) {
        if (category == inputCategory) {

          sortedEntries.put(key, entry);
        };
      };
    };
  };
  let entryArray = Iter.toArray(sortedEntries.entries());
  return EntryStoreHelper.sortEntriesByLatest(entryArray, getModificationdate);
};
public query func getAllEntries(cate : Text) : async [(Key, Entry)] {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendEntry(entry)) {
      if (cate == "All") {
        nonDraftedEntries.put(key, entry);

      } else {
        for (entryCat in entry.category.vals()) {
          if (entryCat == cate) {
            nonDraftedEntries.put(key, entry);

          };
        };
      };

    };
  };
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  let sortedArray = EntryStoreHelper.sortEntriesByLatest(entryArray, getModificationdate);
  var paginatedArray : [(Key, Entry)] = [];

  if (sortedArray.size() > 10) {

    paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, 0, 10);
  } else {
    paginatedArray := sortedArray;
  };
  return paginatedArray;

  // var tempEntries : [(Key, Entry)] = [];
  // tempEntries := Iter.toArray(entryStorage.entries());
  // return tempEntries;
};
/**

function for get creation_time, modification_date,key

@param null
@returns {
       creation_time : Int;
     modification_date : Int;
     key : Text;
  }; object.
*/
public query func getAllEntryIds(isPodcast : Bool) : async [SlugWithData] {
  var filteredKeys : [SlugWithData] = [];
  for (key in entryStorage.keys()) {
    let entry = entryStorage.get(key);
    switch (entry) {
      case (null) {
        // Handle null case if needed
      };
      case (?entryValue) {
        // Add your filter condition here

        if (shouldSendContent(entryValue) and not entryValue.isDraft and (isPodcast == entryValue.isPodcast)) {

          let isModDate = entryModificationStorage.get(key);
          switch (isModDate) {
            case (?isModDate) {
              let data : SlugWithData = {
                key = key;
                creation_time = isModDate.creation_time;
                modification_date = isModDate.modification_date;

              };
              filteredKeys := Array.append(filteredKeys, [data]);

            };
            case (null) {
              let data : SlugWithData = {
                key = key;
                creation_time = entryValue.creation_time;
                modification_date = entryValue.creation_time;

              };
              filteredKeys := Array.append(filteredKeys, [data]);

            };
          };

        };
      };
    };
  };
  return filteredKeys;

};
/**

function for get creation_time, modification_date,key

@param null
@returns {
       creation_time : Int;
     modification_date : Int;
     key : Text;
  }; object.
*/
public query func getAllEventsIds() : async [SlugWithData] {
  var filteredKeys : [SlugWithData] = [];
  for (key in eventStorage.keys()) {
    let entry = eventStorage.get(key);
    switch (entry) {
      case (null) {
        // Handle null case if needed
      };
      case (?entryValue) {
        let isModDate = entryModificationStorage.get(key);
        switch (isModDate) {
          case (?isModDate) {
            let data : SlugWithData = {
              key = key;
              creation_time = isModDate.creation_time;
              modification_date = isModDate.modification_date;

            };
            filteredKeys := Array.append(filteredKeys, [data]);

          };
          case (null) {
            let data : SlugWithData = {
              key = key;
              creation_time = entryValue.creation_time;
              modification_date = entryValue.creation_time;

            };
            filteredKeys := Array.append(filteredKeys, [data]);

          };
        };
      };
    };
  };
  return filteredKeys;

};
/**
function for get creation_time, modification_date,key

@param null
@returns {
       creation_time : Int;
     modification_date : Int;
     key : Text;
  }; object.
*/
public query func getAllCategoriesIds() : async [SlugWithData] {
  var filteredKeys : [SlugWithData] = [];
  for (key in categoryStorage.keys()) {
    let entry = categoryStorage.get(key);
    switch (entry) {
      case (null) {
        // Handle null case if needed
      };
      case (?entryValue) {
        let isModDate = entryModificationStorage.get(key);
        switch (isModDate) {
          case (?isModDate) {
            let data : SlugWithData = {
              key = key;
              creation_time = isModDate.creation_time;
              modification_date = isModDate.modification_date;

            };
            filteredKeys := Array.append(filteredKeys, [data]);

          };
          case (null) {
            let data : SlugWithData = {
              key = key;
              creation_time = entryValue.creation_time;
              modification_date = entryValue.creation_time;

            };
            filteredKeys := Array.append(filteredKeys, [data]);

          };
        };
      };
    };
  };
  return filteredKeys;

};
public query func getPaginatedEntries(startIndex : Nat, length : Nat) : async {
  entries : [(Key, Entry)];
  amount : Nat;
} {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    switch (entry.status) {
      case (#approved) {

        nonDraftedEntries.put(key, entry);

      };
      case (_) {

      };
    };

  };
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.paginateEntriesByLatest(entryArray, startIndex, length, getModificationdate)

  // var tempEntries : [(Key, Entry)] = [];
  // tempEntries := Iter.toArray(entryStorage.entries());
  // return tempEntries;
};
public query func getEntriesNew(inputCategory : CategoryId, search : Text, page : Nat, length : Nat) : async {
  amount : Nat;
  entries : [(Key, Entry)];
} {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendAllEntry(entry)) {
      let tempCategories = entry.category;
      for (category in tempCategories.vals()) {
        if (category == inputCategory) {

          nonDraftedEntries.put(key, entry);
        };
      };
      // nonDraftedEntries.put(key, entry);
    };
  };

  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.searchSortEntries(entryArray, search, page, length, getModificationdate)

};
public query func getEntriesNewlatest(search : Text, page : Nat, length : Nat) : async {
  amount : Nat;
  entries : [(Key, Entry)];
} {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendAllEntry(entry)) {

      nonDraftedEntries.put(key, entry);

    };
  };

  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.searchSortEntries(entryArray, search, page, length, getModificationdate)

};
public query func getSearchedEntries(contentType : Text, search : Text, startIndex : Nat, length : Nat) : async {
  amount : Nat;
  entries : [(Key, Entry)];
} {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendAllEntry(entry)) {

      switch (contentType) {
        case ("Articles") {
          if (not entry.isPodcast and not entry.pressRelease) {
            nonDraftedEntries.put(key, entry);

          };
        };
        case ("PressRelease") {
          if (entry.pressRelease) {
            nonDraftedEntries.put(key, entry);

          };
        };
        case ("Podcast") {
          if (entry.isPodcast) {
            nonDraftedEntries.put(key, entry);

          };
        };
        case (_) {

        };
      };

    };
  };

  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.searchSortEntries(entryArray, search, startIndex, length, getModificationdate)

};
public query func getEntriesOfWeb3(contentType : Text,directoryId:Text, search : Text, startIndex : Nat, length : Nat) : async {
  amount : Nat;
  entries : [(Key, Entry)];
} {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendAllEntry(entry) and entry.companyId == directoryId) {

      switch (contentType) {
        case ("Articles") {
          if (not entry.isPodcast and not entry.pressRelease) {
            
            nonDraftedEntries.put(key, entry);

          };
        };
        case ("PressRelease") {
          if (entry.pressRelease) {
            nonDraftedEntries.put(key, entry);

          };
        };
        case ("Podcast") {
          if (entry.isPodcast) {
            nonDraftedEntries.put(key, entry);

          };
        };
        case (_) {

        };
      };

    };
  };

  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.paginateEntriesByLatest(entryArray, startIndex, length, getModificationdate);
};
public query func getQuriedEntries(inputCategory : ?CategoryId, search : Text, tag : Text, startIndex : Nat, length : Nat) : async {
  amount : Nat;
  entries : [(Key, Entry)];
} {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendContent(entry)) {
      let tempCategories = entry.category;
      for (category in tempCategories.vals()) {
        switch (inputCategory) {
          case (?isCategory) {
            if (category == isCategory) {

              nonDraftedEntries.put(key, entry);
            };
          };
          case (null) {
            nonDraftedEntries.put(key, entry);

          };
        };

      };
      // nonDraftedEntries.put(key, entry);
    };
  };

  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.searchSortTaggedEntries(entryArray, search, tag, startIndex, length, getModificationdate)

};
public query func getPressEntries(cate : Text) : async [(Key, Entry)] {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendEntry(entry)) {
      if (entry.pressRelease) {
        if (cate == "All") {
          nonDraftedEntries.put(key, entry);

        } else {
          for (entryCat in entry.category.vals()) {
            if (entryCat == cate) {
              nonDraftedEntries.put(key, entry);

            };
          };
        };

      };
    };
  };
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  return EntryStoreHelper.sortEntriesByLatest(entryArray, getModificationdate)

  // var tempEntries : [(Key, Entry)] = [];
  // tempEntries := Iter.toArray(entryStorage.entries());
  // return tempEntries;
};
public query func getOnlyPressRelease(length : Nat, cate : [Text]) : async [(Key, Entry)] {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendEntry(entry)) {
      if (entry.pressRelease) {
        for (category in entry.category.vals()) {
          let maybeCategory = categoryStorage.get(category);
          switch (maybeCategory) {
            case (?isCategory) {

              for (mycate in cate.vals()) {
                let category1 : Text = Text.map(isCategory.name, Prim.charToLower);

                let category2 : Text = Text.map(mycate, Prim.charToLower);
                if (category1 == category2) {
                  nonDraftedEntries.put(key, entry);
                };
              };

            };
            case (null) {};
          };
        };
      };
    };
  };
  var paginatedArray : [(Key, Entry)] = [];
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  if (entryArray.size() > length) {
    paginatedArray := Array.subArray<(Key, Entry)>(entryArray, 0, length);
    return EntryStoreHelper.sortEntriesByLatest(paginatedArray, getModificationdate)

  } else {
    return EntryStoreHelper.sortEntriesByLatest(entryArray, getModificationdate)

  };

  // var tempEntries : [(Key, Entry)] = [];
  // tempEntries := Iter.toArray(entryStorage.entries());
  // return tempEntries;
};
public query func getOnlyArticles(length : Nat, cate : [Text]) : async [(Key, Entry)] {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendEntry(entry)) {
      if (not entry.pressRelease) {
        for (category in entry.category.vals()) {
          let maybeCategory = categoryStorage.get(category);
          switch (maybeCategory) {
            case (?isCategory) {

              for (mycate in cate.vals()) {
                let category1 : Text = Text.map(isCategory.name, Prim.charToLower);

                let category2 : Text = Text.map(mycate, Prim.charToLower);
                if (category1 == category2) {
                  nonDraftedEntries.put(key, entry);
                };
              };

            };
            case (null) {};
          };

        };

      };
    };
  };
  var paginatedArray : [(Key, Entry)] = [];
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  if (entryArray.size() > length) {
    paginatedArray := Array.subArray<(Key, Entry)>(entryArray, 0, length);
    return EntryStoreHelper.sortEntriesByLatest(paginatedArray, getModificationdate)

  } else {
    return EntryStoreHelper.sortEntriesByLatest(entryArray, getModificationdate)

  };

  // var tempEntries : [(Key, Entry)] = [];
  // tempEntries := Iter.toArray(entryStorage.entries());
  // return tempEntries;
};

public query func trendingPressReleaseItemSidebar(length : Nat) : async [(Key, TrendingEntryItemSidebar)] {
  var nonDraftedEntries = Map.fromIter<Key, TrendingEntryItemSidebar>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendEntry(entry)) {
      if (entry.pressRelease) {
        nonDraftedEntries.put(key, entry);

      };
    };
  };
  var paginatedArray : [(Key, TrendingEntryItemSidebar)] = [];
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  if (entryArray.size() > length) {
    paginatedArray := Array.subArray<(Key, TrendingEntryItemSidebar)>(entryArray, 0, length);
    return EntryStoreHelper.sortTrendingEntriesByLatest(paginatedArray, getModificationdate)

  } else {
    return EntryStoreHelper.sortTrendingEntriesByLatest(entryArray, getModificationdate)

  };

};
public query func trendingEntryItemSidebar(length : Nat) : async [(Key, TrendingEntryItemSidebar)] {
  var nonDraftedEntries = Map.fromIter<Key, TrendingEntryItemSidebar>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if (shouldSendEntry(entry)) {
      if (not entry.pressRelease) {
        nonDraftedEntries.put(key, entry);

      };
    };
  };
  var paginatedArray : [(Key, TrendingEntryItemSidebar)] = [];
  let entryArray = Iter.toArray(nonDraftedEntries.entries());
  if (entryArray.size() > length) {
    paginatedArray := Array.subArray<(Key, TrendingEntryItemSidebar)>(entryArray, 0, length);
    return EntryStoreHelper.sortTrendingEntriesByLatest(paginatedArray, getModificationdate)

  } else {
    return EntryStoreHelper.sortTrendingEntriesByLatest(entryArray, getModificationdate)

  };

};
public query func getPromotedEntries(length : Nat) : async [(Key, Entry)] {
  var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
  for ((key, entry) in entryStorage.entries()) {
    if ((shouldSendEntry(entry)) and entry.isPromoted) {
      nonDraftedEntries.put(key, entry);
    };
  };
  let entryArray = Iter.toArray(nonDraftedEntries.entries());

  let sortedArray = EntryStoreHelper.sortEntriesByLatest(entryArray, getModificationdate);
  let size = sortedArray.size();
  let startIndex = 0;
  var paginatedArray : [(Key, Entry)] = [];
  let itemsPerPage = 10;

  if (size > startIndex and size > (length + startIndex) and length != 0) {
    paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, startIndex, length);
  } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
    paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, startIndex, itemsPerPage);

  } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
    let amount : Nat = size - startIndex;
    paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, startIndex, amount);

  } else if (size > itemsPerPage) {
    paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, 0, itemsPerPage);
  } else {
    paginatedArray := sortedArray;
  };
  return paginatedArray;
};
public query func getEntriesList(inputCategory : Text, draft : Bool, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Key, ListEntryItem)];
  amount : Nat;
} {

  var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    var tempcompanyId = "";
    var tempImg : ?NewImageObject = null;
    if (entry.image != null) {

      tempImg := entry.image;

    };
    var temppodcastImg : ?NewImageObject = null;
    if (entry.podcastImg != null) {

      temppodcastImg := entry.podcastImg;

    };
    tempcompanyId := entry.companyId;
    let modification_date = getModificationdate(key, entry.creation_time);
    let lisEntryItem : ListEntryItem = {
      title = entry.title;
      image = tempImg;
      likes = entry.likes;
      views = entry.views;
      creation_time = entry.creation_time;
      user = entry.user;
      userName = entry.userName;
      category = entry.category;
      isDraft = entry.isDraft;
      minters = entry.minters;
      status = entry.status;
      isPromoted = entry.isPromoted;
      pressRelease = entry.pressRelease;
      caption = entry.caption;
      tags = entry.tags;
      isCompanySelected = entry.isCompanySelected;
      companyId = tempcompanyId;
      podcastImgCation = entry.podcastImgCation;
      podcastImg = temppodcastImg;
      podcastVideoLink = entry.podcastVideoLink;
      isPodcast = entry.isPodcast;
      seoExcerpt = entry.seoExcerpt;
      isStatic = entry.isStatic;
      modificationDate = modification_date;
    };
    if ((inputCategory == "All")) {
      if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
        entiresList.put(key, lisEntryItem);
      };
    } else {
      if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
        let tempCategories = entry.category;
        for (category in tempCategories.vals()) {
          if (category == inputCategory) {
            entiresList.put(key, lisEntryItem);
          };
        };

        // entiresList := sortByCategory(inputCategory, entiresList, key, lisEntryItem, entry);
      };
    };
  };
  // let entryArray = Iter.toArray(entiresList.entries());

  return EntryStoreHelper.searchSortList(entiresList, search, startIndex, length);

};
//  dataType for below function
// 1 =pressRelease
// 2 =podcast
// 3 =article

public query func getUniqueDataList(inputCategory : Text, draft : Bool, search : Text, startIndex : Nat, length : Nat, dataType : Nat) : async {
  entries : [(Key, ListPodcastItem)];
  amount : Nat;
} {

  var entiresList = Map.HashMap<Key, ListPodcastItem>(0, Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    var tempcompanyId = "";
    var tempImg : ?NewImageObject = null;
    if (entry.image != null) {

      tempImg := entry.image;

    };
    var temppodcastImg : ?NewImageObject = null;
    if (entry.podcastImg != null) {

      temppodcastImg := entry.podcastImg;

    };
    tempcompanyId := entry.companyId;
    let lisEntryItem : ListPodcastItem = {
      title = entry.title;
      image = tempImg;
      likes = entry.likes;
      views = entry.views;
      creation_time = entry.creation_time;
      user = entry.user;
      userName = entry.userName;
      category = entry.category;
      isDraft = entry.isDraft;
      minters = entry.minters;
      status = entry.status;
      isPromoted = entry.isPromoted;
      pressRelease = entry.pressRelease;
      caption = entry.caption;
      tags = entry.tags;
      isCompanySelected = entry.isCompanySelected;
      companyId = tempcompanyId;
      isPodcast = entry.isPodcast;
      podcastVideoLink = entry.podcastVideoLink;
      podcastImgCation = entry.podcastImgCation;
      podcastImg = temppodcastImg;
      likedUsers = entry.likedUsers;
      seoExcerpt = entry.seoExcerpt;
      isStatic = entry.isStatic;
    };
    if (dataType == 1) {
      if (entry.pressRelease) {
        if ((inputCategory == "All")) {
          if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
            entiresList.put(key, lisEntryItem);
          };
        } else {
          if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
            let tempCategories = entry.category;
            for (category in tempCategories.vals()) {
              if (category == inputCategory) {
                entiresList.put(key, lisEntryItem);
              };
            };

          };

          // entiresList := sortByCategory(inputCategory, entiresList, key, lisEntryItem, entry);
        };
      };
    } else if (dataType == 2) {
      if (entry.isPodcast) {
        if ((inputCategory == "All")) {
          if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
            entiresList.put(key, lisEntryItem);
          };
        } else {
          if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
            let tempCategories = entry.category;
            for (category in tempCategories.vals()) {
              if (category == inputCategory) {
                entiresList.put(key, lisEntryItem);
              };
            };

          };

          // entiresList := sortByCategory(inputCategory, entiresList, key, lisEntryItem, entry);
        };
      };
    } else if (dataType == 3) {
      if (not entry.pressRelease and not entry.isPodcast) {
        if ((inputCategory == "All")) {
          if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
            entiresList.put(key, lisEntryItem);
          };
        } else {
          if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
            let tempCategories = entry.category;
            for (category in tempCategories.vals()) {
              if (category == inputCategory) {
                entiresList.put(key, lisEntryItem);
              };
            };

          };

          // entiresList := sortByCategory(inputCategory, entiresList, key, lisEntryItem, entry);
        };
      };
    };

  };
  // let entryArray = Iter.toArray(entiresList.entries());

  return EntryStoreHelper.searchSortListPodcast(entiresList, search, startIndex, length, getModificationdate);

};
public query ({ caller }) func getUserEntriesList(inputCategory : Text, draft : Bool, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Key, ListEntryItem)];
  amount : Nat;
} {
  assert not Principal.isAnonymous(caller);
  //   let userCanister = actor (userCanisterId) : actor {
  //   check_user_exists : (caller : Principal) -> async Bool;
  // };
  // let isUser = await userCanister.check_user_exists(caller);
  var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {

    if (entry.user == caller) {
      var tempcompanyId = "";
      tempcompanyId := entry.companyId;
      var tempImg : ?NewImageObject = null;
      if (entry.image != null) {

        tempImg := entry.image;

      };
      var temppodcastImg : ?NewImageObject = null;
      if (entry.podcastImg != null) {

        temppodcastImg := entry.podcastImg;

      };
      let modificationDate = getModificationdate(key, entry.creation_time);

      let lisEntryItem : ListEntryItem = {
        title = entry.title;
        image = tempImg;
        likes = entry.likes;
        views = entry.views;
        creation_time = entry.creation_time;
        user = entry.user;
        category = entry.category;
        minters = entry.minters;
        isDraft = entry.isDraft;
        userName = entry.userName;
        status = entry.status;
        isPromoted = entry.isPromoted;
        pressRelease = entry.pressRelease;
        caption = entry.caption;
        tags = entry.tags;
        isCompanySelected = entry.isCompanySelected;
        companyId = tempcompanyId;
        podcastImgCation = entry.podcastImgCation;
        podcastImg = temppodcastImg;
        podcastVideoLink = entry.podcastVideoLink;
        isPodcast = entry.isPodcast;
        seoExcerpt = entry.seoExcerpt;
        isStatic = entry.isStatic;
        modificationDate = modificationDate;
      };

      if ((inputCategory == "All")) {

        if ((draft and (entry.isDraft or not shouldSendListEntry(entry.status))) or (not draft and not entry.isDraft and shouldSendListEntry(entry.status))) {
          entiresList.put(key, lisEntryItem);
        };
      } else {
        if ((draft and (entry.isDraft or not shouldSendListEntry(entry.status))) or (not draft and not entry.isDraft and shouldSendListEntry(entry.status))) {
          let tempCategories = entry.category;
          for (category in tempCategories.vals()) {
            if (category == inputCategory) {
              entiresList.put(key, lisEntryItem);
            };
          };

        };
      };

    };
  };
  let entryArray = Iter.toArray(entiresList.entries());
  return EntryStoreHelper.searchSortList(entiresList, search, startIndex, length);

};
public shared ({ caller }) func getReviewEntries(inputCategory : Text, userCanisterId : Text, status : EntryStatus, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Key, ListEntryItem)];
  amount : Nat;
} {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    var tempcompanyId = "";
    tempcompanyId := entry.companyId;
    var tempImg : ?NewImageObject = null;
    if (entry.image != null) {

      tempImg := entry.image;

    };
    var temppodcastImg : ?NewImageObject = null;
    if (entry.podcastImg != null) {

      temppodcastImg := entry.podcastImg;

    };
    let modificationDate = getModificationdate(key, entry.creation_time);

    let lisEntryItem : ListEntryItem = {
      title = entry.title;
      image = tempImg;
      likes = entry.likes;
      views = entry.views;
      creation_time = entry.creation_time;
      user = entry.user;
      category = entry.category;
      minters = entry.minters;
      isDraft = entry.isDraft;
      userName = entry.userName;
      status = entry.status;
      isPromoted = entry.isPromoted;
      pressRelease = entry.pressRelease;
      caption = entry.caption;
      tags = entry.tags;
      isCompanySelected = entry.isCompanySelected;
      companyId = tempcompanyId;
      podcastImgCation = entry.podcastImgCation;
      podcastImg = temppodcastImg;
      podcastVideoLink = entry.podcastVideoLink;
      isPodcast = entry.isPodcast;
      seoExcerpt = entry.seoExcerpt;
      isStatic = entry.isStatic;
      modificationDate = modificationDate;
    };
    if (not entry.isDraft and not entry.isPodcast) {
      if ((inputCategory == "All")) {
        if (entry.status == status) {
          entiresList.put(key, lisEntryItem);
        };
      } else {
        if (entry.status == status) {
          let tempCategories = entry.category;
          for (category in tempCategories.vals()) {
            if (category == inputCategory) {
              entiresList.put(key, lisEntryItem);
            };
          };
        };

      };
    };

  };
  let entryArray = Iter.toArray(entiresList.entries());
  return EntryStoreHelper.searchSortList(entiresList, search, startIndex, length);

};
public shared ({ caller }) func getReviewPodcast(inputCategory : Text, userCanisterId : Text, status : EntryStatus, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Key, ListPodcastItem)];
  amount : Nat;
} {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  var entiresList = Map.HashMap<Key, ListPodcastItem>(0, Text.equal, Text.hash);

  for ((key, entry) in entryStorage.entries()) {
    var tempcompanyId = "";
    tempcompanyId := entry.companyId;
    var tempImg : ?NewImageObject = null;
    if (entry.image != null) {

      tempImg := entry.image;

    };
    var temppodcastImg : ?NewImageObject = null;
    if (entry.podcastImg != null) {

      temppodcastImg := entry.podcastImg;

    };
    let lisEntryItem : ListPodcastItem = {
      title = entry.title;
      image = tempImg;
      likes = entry.likes;
      views = entry.views;
      creation_time = entry.creation_time;
      user = entry.user;
      category = entry.category;
      minters = entry.minters;
      isDraft = entry.isDraft;
      userName = entry.userName;
      status = entry.status;
      isPromoted = entry.isPromoted;
      pressRelease = entry.pressRelease;
      caption = entry.caption;
      tags = entry.tags;
      isCompanySelected = entry.isCompanySelected;
      companyId = tempcompanyId;
      isPodcast = entry.isPodcast;
      podcastVideoLink = entry.podcastVideoLink;
      seoExcerpt = entry.seoExcerpt;
      podcastImgCation = entry.podcastImgCation;
      podcastImg = temppodcastImg;
      likedUsers = entry.likedUsers;
      isStatic = entry.isStatic;
    };
    if (not entry.isDraft and entry.isPodcast) {
      if ((inputCategory == "All")) {
        if (entry.status == status) {
          entiresList.put(key, lisEntryItem);
        };
      } else {
        if (entry.status == status) {
          let tempCategories = entry.category;
          for (category in tempCategories.vals()) {
            if (category == inputCategory) {
              entiresList.put(key, lisEntryItem);
            };
          };
        };

      };
    };

  };
  let entryArray = Iter.toArray(entiresList.entries());
  return EntryStoreHelper.searchSortListPodcast(entiresList, search, startIndex, length, getModificationdate);

};
public shared ({ caller }) func getWeb3DirectoriesDashboard(userCanisterId : Text, status : Web3Status, cate : Text, search : Text, startIndex : Nat, length : Nat) : async {
  web3List : [(Key, Web3DashboardList)];
  amount : Nat;
} {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);

  var entiresList = Map.HashMap<Key, Web3DashboardList>(0, Text.equal, Text.hash);

  for ((key, entry) in web3Storage.entries()) {
    let lisEntryItem : Web3DashboardList = {
      company = entry.company;
      founderName = entry.founderName;
      catagory = entry.catagory;
      creation_time = entry.creation_time;
      user = entry.user;
      status = entry.status;
      companyUrl = entry.companyUrl;
      companyLogo = entry.companyLogo;
      views = entry.views;
      isStatic = entry.isStatic;
      founderEmail = entry.founderEmail;

    };
    if (cate == "All") {

      switch (status) {
        case (#all) {
          entiresList.put(key, lisEntryItem);

        };
        case (_) {
          if (entry.status == status) {
            entiresList.put(key, lisEntryItem);

          };
        };
      };
    } else if (entry.catagory == cate) {
      switch (status) {
        case (#all) {
          entiresList.put(key, lisEntryItem);

        };
        case (_) {
          if (entry.status == status) {
            entiresList.put(key, lisEntryItem);

          };
        };
      };
    };

  };
  let entryArray = Iter.toArray(entiresList.entries());
  return Web3StoreHelper.searchSortWeb3DashboardList(entiresList, search, startIndex, length, getModificationdate);

};
public shared ({ caller }) func approveArticle(commentCanisterId : Text, userCanisterId : Text, key : Key, action : Bool) : async Result.Result<(Text, Entry), Text> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?entry) {
      var status : EntryStatus = #pending;
      var activity : AdminActivityType = #approve;
      if (action) {
        status := #approved;
        activity := #approve;
      } else {
        status := #rejected;
        activity := #reject;
      };
      var tempcompanyId = "";
      tempcompanyId := entry.companyId;
      var tempImg : ?NewImageObject = null;
      if (entry.image != null) {

        tempImg := entry.image;

      };
      var temppodcastImg : ?NewImageObject = null;
      if (entry.podcastImg != null) {

        temppodcastImg := entry.podcastImg;

      };
      let tempEntry : Entry = {
        title = entry.title;
        description = entry.description;
        image = entry.image;
        creation_time = entry.creation_time;
        user = entry.user;
        views = entry.views;
        likes = entry.likes;
        category = entry.category;
        seoTitle = entry.seoTitle;
        seoSlug = entry.seoSlug;
        viewedUsers = entry.viewedUsers;
        likedUsers = entry.likedUsers;
        seoDescription = entry.seoDescription;
        seoExcerpt = entry.seoExcerpt;
        subscription = entry.subscription;
        isDraft = false;
        isPromoted = entry.isPromoted;
        // promotionLikesTarget = entry.promotionLikesTarget;
        promotionICP = entry.promotionICP;
        minters = entry.minters;
        userName = entry.userName;
        status = status;
        promotionHistory = entry.promotionHistory;
        pressRelease = entry.pressRelease;
        caption = entry.caption;
        tags = entry.tags;
        isCompanySelected = entry.isCompanySelected;
        companyId = entry.companyId;
        isPodcast = entry.isPodcast;
        podcastVideoLink = entry.podcastVideoLink;
        podcastImgCation = entry.podcastImgCation;
        podcastImg = entry.podcastImg;
        isStatic = entry.isStatic;
      };
      let activitied = commentCanister.addAdminActivity(caller, key, activity, entry.title);
      let newEntry = entryStorage.replace(key, tempEntry);
      switch (newEntry) {
        case (?isEntry) {

          for (cat in entry.category.vals()) {
            if (entry.pressRelease) {

              let countIncrease = await update_count_category(cat, "pressRelease");
              let countIncreaseweb3 = await addWeb3postCount(entry.companyId, "pressRelease");

            } else {

              let countIncrease = await update_count_category(cat, "Article");
              let countIncreaseweb3 = await addWeb3postCount(entry.companyId, "article");

            };

          };
          let currentDate = getCurrentDate();
          var res = updateModificationDate(key, currentDate, isEntry.creation_time);
          #ok("Entry Approved Succesfuly", isEntry);
        };
        case (null) {
          #err("Error while approving");
        };
      };
    };
    case (null) {
      #err("Error while approving")

    };
  };
};
public shared ({ caller }) func approvePodcast(commentCanisterId : Text, userCanisterId : Text, key : Key, action : Bool) : async Result.Result<(Text, Entry), Text> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let maybeEntry = entryStorage.get(key);
  switch (maybeEntry) {
    case (?entry) {
      var status : EntryStatus = #pending;
      var activity : AdminActivityType = #approve;
      if (action) {
        status := #approved;
        activity := #approve;
      } else {
        status := #rejected;
        activity := #reject;
      };
      var tempcompanyId = "";
      tempcompanyId := entry.companyId;
      var tempImg : ?NewImageObject = null;
      if (entry.image != null) {

        tempImg := entry.image;

      };
      var temppodcastImg : ?NewImageObject = null;
      if (entry.podcastImg != null) {

        temppodcastImg := entry.podcastImg;

      };
      let tempEntry : Entry = {
        title = entry.title;
        description = entry.description;
        image = tempImg;
        creation_time = entry.creation_time;
        user = entry.user;
        views = 0;
        likes = 0;
        category = entry.category;
        seoTitle = entry.seoTitle;
        seoSlug = entry.seoSlug;
        viewedUsers = [];
        likedUsers = [];
        seoDescription = entry.seoDescription;
        seoExcerpt = entry.seoExcerpt;
        subscription = entry.subscription;
        isDraft = false;
        isPromoted = false;
        // promotionLikesTarget = entry.promotionLikesTarget;
        promotionICP = 0;
        minters = [];
        userName = entry.userName;
        status = status;
        promotionHistory = null;
        pressRelease = false;
        caption = "";
        tags = entry.tags;
        isCompanySelected = entry.isCompanySelected;
        companyId = tempcompanyId;
        isPodcast = entry.isPodcast;
        podcastVideoLink = entry.podcastVideoLink;
        podcastImgCation = entry.podcastImgCation;
        podcastImg = temppodcastImg;
        isStatic = entry.isStatic;
      };
      let activitied = commentCanister.addAdminActivity(caller, key, activity, entry.title);
      let newEntry = entryStorage.replace(key, tempEntry);
      switch (newEntry) {
        case (?isEntry) {
          for (cat in entry.category.vals()) {
            if (entry.isPodcast) {

              let countIncrease = await update_count_category(cat, "Podcast");
              let countIncreaseweb3 = await addWeb3postCount(entry.companyId, "podcast");

            };

          };
          let currentDate = getCurrentDate();
          var res = updateModificationDate(key, currentDate, isEntry.creation_time);
          #ok("Podcast Approved Succesfuly", isEntry);
        };
        case (null) {
          #err("Error while approving");
        };
      };
    };
    case (null) {
      #err("Error while approving")

    };
  };
};
public query ({ caller }) func get_reward() : async RewardConfig {
  assert not Principal.isAnonymous(caller);
  return reward_config;
};
public query ({ caller }) func get_like_reward() : async Nat {
  assert not Principal.isAnonymous(caller);
  return like_reward;
};
// web3
public shared ({ caller }) func insertWeb3(inputWeb3 : InputWeb3, userCanisterId : Text, commentCanisterId : Text, editId : Text, isEdit : Bool) : async Result.Result<(Text, Web3Id), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    check_user_exists : (caller : Principal) -> async Bool;
  };
  let isUser = await userCanister.check_user_exists(caller);
  assert isUser;
  let commentCanister = actor (commentCanisterId) : actor {
    addActivity : (user : Principal, target : Text, activityType : ActivityType, title : Text) -> async Bool;
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };

  if (isEdit) {
    let userCanister2 = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister2.entry_require_permission(caller, #manage_article);

  };
  let web3Id = EntryType.generateNewRemoteObjectId();

  if (not isEdit) {
    let companyExists = Web3StoreHelper.companyExists(inputWeb3.company, web3Storage);
    if (companyExists) {
      return #err("Company name already exists.");
    };
  };
  let currentDate = getCurrentDate();
  let modificationDate = currentDate;
  if (isEdit) {
    let isEntry = web3Storage.get(editId);
    switch (isEntry) {
      case (?isEntry) {
        var res = updateModificationDate(editId, modificationDate, isEntry.creation_time)

      };
      case (null) {

      };
    };
  } else {
    var res = updateModificationDate(web3Id, modificationDate, modificationDate)

  };
  if (isEdit) {
    web3Storage := Web3StoreHelper.addNewWeb3(web3Storage, inputWeb3, editId, caller, isEdit);
    let activited = commentCanister.addAdminActivity(caller, editId, #edit_web3, inputWeb3.company);

    return #ok("Edit", editId);

  } else {
    web3Storage := Web3StoreHelper.addNewWeb3(web3Storage, inputWeb3, web3Id, caller, isEdit);

    let activited = commentCanister.addActivity(caller, web3Id, #create_web3, inputWeb3.company);

    return #ok("created", web3Id);
  };

};
public shared ({ caller }) func delete_web3(key : Key, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let isEntry = web3Storage.get(key);
  switch (isEntry) {
    case (?maybeEntry) {
      let del = web3Storage.remove(key);
      let activited = commentCanister.addAdminActivity(caller, key, #delete_web3, maybeEntry.company);

      #ok("Web3 deleted successfully", true);
    };
    case (null) {
      return #err("Web3 not found", false);
    };
  };

};
func shouldSendWeb3(status : Web3Status) : Bool {
  switch (status) {
    case (#verfied) {
      return true;
    };
    case (_) {
      return false;
    };
  };
};
public query func getWeb3(key : Key) : async ?Web3 {
  let mayBeWeb3 = web3Storage.get(key);
  switch (mayBeWeb3) {
    case (?isweb3) {
      var status = isweb3.status;
      let shoudSend = shouldSendWeb3(status);
      if (shoudSend) {
        return mayBeWeb3;
      } else {
        return null;

      };
    };
    case (null) {
      return null;
    };
  };
};
public shared ({ caller }) func getWeb3_for_admin(key : Key, userCanisterId : Text) : async ?Web3 {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  web3Storage.get(key);

};
public shared ({ caller }) func deleteDraftEntry(key : Key, commentCanisterId : Text) : async Result.Result<(Text, ?Entry), Text> {
  assert not Principal.isAnonymous(caller);
  let maybeEntry : ?Entry = entryStorage.get(key);
  let commentCanister = actor (commentCanisterId) : actor {
    addActivity : (user : Principal, target : Text, activityType : ActivityType, title : Text) -> async Bool;
  };
  switch (maybeEntry) {
    case (?isEntry) {
      if (isEntry.user == caller) {

        switch (isEntry.status) {
          case (#approved) {

            return #err("You can't delete this article.");

          };
          case (_) {
            let removed = entryStorage.remove(key);
            if (isEntry.pressRelease) {
              let activited = commentCanister.addActivity(caller, key, #delete_pressRelease, isEntry.title);

            } else if (isEntry.isPodcast) {
              let activited = commentCanister.addActivity(caller, key, #delete_podcats, isEntry.title);

            } else {
              let activited = commentCanister.addActivity(caller, key, #delete_article, isEntry.title);

            };

            return #ok("Draft removed successfully.", removed);

          };
        };

      } else {
        return #err("Not Allowed.");
      };

    };
    case (null) {
      return #err("Did not find Entry.");
    };
  };
};
public shared ({ caller }) func adminDeleteEntry(key : Key, commentCanisterId : Text, userCanisterId : Text) : async Result.Result<(Text, ?Entry), Text> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let maybeEntry : ?Entry = entryStorage.get(key);

  switch (maybeEntry) {
    case (?isEntry) {

      let removed = entryStorage.remove(key);
      if (isEntry.pressRelease) {
        let activited = commentCanister.addAdminActivity(caller, key, #delete_pressRelease, isEntry.title);
        return #ok("PressRelease deleted successfully.", removed);

      } else if (isEntry.isPodcast) {
        let activited = commentCanister.addAdminActivity(caller, key, #delete_podcats, isEntry.title);
        return #ok("podcast deleted successfully.", removed);

      } else {
        let activited = commentCanister.addAdminActivity(caller, key, #delete_article, isEntry.title);
        return #ok("Article deleted successfully.", removed);

      };

    };
    case (null) {
      return #err("Did not find Entry.");
    };
  };
};
public shared ({ caller }) func likeWeb3(key : Key, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Bool), (Text)> {
  assert not Principal.isAnonymous(caller);
  // let userCanister = actor (userCanisterId) : actor {
  //   add_reward : (caller : Principal, like_reward : Nat) -> async Bool;
  //   check_user_exists : (caller : Principal) -> async Bool;

  // };
  let commentCanister = actor (commentCanisterId) : actor {
    addActivity : (user : Principal, target : Text, activityType : ActivityType, title : Text) -> async Bool;
  };

  // let isUser = await userCanister.check_user_exists(caller);
  // assert isUser;

  let maybeEntry = web3Storage.get(key);
  switch (maybeEntry) {
    case (?web3) {
      var tempLikedUsers = web3.likedUsers;
      var isLiked = Array.find<Principal>(tempLikedUsers, func x = x == caller);

      switch (isLiked) {
        case (?liked) {
          var newLikedUsers : [Principal] = [];
          for (item : Principal in tempLikedUsers.vals()) {
            if (item != caller) {
              newLikedUsers := Array.append<Principal>(newLikedUsers, [item]);
            };
          };
          var newLikesCount = 0;
          if (web3.likes > 0) {
            newLikesCount := web3.likes -1;
          };
          let tempWeb3 : Web3 = {
            company = web3.company;
            shortDescription = web3.shortDescription;
            founderName = web3.founderName;
            founderDetail = web3.founderDetail;
            founderImage = web3.founderImage;
            companyBanner = web3.companyBanner;
            catagory = web3.catagory;
            creation_time = web3.creation_time;
            user = web3.user;
            status = web3.status;
            likes = newLikesCount;
            likedUsers = newLikedUsers;
            companyUrl = web3.companyUrl;
            facebook = web3.facebook;
            instagram = web3.instagram;
            linkedin = web3.linkedin;
            companyDetail = web3.companyDetail;
            companyLogo = web3.companyLogo;
            discord = web3.discord;
            telegram = web3.telegram;
            twitter = web3.twitter;
            views = web3.views;
            articleCount = web3.articleCount;
            podcastCount = web3.podcastCount;
            pressReleaseCount = web3.pressReleaseCount;
            totalCount = web3.totalCount;
            isStatic = web3.isStatic;
            founderEmail = web3.founderEmail;

          };
          let newEntry = web3Storage.replace(key, tempWeb3);
          #ok("directory Unliked Successfully", false);
          // #err("Article Already Liked", false);
        };
        case (null) {
          let newLikedUsers = Array.append(tempLikedUsers, [caller]);
          let tempWeb3 : Web3 = {
            company = web3.company;
            shortDescription = web3.shortDescription;
            founderName = web3.founderName;
            founderDetail = web3.founderDetail;
            founderImage = web3.founderImage;
            companyBanner = web3.companyBanner;
            catagory = web3.catagory;
            creation_time = web3.creation_time;
            user = web3.user;
            status = web3.status;
            likes = web3.likes +1;
            likedUsers = newLikedUsers;
            companyUrl = web3.companyUrl;
            facebook = web3.facebook;
            instagram = web3.instagram;
            linkedin = web3.linkedin;
            companyDetail = web3.companyDetail;
            companyLogo = web3.companyLogo;
            discord = web3.discord;
            telegram = web3.telegram;
            twitter = web3.twitter;
            views = web3.views;
            articleCount = web3.articleCount;
            podcastCount = web3.podcastCount;
            pressReleaseCount = web3.pressReleaseCount;
            totalCount = web3.totalCount;
            isStatic = web3.isStatic;
            founderEmail = web3.founderEmail;

          };
          let newEntry = web3Storage.replace(key, tempWeb3);
          // commentCanister.addActivity(caller,key,#like_web3)
          let activited = commentCanister.addActivity(caller, key, #like_web3, web3.company);
          #ok("directory Liked Successfully", true);
        };
      };

    };
    case (null) {
      #err("No directory Found")

    };
  };
};
// to verify and unverfy web3
public shared ({ caller }) func verifyWeb3(key : Key, userCanisterId : Text, commentCanisterId : Text, isVerify : Bool) : async Result.Result<(Text, Bool), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let maybeEntry = web3Storage.get(key);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  switch (maybeEntry) {
    case (?web3) {
      var tempstatus : Web3Status = #un_verfied;
      if (isVerify) {
        tempstatus := #verfied;
      };
      let tempWeb3 : Web3 = {
        company = web3.company;
        shortDescription = web3.shortDescription;
        founderName = web3.founderName;
        founderDetail = web3.founderDetail;
        founderImage = web3.founderImage;
        companyBanner = web3.companyBanner;
        catagory = web3.catagory;
        creation_time = web3.creation_time;
        user = web3.user;
        status = tempstatus;
        likes = web3.likes;
        likedUsers = web3.likedUsers;
        companyUrl = web3.companyUrl;
        facebook = web3.facebook;
        instagram = web3.instagram;
        linkedin = web3.linkedin;
        companyDetail = web3.companyDetail;
        companyLogo = web3.companyLogo;
        discord = web3.discord;
        telegram = web3.telegram;
        twitter = web3.twitter;
        views = web3.views;
        articleCount = web3.articleCount;
        podcastCount = web3.podcastCount;
        pressReleaseCount = web3.pressReleaseCount;
        totalCount = web3.totalCount;
        isStatic = web3.isStatic;
        founderEmail = web3.founderEmail;

      };
      let newEntry = web3Storage.replace(key, tempWeb3);
      let activited = commentCanister.addAdminActivity(caller, key, #verify_web3, web3.company);

      let countIncrease = await update_count_category(web3.catagory, "Directory");

      return #ok("directory verified Successfully", true);

    };
    case (null) {
      #err("No directory Found")

    };
  };
};
public query ({ caller }) func getUserWeb3List(inputCategory : Text, search : Text, startIndex : Nat, length : Nat) : async {
  web3List : [(Key, Web3)];
  amount : Nat;
} {
  assert not Principal.isAnonymous(caller);
  //   let userCanister = actor (userCanisterId) : actor {
  //   check_user_exists : (caller : Principal) -> async Bool;
  // };
  // let isUser = await userCanister.check_user_exists(caller);
  var web3List = Map.HashMap<Key, Web3>(0, Text.equal, Text.hash);

  for ((key, web3) in web3Storage.entries()) {

    if (web3.user == caller) {

      if ((inputCategory == "")) {

        web3List.put(key, web3);

      } else if (inputCategory == web3.catagory) {

        web3List.put(key, web3);

      };

    };
  };
  let web3Array = Iter.toArray(web3List.entries());
  return Web3StoreHelper.searchSortList(web3List, search, startIndex, length, getModificationdate);

};
public query ({ caller }) func getWeb3ListOfAllUsers(inputCategory : Text, search : Text, startIndex : Nat, length : Nat) : async {
  web3List : [(Key, Web3)];
  amount : Nat;
} {

  var web3List = Map.HashMap<Key, Web3>(0, Text.equal, Text.hash);

  for ((key, web3) in web3Storage.entries()) {
    let status = web3.status;
    let shouldSend = shouldSendWeb3(status);
    if (shouldSend) {

      if ((inputCategory == "All")) {

        web3List.put(key, web3);

      } else if (inputCategory == web3.catagory) {
        web3List.put(key, web3);
      };

    };

  };
  let web3Array = Iter.toArray(web3List.entries());
  let tempStoreage = Web3StoreHelper.searchSortList(web3List, search, startIndex, length, getModificationdate);

};
// in this api we will send web3 comapny name and its id
public query ({ caller }) func getWeb3List(inputCategory : Text, search : Text, startIndex : Nat, length : Nat) : async {
  web3List : [(Key, Web3List)];
  amount : Nat;
} {
  assert not Principal.isAnonymous(caller);
  //   let userCanister = actor (userCanisterId) : actor {
  //   check_user_exists : (caller : Principal) -> async Bool;
  // };
  // let isUser = await userCanister.check_user_exists(caller);
  var web3List = Map.HashMap<Key, Web3List>(0, Text.equal, Text.hash);

  for ((key, web3) in web3Storage.entries()) {
    let status = web3.status;
    let shouldSend = shouldSendWeb3(status);
    if (shouldSend) {

      let web3Item : Web3List = {
        company = web3.company;
        catagory = web3.catagory;
        creation_time = web3.creation_time;
        views = web3.views;
        articleCount = web3.articleCount;
        podcastCount = web3.podcastCount;
        pressReleaseCount = web3.pressReleaseCount;
        totalCount = web3.totalCount;
        isStatic = web3.isStatic;
        founderEmail = web3.founderEmail;

      };
      if ((inputCategory == "")) {

        web3List.put(key, web3Item);

      } else if (inputCategory == web3Item.catagory) {

        web3List.put(key, web3Item);

      };
    };
  };
  let web3Array = Iter.toArray(web3List.entries());
  return Web3StoreHelper.searchSortListWeb3(web3List, search, startIndex, length, getModificationdate);

};

public query func getPendingWeb3List(length : Nat) : async [(Key, Web3)] {
  var pendingWeb3 = Map.fromIter<Text, Web3>(stable_web3.vals(), stable_web3.size(), Text.equal, Text.hash);
  for ((key, entry) in web3Storage.entries()) {
    switch (entry.status) {
      case (#un_verfied) {
        pendingWeb3.put(key, entry);

      };
      case (_) {

      };
    };
  };
  let entryArray = Iter.toArray(pendingWeb3.entries());

  let sortedArray = Web3StoreHelper.sortEntriesByLatest(entryArray, getModificationdate);
  let size = sortedArray.size();
  let startIndex = 0;
  var paginatedArray : [(Key, Web3)] = [];
  let itemsPerPage = 10;

  if (size > startIndex and size > (length + startIndex) and length != 0) {
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, startIndex, length);
  } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, startIndex, itemsPerPage);

  } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
    let amount : Nat = size - startIndex;
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, startIndex, amount);

  } else if (size > itemsPerPage) {
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, 0, itemsPerPage);
  } else {
    paginatedArray := sortedArray;
  };
  return paginatedArray;
};
public query func getApprovedWeb3List(length : Nat) : async [(Key, Web3)] {
  var approvedWeb3 = Map.fromIter<Text, Web3>(stable_web3.vals(), stable_web3.size(), Text.equal, Text.hash);
  for ((key, entry) in web3Storage.entries()) {
    switch (entry.status) {
      case (#verfied) {
        approvedWeb3.put(key, entry);

      };
      case (_) {

      };
    };

  };
  let entryArray = Iter.toArray(approvedWeb3.entries());

  let sortedArray = Web3StoreHelper.sortEntriesByLatest(entryArray, getModificationdate);
  let size = sortedArray.size();
  let startIndex = 0;
  var paginatedArray : [(Key, Web3)] = [];
  let itemsPerPage = 10;

  if (size > startIndex and size > (length + startIndex) and length != 0) {
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, startIndex, length);
  } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, startIndex, itemsPerPage);

  } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
    let amount : Nat = size - startIndex;
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, startIndex, amount);

  } else if (size > itemsPerPage) {
    paginatedArray := Array.subArray<(Key, Web3)>(sortedArray, 0, itemsPerPage);
  } else {
    paginatedArray := sortedArray;
  };
  return paginatedArray;
};

public shared ({ caller }) func update_reward(userCanisterId : Text, inputReward : RewardConfig) : async RewardConfig {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    saveRewardValuesChangerInterCanister : (changer : Principal, inputReward : RewardConfig, oldReward : RewardConfig) -> ();

  };
  assert await userCanister.entry_require_permission(caller, #assign_role);
  let total = inputReward.master + inputReward.platform + inputReward.admin;
  assert total == 100;
  let oldReward = reward_config;

  reward_config := inputReward;
  let res = userCanister.saveRewardValuesChangerInterCanister(caller, inputReward, oldReward);

  return reward_config;
};
public shared ({ caller }) func update_like_reward(userCanisterId : Text, inputReward : LikeReward) : async LikeReward {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    saveRewardValuesChangers : (changer : Principal, newValue : Nat, oldValue : Nat, rewardType : Text) -> ();

  };
  assert await userCanister.entry_require_permission(caller, #assign_role);
  assert like_reward < 100000000;
  let tempOldReward = like_reward;

  like_reward := inputReward;
  let res = userCanister.saveRewardValuesChangers(caller, inputReward, tempOldReward, "d");

  return like_reward;
};

public shared ({ caller }) func add_category(category : InputCategory, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Category), Text> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let categoryId = EntryType.generateNewRemoteObjectId();

  assert category.name.size() <= MAX_CATEGORY_NAME_CHARS;
  assert category.name.size() >= 1;

  assert category.slug.size() <= MAX_CATEGORY_SLUG_CHARS;
  assert category.slug.size() >= 1;

  assert category.description.size() <= MAX_CATEGORY_DESCRIPTION_CHARS;
  assert category.description.size() >= 1;
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  var tempChild = 0;
  var isChild = false;
  switch (category.parentCategoryId) {
    case (?parentCategoryId) {

      assert parentCategoryId.size() <= MAX_CATEGORY_DESCRIPTION_CHARS;
      assert parentCategoryId.size() >= 1;

      let maybeParentCategory = categoryStorage.get(parentCategoryId);
      switch (maybeParentCategory) {
        case (?parentCategory) {
          isChild := true;
          let isChildren = parentCategory.children;
          var newChildrens : [CategoryId] = [];

          switch (isChildren) {
            case (?oldChildrens) {
              newChildrens := Array.append<CategoryId>([categoryId], oldChildrens);
            };
            case (null) {
              newChildrens := [categoryId];
            };
          };
          let updatedParent : Category = {
            name = parentCategory.name;
            slug = parentCategory.slug;
            description = parentCategory.description;
            logo = parentCategory.logo;
            banner = parentCategory.banner;
            isChild = parentCategory.isChild;
            children = ?newChildrens;
            user = parentCategory.user;
            creation_time = parentCategory.creation_time;
            parentCategoryId = parentCategory.parentCategoryId;
            articleCount = parentCategory.articleCount;
            podcastCount = parentCategory.podcastCount;
            eventsCount = parentCategory.eventsCount;
            directoryCount = parentCategory.directoryCount;
            pressReleaseCount = parentCategory.pressReleaseCount;
            totalCount = parentCategory.totalCount;
          };
          let newParent = categoryStorage.replace(parentCategoryId, updatedParent)
          // let grandParents = parentCategory.child;
          // tempChild := grandParents + 1;
        };
        case (null) {
          return #err("Error while creating category");
        };
      };
    };
    case (null) {

    };
  };
  let currentDate = getCurrentDate();
  let newCategory : Category = {
    name = category.name;
    slug = category.slug;
    description = category.description;
    logo = category.logo;
    banner = category.banner;
    parentCategoryId = category.parentCategoryId;
    user = caller;
    creation_time = currentDate;
    isChild = isChild;
    children = null;
    articleCount = 0;
    podcastCount = 0;
    eventsCount = 0;
    directoryCount = 0;
    pressReleaseCount = 0;
    totalCount = 0;
  };
  categoryStorage.put(categoryId, newCategory);
  let activity = commentCanister.addAdminActivity(caller, categoryId, #add_category, category.name);
  return #ok("Created Category", newCategory);
};
public shared ({ caller }) func update_category(category : InputCategory, categoryId : CategoryId, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Category), Text> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  // let categoryId = EntryType.generateNewRemoteObjectId();

  assert category.name.size() <= MAX_CATEGORY_NAME_CHARS;
  assert category.name.size() >= 1;

  assert category.slug.size() <= MAX_CATEGORY_SLUG_CHARS;
  assert category.slug.size() >= 1;

  assert category.description.size() <= MAX_CATEGORY_DESCRIPTION_CHARS;
  assert category.description.size() >= 1;

  var tempChild = 0;
  var isChild = false;
  let isOldCategory = categoryStorage.get(categoryId);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  switch (category.parentCategoryId) {
    case (?parentCategoryId) {
      assert parentCategoryId.size() <= MAX_CATEGORY_DESCRIPTION_CHARS;
      assert parentCategoryId.size() >= 1;
      let maybeParentCategory = categoryStorage.get(parentCategoryId);
      switch (isOldCategory) {
        case (?oldCategory) {
          switch (oldCategory.parentCategoryId) {
            case (?oldParent) {
              if (oldParent != parentCategoryId) {
                return #err("Can't update parent of a category");
              };
            };
            case (null) {};
          };
        };
        case (null) {
          return #err("Not Allowed");
        };
      };
      switch (maybeParentCategory) {
        case (?parentCategory) {
          isChild := true;
          let isChildren = parentCategory.children;
          var newChildrens : [CategoryId] = [];
          switch (isChildren) {
            case (?oldChildrens) {
              newChildrens := Array.append<CategoryId>([categoryId], oldChildrens);
            };
            case (null) {
              newChildrens := [categoryId];
            };
          };
          let updatedParent : Category = {
            name = parentCategory.name;
            slug = parentCategory.slug;
            description = parentCategory.description;
            logo = parentCategory.logo;
            banner = parentCategory.banner;
            isChild = parentCategory.isChild;
            children = ?newChildrens;
            user = parentCategory.user;
            creation_time = parentCategory.creation_time;
            parentCategoryId = parentCategory.parentCategoryId;
            articleCount = parentCategory.articleCount;
            podcastCount = parentCategory.podcastCount;
            eventsCount = parentCategory.eventsCount;
            directoryCount = parentCategory.directoryCount;
            pressReleaseCount = parentCategory.pressReleaseCount;
            totalCount = parentCategory.totalCount;
          };
          let modificationDate = getCurrentDate();
          var updateMod = updateModificationDate(parentCategoryId, modificationDate, parentCategory.creation_time);
          let newParent = categoryStorage.replace(parentCategoryId, updatedParent);

          // let grandParents = parentCategory.child;
          // tempChild := grandParents + 1;
        };
        case (null) {
          return #err("Error while updating category");
        };
      };
    };
    case (null) {};
  };

  switch (isOldCategory) {
    case (?oldCategory) {

      let newCategory : Category = {
        name = category.name;
        slug = category.slug;
        description = category.description;
        logo = category.logo;
        banner = category.banner;
        parentCategoryId = category.parentCategoryId;
        user = oldCategory.user;
        creation_time = oldCategory.creation_time;
        isChild = isChild;
        children = oldCategory.children;
        articleCount = oldCategory.articleCount;
        podcastCount = oldCategory.podcastCount;
        eventsCount = oldCategory.eventsCount;
        directoryCount = oldCategory.directoryCount;
        pressReleaseCount = oldCategory.pressReleaseCount;
        totalCount = oldCategory.totalCount;
      };
      let added = categoryStorage.replace(categoryId, newCategory);
      let modificationDate = getCurrentDate();
      var updateMod = updateModificationDate(categoryId, modificationDate, oldCategory.creation_time);
      let activity = commentCanister.addAdminActivity(caller, categoryId, #edit_category, category.name);

      return #ok("Updated Category", newCategory);
    };
    case (null) {
      return #err("Not Allowed");
    };
  };

};

public shared ({ caller }) func delete_category(categoryId : CategoryId, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, ?Category), Text> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  // let categoryId = EntryType.generateNewRemoteObjectId();
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let isOldCategory = categoryStorage.get(categoryId);

  switch (isOldCategory) {
    case (?oldCategory) {
      switch (oldCategory.children) {
        case (?hadChildren) {
          return #err("You can not delete a parent category");
        };
        case (null) {};

      };
      switch (oldCategory.parentCategoryId) {
        case (?parentCategoryId) {
          let maybeParentCategory = categoryStorage.get(parentCategoryId);
          switch (maybeParentCategory) {
            case (?parentCategory) {
              let isChildren = parentCategory.children;
              var newChildrens : ?[CategoryId] = null;

              switch (isChildren) {
                case (?oldChildrens) {
                  newChildrens := ?Array.filter<CategoryId>(oldChildrens, func x = x != categoryId);
                  switch (newChildrens) {
                    case (?new) {
                      if (new.size() == 0) {
                        newChildrens := null;
                      };
                    };
                    case (null) {};
                  };
                };
                case (null) {
                  newChildrens := null;
                };
              };
              let updatedParent : Category = {
                name = parentCategory.name;
                slug = parentCategory.slug;
                description = parentCategory.description;
                logo = parentCategory.logo;
                banner = parentCategory.banner;
                isChild = parentCategory.isChild;
                children = newChildrens;
                user = parentCategory.user;
                creation_time = parentCategory.creation_time;
                parentCategoryId = parentCategory.parentCategoryId;
                articleCount = parentCategory.articleCount;
                podcastCount = parentCategory.podcastCount;
                eventsCount = parentCategory.eventsCount;
                directoryCount = parentCategory.directoryCount;
                pressReleaseCount = parentCategory.pressReleaseCount;
                totalCount = parentCategory.totalCount;

              };
              let newParent = categoryStorage.replace(parentCategoryId, updatedParent)
              // let grandParents = parentCategory.child;
              // tempChild := grandParents + 1;
            };
            case (null) {
              return #err("Error while creating category");
            };
          };
        };
        case (null) {

        };
      };
      let added = categoryStorage.remove(categoryId);
      let activit = commentCanister.addAdminActivity(caller, categoryId, #delete_category, oldCategory.name);
      return #ok("Deleted Category", added);
    };
    case (null) {
      return #err("Not Allowed");
    };
  };

};
/*
get_categories use to get top category list
@parms {search : Text, startIndex : Nat, length : Nat, isParentOnly : Bool}
@return {    entries : TopWeb3Categories;
    amount : Nat;}

  */
public query ({ caller }) func get_categories(search : Text, startIndex : Nat, length : Nat, isParentOnly : Bool) : async {
  entries : TopWeb3Categories;
  amount : Nat;
} {
  let categoryArray = Iter.toArray(categoryStorage.entries());
  let parentCategories = EntryStoreHelper.searchCategories(categoryArray, search, startIndex, length, isParentOnly);
  return parentCategories;

};
public query ({ caller }) func get_list_categories(search : Text, startIndex : Nat, length : Nat, isParentOnly : Bool) : async {
  entries : ListCategories;
  amount : Nat;
} {
  let categoryArray = Iter.toArray(categoryStorage.entries());
  let parentCategories = EntryStoreHelper.searchListCategories(categoryArray, search, startIndex, length, isParentOnly, getModificationdate);
  return parentCategories;

};
public shared ({ caller }) func update_count_category(categoryId : CategoryId, typeCount : Text) : async Result.Result<(Text, Bool), Text> {
  assert not Principal.isAnonymous(caller);

  let maybeCategory = categoryStorage.get(categoryId);
  switch (maybeCategory) {
    case (?isCategory) {
      var tempArticleCount = isCategory.articleCount;
      var tempPodcastCount = isCategory.podcastCount;
      var tempEventCount = isCategory.eventsCount;
      var temppressReleaseCount = isCategory.pressReleaseCount;
      var temptotalCount = isCategory.totalCount;

      var tempDirectoryCount = isCategory.directoryCount;
      if (typeCount == "Article") {
        tempArticleCount += 1;
        temptotalCount += 1;

      };
      if (typeCount == "Podcast") {
        tempPodcastCount += 1;
        temptotalCount += 1;

      };
      if (typeCount == "Event") {
        tempEventCount += 1;
        temptotalCount += 1;

      };
      if (typeCount == "Directory") {
        tempDirectoryCount += 1;
        temptotalCount += 1;

      };
      if (typeCount == "pressRelease") {
        temppressReleaseCount += 1;
        temptotalCount += 1;

      };
      let updatedCategory : Category = {
        name = isCategory.name;
        slug = isCategory.slug;
        description = isCategory.description;
        logo = isCategory.logo;
        banner = isCategory.banner;
        isChild = isCategory.isChild;
        children = isCategory.children;
        user = isCategory.user;
        creation_time = isCategory.creation_time;
        parentCategoryId = isCategory.parentCategoryId;
        articleCount = tempArticleCount;
        podcastCount = tempPodcastCount;
        eventsCount = tempEventCount;
        directoryCount = tempDirectoryCount;
        pressReleaseCount = temppressReleaseCount;
        totalCount = temptotalCount;

      };
      let update = categoryStorage.replace(categoryId, updatedCategory);
      return #ok("Count Increate successfully", true)

    };
    case (null) {
      return #err("Did not find Category.");
    };
  };

};
public query ({ caller }) func child_to_category(childArray : [CategoryId]) : async ListCategories {
  var nestedCategoriesMap = Map.HashMap<CategoryId, ListCategory>(0, Text.equal, Text.hash);
  for (id in childArray.vals()) {
    let isChildCategory = categoryStorage.get(id);
    switch (isChildCategory) {
      case (?childCategory) {
        // var nestedCategories : ?NestedCategories = ?[];
        var hasMore = false;

        let newChild : ListCategory = {
          name = childCategory.name;
          slug = childCategory.slug;
          description = childCategory.description;
          creation_time = childCategory.creation_time;
          user = childCategory.user;
          parentCategoryId = childCategory.parentCategoryId;
          children = childCategory.children;
          isChild = childCategory.isChild;
          articleCount = childCategory.articleCount;
          podcastCount = childCategory.podcastCount;
          eventsCount = childCategory.eventsCount;
          directoryCount = childCategory.directoryCount;
          pressReleaseCount = childCategory.pressReleaseCount;
          totalCount = childCategory.totalCount;
          logo = childCategory.logo;
        };
        nestedCategoriesMap.put(id, newChild);

      };
      case (null) {

      };
    };
  };
  return Iter.toArray(nestedCategoriesMap.entries());
};
public query ({ caller }) func get_category(categoryId : Text) : async ?Category {
  let isCategory = categoryStorage.get(categoryId);
  return isCategory;
};
public query ({ caller }) func get_categories_by_name(categories : [Text]) : async [(CategoryId, Category)] {
  var refinedCategories : [(CategoryId, Category)] = [];
  for ((key, category) in categoryStorage.entries()) {
    for (categoryName in categories.vals()) {
      let category1Name : Text = Text.map(category.name, Prim.charToLower);
      let category2Name : Text = Text.map(categoryName, Prim.charToLower);
      if (category1Name == category2Name) {
        refinedCategories := Array.append([(key, category)], refinedCategories);
      };
    };
  };
  return refinedCategories;
};

public query ({ caller }) func get_list_category(categoryId : Text) : async ?ListCategory {
  let isCategory = categoryStorage.get(categoryId);
  return isCategory;
};
public shared ({ caller }) func addEvent(inputEvent : InputEvent, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, EventId), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    check_user_exists : (caller : Principal) -> async Bool;
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;

  };

  let isUser = await userCanister.check_user_exists(caller);
  assert isUser;
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  // Define maximum character limits for each field

  // Assertion checks for each field
  assert inputEvent.title.size() <= MAX_TITLE_CHARS;
  assert inputEvent.organiser.size() <= MAX_NAME_CHARS;
  assert inputEvent.shortDescription.size() <= MAX_SHORT_DESCRIPTION_CHARS;
  assert inputEvent.location.size() <= MAX_LOCATION_CHARS;
  assert inputEvent.country.size() <= MAX_COUNTRY_CHARS;
  assert inputEvent.city.size() <= MAX_CITY_CHARS;
  assert inputEvent.website.size() <= MAX_WEBSITE_CHARS;
  assert inputEvent.category.size() <= MAX_CATEGORY_CHARS;
  assert inputEvent.tags.size() <= MAX_TAGS_CHARS;
  assert inputEvent.linkdin.size() <= MAX_LINKEDIN_CHARS;
  assert inputEvent.facebook.size() <= MAX_LINKEDIN_CHARS;
  assert inputEvent.telegram.size() <= MAX_LINKEDIN_CHARS;
  assert inputEvent.instagram.size() <= MAX_LINKEDIN_CHARS;
  assert inputEvent.twitter.size() <= MAX_LINKEDIN_CHARS;
  assert inputEvent.seoTitle.size() <= MAX_SEO_TITLE_CHARS;
  assert inputEvent.seoSlug.size() <= MAX_SEO_SLUG_CHARS;
  assert inputEvent.seoDescription.size() <= MAX_SEO_DESCRIPTION_CHARS;
  assert inputEvent.seoExcerpt.size() <= MAX_SEO_EXCERPT_CHARS;
  assert inputEvent.discountTicket.size() <= MAX_LINKEDIN_CHARS;

  let eventId = EntryType.generateNewRemoteObjectId();
  let currentDate = getCurrentDate();
  let newEvent : Event = {
    title = inputEvent.title;
    shortDescription = inputEvent.shortDescription;
    description = inputEvent.description;
    date = inputEvent.date;
    endDate = inputEvent.endDate;
    location = inputEvent.location;
    country = inputEvent.country;
    city = inputEvent.city;
    website = inputEvent.website;
    category = inputEvent.category;
    tags = inputEvent.tags;
    linkdin = inputEvent.linkdin;
    image = inputEvent.image;
    creation_time = currentDate;
    user = caller;
    seoTitle = inputEvent.seoTitle;
    seoSlug = inputEvent.seoSlug;
    seoDescription = inputEvent.seoDescription;
    seoExcerpt = inputEvent.seoExcerpt;
    month = inputEvent.month;
    facebook = inputEvent.facebook;
    telegram = inputEvent.telegram;
    instagram = inputEvent.instagram;
    twitter = inputEvent.twitter;
    organiser = inputEvent.organiser;
    freeTicket = inputEvent.freeTicket;
    applyTicket = inputEvent.applyTicket;
    lat = inputEvent.lat;
    lng = inputEvent.lng;
    isStatic = false;
    discountTicket = inputEvent.discountTicket;
  };
  let ans = eventStorage.put(eventId, newEvent);

  let modificationDate = currentDate;

  var res = updateModificationDate(eventId, modificationDate, modificationDate);

  for (cat in inputEvent.category.vals()) {
    if (cat != "") {

      let countIncrease = await update_count_category(cat, "Event");
    };
  };
  let addactivity = commentCanister.addAdminActivity(caller, eventId, #add_event, inputEvent.title);

  return #ok("Event created successfully", eventId);
};
public shared ({ caller }) func updateEvent(inputEvent : InputEvent, userCanisterId : Text, commentCanisterId : Text, eventId : Text) : async Result.Result<(Text, EventId), (Text)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    check_user_exists : (caller : Principal) -> async Bool;
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;

  };

  let isUser = await userCanister.check_user_exists(caller);
  assert isUser;
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  // Define maximum character limits for each field
  let mayevent = eventStorage.get(eventId);
  switch (mayevent) {
    case (?isEvent) {
      // Assertion checks for each field
      assert inputEvent.title.size() <= MAX_TITLE_CHARS;
      assert inputEvent.organiser.size() <= MAX_NAME_CHARS;
      assert inputEvent.shortDescription.size() <= MAX_SHORT_DESCRIPTION_CHARS;
      assert inputEvent.location.size() <= MAX_LOCATION_CHARS;
      assert inputEvent.country.size() <= MAX_COUNTRY_CHARS;
      assert inputEvent.city.size() <= MAX_CITY_CHARS;
      assert inputEvent.website.size() <= MAX_WEBSITE_CHARS;
      assert inputEvent.category.size() <= MAX_CATEGORY_CHARS;
      assert inputEvent.tags.size() <= MAX_TAGS_CHARS;
      assert inputEvent.linkdin.size() <= MAX_LINKEDIN_CHARS;
      assert inputEvent.facebook.size() <= MAX_LINKEDIN_CHARS;
      assert inputEvent.telegram.size() <= MAX_LINKEDIN_CHARS;
      assert inputEvent.instagram.size() <= MAX_LINKEDIN_CHARS;
      assert inputEvent.twitter.size() <= MAX_LINKEDIN_CHARS;
      assert inputEvent.seoTitle.size() <= MAX_SEO_TITLE_CHARS;
      assert inputEvent.seoSlug.size() <= MAX_SEO_SLUG_CHARS;
      assert inputEvent.seoDescription.size() <= MAX_SEO_DESCRIPTION_CHARS;
      assert inputEvent.seoExcerpt.size() <= MAX_SEO_EXCERPT_CHARS;

      let newEvent : Event = {
        title = inputEvent.title;
        shortDescription = inputEvent.shortDescription;
        description = inputEvent.description;
        date = inputEvent.date;
        endDate = inputEvent.endDate;
        location = inputEvent.location;
        country = inputEvent.country;
        city = inputEvent.city;
        website = inputEvent.website;
        category = inputEvent.category;
        tags = inputEvent.tags;
        linkdin = inputEvent.linkdin;
        image = inputEvent.image;
        creation_time = isEvent.creation_time;
        user = isEvent.user;
        seoTitle = inputEvent.seoTitle;
        seoSlug = inputEvent.seoSlug;
        seoDescription = inputEvent.seoDescription;
        seoExcerpt = inputEvent.seoExcerpt;
        month = inputEvent.month;
        facebook = inputEvent.facebook;
        telegram = inputEvent.telegram;
        instagram = inputEvent.instagram;
        twitter = inputEvent.twitter;
        organiser = inputEvent.organiser;
        freeTicket = inputEvent.freeTicket;
        applyTicket = inputEvent.applyTicket;
        lat = inputEvent.lat;
        lng = inputEvent.lng;
        isStatic = isEvent.isStatic;
        discountTicket = inputEvent.discountTicket;

      };
      let currentDate = getCurrentDate();
      let modificationDate = currentDate;
      var res = updateModificationDate(eventId, modificationDate, isEvent.creation_time);

      let resp = eventStorage.replace(eventId, newEvent);
      let addactivity = commentCanister.addAdminActivity(caller, eventId, #edit_event, inputEvent.title);

      for (cat in inputEvent.category.vals()) {
        if (cat != "") {

          let countIncrease = await update_count_category(cat, "Event");
        };
      };

      return #ok("Event edited successfully", eventId);
    };
    case (null) {
      return #err("Event not found");

    };
  };

};
public query ({ caller }) func get_events(search : Text, startIndex : Nat, length : Nat, month : ?Nat, country : ?Text, city : ?Text, tagString : Text) : async {
  entries : Events;
  amount : Nat;
} {
  let eventsArray = Iter.toArray(eventStorage.entries());
  let parentCategories = EntryStoreHelper.searchEvents(eventsArray, search, startIndex, length, #all, month, country, city, tagString);
  return parentCategories;
};
public query ({ caller }) func getEventsOfWeb3(search : Text, startIndex : Nat, length : Nat, month : ?Nat, country : ?Text, city : ?Text, tagString : Text,directoryId : Text) : async {
  entries : Events;
  amount : Nat;
} {
   var nonDraftedEntries = Map.fromIter<Key, Event>(stable_events.vals(), stable_events.size(), Text.equal, Text.hash);

  for ((key, event) in eventStorage.entries()) {
    if (event.organiser == directoryId) {
     nonDraftedEntries.put(key,event);
   

    };
  };
  let eventsArray = Iter.toArray(nonDraftedEntries.entries());
  let parentCategories = EntryStoreHelper.searchEvents(eventsArray, search, startIndex, length, #all, month, country, city, tagString);
  return parentCategories;
};
public query ({ caller }) func get_upcoming_events(search : Text, startIndex : Nat, length : Nat, status : EventStatus, month : ?Nat, country : ?Text, city : ?Text, tagString : Text) : async {
  entries : Events;
  amount : Nat;
} {
  let eventsArray = Iter.toArray(eventStorage.entries());
  let parentCategories = EntryStoreHelper.searchEvents(eventsArray, search, startIndex, length, status, month, country, city, tagString);
  return parentCategories;
};
public query ({ caller }) func get_event(eventId : Text) : async ?Event {
  return eventStorage.get(eventId);
};
public shared ({ caller }) func delete_event(eventId : Text, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let commentCanister = actor (commentCanisterId) : actor {
    addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
  };
  let mayEvent = eventStorage.get(eventId);
  switch (mayEvent) {
    case (?isevent) {
      let res = eventStorage.remove(eventId);
      let activited = commentCanister.addAdminActivity(caller, eventId, #delete_event, isevent.title);
      #ok("Deleted successfully.", true);
    };
    case (null) {
      return #err("Event not found.", false);
    };
  };
};

// =======  servay ======

public shared ({ caller }) func addServay(input : InputServay, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  let isAdmin = await userCanister.entry_require_permission(caller, #manage_article);
  var creatorOfSurvey : UserId = caller;
  let creatorOfEntry = getCreaterOfEntry(input.entryId);
  switch (creatorOfEntry) {
    case (?creatorOfEntry) {
      if (isAdmin) {
        creatorOfSurvey := creatorOfEntry;

      } else if (creatorOfEntry == caller) {
        creatorOfSurvey := creatorOfEntry;
      };
    };
    case (null) {
      return #err("Entry not found", false);

    };
  };
  var tempReward : ?Nat = null;
  // if (input.rewardPerUser != null and input.shouldRewarded) {
  //   tempReward := input.rewardPerUser;
  // };
  let isEntry = isEntryNotRejected(input.entryId);
  if (not isEntry) {
    return #err("You can  create the survey only on  approved article", false);

  };
  let isCreatedOnThisEntry = isSurveyAlreadyCreated(input.entryId);
  if (isCreatedOnThisEntry) {
    return #err("Survey already created on this Entry", false);

  };
  switch (input.rewardPerUser) {
    case (?isReward) {
      tempReward := input.rewardPerUser;
    };
    case (null) {};
  };
  let currentDate = getCurrentDate();
  var tempQuiz : Servay = {

    title = input.title;
    description = input.description;
    shouldRewarded = input.shouldRewarded;
    rewardPerUser = tempReward;
    isAtive = false;
    creation_time = currentDate;
    createdBy = caller;
    takenBy = [];
    questionCount = 0;
    usersWillGetReward = input.usersWillGetReward;
    attemptsPerUser = input.attemptsPerUser;
    remaningUserCanTakeReward = 0;
    oldRewardPerUser = null;
    entryId = input.entryId;

  };
  let rendomId = Int.toText(Time.now());
  let res = servayStorage.put(rendomId, tempQuiz);
  return #ok("Servay created successfuly", true);
};
public shared ({ caller }) func updateServay(input : InputServay, userCanisterId : Text, key : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  switch (servay) {
    case (?isServay) {

      var tempServay : Servay = {
        title = input.title;
        description = input.description;
        shouldRewarded = input.shouldRewarded;
        rewardPerUser = isServay.rewardPerUser;
        isAtive = false;
        creation_time = isServay.creation_time;
        createdBy = isServay.createdBy;
        takenBy = isServay.takenBy;
        questionCount = isServay.questionCount;
        usersWillGetReward = isServay.usersWillGetReward;
        attemptsPerUser = input.attemptsPerUser;
        remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
        oldRewardPerUser = isServay.oldRewardPerUser;
        entryId = input.entryId;

      };
      let res = servayStorage.replace(key, tempServay);
      let modificationDate = getCurrentDate();
      var update = updateModificationDate(key, modificationDate, isServay.creation_time);
      return #ok("Servay updated successfuly", true);
    };
    case (null) {
      return #err("Servay not found", false);

    };

  };
};
public shared ({ caller }) func delete_servay(key : Text, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };

  let questions = servayQustionsStorage.get(key);
  switch (servay) {
    case (?isServay) {
      let res = servayStorage.remove(key);

    };
    case (null) {
      return #err("Servay not found.", false);
    };
  };
  switch (questions) {
    case (?isExsited) {
      let res = servayQustionsStorage.remove(key);

    };
    case (null) {

    };
  };
  return #ok("Servay deleted successfully", false);

};
public query func getServayById(key : Text) : async ?Servay {
  let servay = servayStorage.get(key);
  switch (servay) {
    case (?isServay) {
      if (isServay.isAtive) {
        return servay;

      } else {
        return null;
      };
    };
    case (null) {
      return null;

    };
  };
};
//servay for admin
public query func getServayById_foradmin(key : Text) : async ?Servay {

  let servay = servayStorage.get(key);
  switch (servay) {
    case (?isServay) {

      return servay;

    };
    case (null) {
      return null;

    };
  };
};
/**

function addMultipleQuestions to add multiple questions in at time in quiz

@param key, inputQuestions, userCanisterId
@returns OK(text,text),ERR(text,text)
**/
public shared ({ caller }) func addMultipleQuestionsToSurvey(key : Text, inputQuestions : [InputServayQuestion], userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let survey = servayStorage.get(key);
  switch (survey) {
    case (?isSurvey) {
      if (isSurvey.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = servayQustionsStorage.get(key);
  var tempQuestionsArray : [ServayQuestion] = [];
  var questioncount = 0;

  switch (questions) {
    case (?isQuestionArray) {
      tempQuestionsArray := isQuestionArray;
    };
    case (null) {

    };
  };
  for (inputQuestion in inputQuestions.vals()) {

    var tempServayQuestion : [ServayQuestionTakenBy] = [];
    let currentDate = getCurrentDate();
    var tempQuestion : ServayQuestion = {
      title = inputQuestion.title;
      options = inputQuestion.options;
      takenBy = tempServayQuestion;
      creation_time = currentDate;
      ifSelected = inputQuestion.ifSelected;

    };

    let isAlready = Array.find<ServayQuestion>(tempQuestionsArray, func q = q.title == inputQuestion.title);
    switch (isAlready) {
      case (?isAlready) {

      };
      case (null) {
        let newQuestions = Array.append<ServayQuestion>(tempQuestionsArray, [tempQuestion]);
        tempQuestionsArray := newQuestions;
        questioncount += 1;

      };

    };

  };

  switch (survey) {
    case (?isSurvey) {
      let tempQuestionCount = isSurvey.questionCount +questioncount;
      var tempServay : Servay = {

        title = isSurvey.title;
        description = isSurvey.description;
        shouldRewarded = isSurvey.shouldRewarded;
        rewardPerUser = isSurvey.rewardPerUser;
        isAtive = isSurvey.isAtive;
        creation_time = isSurvey.creation_time;
        createdBy = isSurvey.createdBy;
        takenBy = isSurvey.takenBy;
        questionCount = tempQuestionCount;
        usersWillGetReward = isSurvey.usersWillGetReward;
        attemptsPerUser = isSurvey.attemptsPerUser;
        remaningUserCanTakeReward = isSurvey.remaningUserCanTakeReward;
        oldRewardPerUser = isSurvey.oldRewardPerUser;
        entryId = isSurvey.entryId;

      };
      let quizUpdate = servayStorage.replace(key, tempServay);
      let questions = servayQustionsStorage.replace(key, tempQuestionsArray);
      return #ok("Questions added to quiz", false);
    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };

};

public shared ({ caller }) func addServayQuestion(key : Text, inputQuestion : InputServayQuestion, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = servayQustionsStorage.get(key);
  switch (questions) {
    case (?questionsList) {
      let newQuestions = Array.find<ServayQuestion>(questionsList, func q = q.title == inputQuestion.title);
      switch (newQuestions) {
        case (?isAlready) {
          return #err("Question with this title already exist", false);

        };
        case (null) {

        };
      };
    };
    case (null) {

    };
  };

  switch (servay) {
    case (?isServay) {
      let tempQuestionCount = isServay.questionCount +1;
      var tempServay : Servay = {

        title = isServay.title;
        description = isServay.description;
        shouldRewarded = isServay.shouldRewarded;
        rewardPerUser = isServay.rewardPerUser;
        isAtive = isServay.isAtive;
        creation_time = isServay.creation_time;
        createdBy = isServay.createdBy;
        takenBy = isServay.takenBy;
        questionCount = tempQuestionCount;
        usersWillGetReward = isServay.usersWillGetReward;
        attemptsPerUser = isServay.attemptsPerUser;
        remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
        oldRewardPerUser = isServay.oldRewardPerUser;
        entryId = isServay.entryId;

      };

      var tempServayQuestion : [ServayQuestionTakenBy] = [];
      let currentDate = getCurrentDate();
      var tempQuestion : ServayQuestion = {
        title = inputQuestion.title;
        options = inputQuestion.options;
        takenBy = tempServayQuestion;
        creation_time = currentDate;
        ifSelected = inputQuestion.ifSelected;

      };
      switch (questions) {
        case (?isQuestionArray) {
          let newQuestions = Array.append<ServayQuestion>(isQuestionArray, [tempQuestion]);
          let questions = servayQustionsStorage.replace(key, newQuestions);

        };
        case (null) {
          let questions = servayQustionsStorage.replace(key, [tempQuestion]);

        };
      };
      let quizUpdate = servayStorage.replace(key, tempServay);

      return #ok("Question added to servay", true);

    };
    case (null) {
      return #err("Servay not found", false);

    };
  };
};

public shared ({ caller }) func updateServayQuestion(key : Text, title : Text, inputQuestion : InputServayQuestion, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = servayQustionsStorage.get(key);

  switch (questions) {
    case (?questionsList) {
      let newQuestions = Array.find<ServayQuestion>(questionsList, func q = q.title == title);

      switch (newQuestions) {
        case (?isAlready) {
          let filtered = Array.filter<ServayQuestion>(questionsList, func q = q.title != title);
          let mayBeExist = Array.find<ServayQuestion>(filtered, func q = q.title == inputQuestion.title);
          switch (mayBeExist) {
            case (?isExist) {
              return #err("Question with this title already exist", false);

            };
            case (null) {

            };
          };
          let currentDate = getCurrentDate();
          var tempQuestion : ServayQuestion = {
            title = inputQuestion.title;
            options = inputQuestion.options;
            takenBy = isAlready.takenBy;
            creation_time = currentDate;
            ifSelected = inputQuestion.ifSelected;
            userSuggestion = [];
          };
          let updatedQuestion = Array.append<ServayQuestion>(filtered, [tempQuestion]);

          let questions = servayQustionsStorage.replace(key, updatedQuestion);

          return #ok("Question updated successfully.", true);

        };
        case (null) {
          return #err("Question not found", false);

        };
      };
    };
    case (null) {
      return #err("Questions not found", false);

    };

  };
};
// get question of servay for admin
public shared ({ caller }) func getQuestionsOfServay_admin(key : Text, search : Text, startIndex : Nat, length : Nat) : async Result.Result<(?Servay, { entries : [ServayQuestion]; amount : Nat }), (Text, Bool)> {

  let servay = servayStorage.get(key);
  var tempQuestion : [ServayQuestion] = [];

  switch (servay) {
    case (?isServay) {

      let questions = servayQustionsStorage.get(key);
      switch (questions) {
        case (?questionsArray) {
          tempQuestion := questionsArray;
          // return #ok(isQuiz, questionsArray);

        };
        case (null) {
          return #ok(servay, { entries = []; amount = 0 });

        };
      };

    };
    case (null) {
      return #err("servay not found", false);

    };
  };
  let resultQuiz = EntryStoreHelper.searchListServayQuestion(tempQuestion, search, startIndex, length);

  return #ok(servay, resultQuiz);

};
// get taken list of each question
public shared ({ caller }) func getAnalysis(key : Text, questionId : Text) : async Result.Result<(Text, Text, [AnalysedData]), (Text, Bool)> {

  let servay = servayStorage.get(key);
  var analysedData : [AnalysedData] = [];
  switch (servay) {
    case (?isServay) {
      let questions = servayQustionsStorage.get(key);
      switch (questions) {
        case (?questionsArray) {
          let findQuestion = Array.find<ServayQuestion>(questionsArray, func q = q.title == questionId);
          switch (findQuestion) {
            case (?isQuestion) {
              var optionsCount = Map.HashMap<Text, Int>(0, Text.equal, Text.hash);

              for (option in isQuestion.options.vals()) {
                optionsCount.put(option, 0);
              };
              for (taken in isQuestion.takenBy.vals()) {
                for (opt in taken.selectedOption.vals()) {
                  var count = optionsCount.get(opt);
                  switch (count) {
                    case (?isCount) {
                      let res = optionsCount.replace(opt, isCount +1);
                    };
                    case (null) {};
                  };

                };

              };
              var index = 0;
              for (opt in isQuestion.options.vals()) {
                var tempCount : Int = 0;

                var getCount = optionsCount.get(opt);
                switch (getCount) {
                  case (?isCount) {
                    tempCount := isCount;
                  };
                  case (null) {

                  };
                };
                var tempResult = {
                  title = opt;
                  count = tempCount;
                };
                analysedData := Array.append<AnalysedData>(analysedData, [tempResult]);
                index += 1;
              };
              let title = isServay.title;
              let questiontitle = isQuestion.title;
              return #ok(title, questiontitle, analysedData);

            };
            case (null) {
              return #err("question not found", false);
            };
          };

        };
        case (null) {
          return #err("questions not found", false);

        };
      };

    };
    case (null) {
      return #err("servay not found", false);

    };
  };

};

//get quiz of spacific entry or all for admin
// activeList valuew will be 0 mean all 1 mean active and 2 mean non active
public shared ({ caller }) func getServayList_for_admin(entryId : ?Text, activeList : Int, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Text, ServaywithTitle)];
  amount : Nat;
} {
  var sortedServay = Map.HashMap<Text, ServaywithTitle>(0, Text.equal, Text.hash);
  var title : Text = "";
  for ((key, servay) in servayStorage.entries()) {

    if (activeList == 1) {
      if (servay.isAtive) {
        switch (entryId) {
          case (?isId) {

            var isSearched = isId == servay.entryId;
            if (isSearched) {
              let maybeEntry = entryStorage.get(servay.entryId);
              switch (maybeEntry) {
                case (?isEntry) {
                  title := isEntry.title;
                  sortedServay.put(key, { servay with entryTitle = title });
                };
                case (null) {};
              };

            };
          };
          case (null) {
            let maybeEntry = entryStorage.get(servay.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedServay.put(key, { servay with entryTitle = title });
              };
              case (null) {};
            };

          };
        };

      };
    } else if (activeList == 2) {
      if (not servay.isAtive) {
        switch (entryId) {
          case (?isId) {
            let searchString = Text.map(isId, Prim.charToLower);
            let id = Text.map(servay.entryId, Prim.charToLower);
            var isSearched = Text.contains(id, #text searchString);
            if (isSearched) {
              let maybeEntry = entryStorage.get(servay.entryId);
              switch (maybeEntry) {
                case (?isEntry) {
                  title := isEntry.title;
                  sortedServay.put(key, { servay with entryTitle = title });
                };
                case (null) {};
              };

            };
          };
          case (null) {
            let maybeEntry = entryStorage.get(servay.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedServay.put(key, { servay with entryTitle = title });
              };
              case (null) {};
            };

          };
        };

      };

    } else {
      switch (entryId) {
        case (?isId) {
          let searchString = Text.map(isId, Prim.charToLower);
          let id = Text.map(servay.entryId, Prim.charToLower);
          var isSearched = Text.contains(id, #text searchString);
          if (isSearched) {
            let maybeEntry = entryStorage.get(servay.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedServay.put(key, { servay with entryTitle = title });
              };
              case (null) {};
            };

          };
        };
        case (null) {
          let maybeEntry = entryStorage.get(servay.entryId);
          switch (maybeEntry) {
            case (?isEntry) {
              title := isEntry.title;
              sortedServay.put(key, { servay with entryTitle = title });
            };
            case (null) {};
          };
        };
      };
    };

  };
  let servayArray = Iter.toArray(sortedServay.entries());
  let resultServay = EntryStoreHelper.searchListServaywithTitle(servayArray, search, startIndex, length, getModificationdate);
  return resultServay;
};
// activeList valuew will be 0 mean all 1 mean active and 2 mean non active
public shared ({ caller }) func getServayList(search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Text, ServayForUser)];
  amount : Nat;
} {  
  var sortedServay = Map.HashMap<Text, ServayForUser>(0, Text.equal, Text.hash);


  for ((key, servay) in servayStorage.entries()) {

    if (servay.isAtive and servay.questionCount > 0) {
      let isTakenTheServay = Array.find<ServayTakenBy>(servay.takenBy, func u = u.user == caller);
      var tempTaken:Bool=false;
      switch(isTakenTheServay){
        case(null){};
        case(?istaken){
tempTaken:=true;
        };
      };
      let tempSurvey: ServayForUser = {
    title =servay.title;
    description =servay.description;
    createdBy =servay.createdBy;
    shouldRewarded =servay.shouldRewarded;
    rewardPerUser =servay.rewardPerUser;
    isAtive =servay.isAtive;
    creation_time =servay.creation_time;
    questionCount =servay.questionCount;
    usersWillGetReward =servay.usersWillGetReward;
    attemptsPerUser =servay.attemptsPerUser;
    remaningUserCanTakeReward =servay.remaningUserCanTakeReward;
    oldRewardPerUser =servay.oldRewardPerUser;
    entryId =servay.entryId;
    isTaken =tempTaken;
  };
          sortedServay.put(key, tempSurvey);



    };

  };
  let servayArray = Iter.toArray(sortedServay.entries());
  let resultServay = EntryStoreHelper.searchListServay(servayArray, search, startIndex, length, getModificationdate);
  return resultServay;
};
// ====== delete servat question====
public shared ({ caller }) func deleteServayQuestion(key : Text, title : Text, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {
      return #err("permission denied", false);
    };
  };
  let questions = servayQustionsStorage.get(key);
  switch (servay) {
    case (?isServay) {

      switch (questions) {
        case (?questionsList) {
          let newQuestions = Array.find<ServayQuestion>(questionsList, func q = q.title == title);
          switch (newQuestions) {
            case (?isAlready) {
              let newQuestions = Array.filter<ServayQuestion>(questionsList, func q = q.title != title);

              var tempQuestionCount = isServay.questionCount -1;
              var tempServay : Servay = {

                title = isServay.title;
                description = isServay.description;
                shouldRewarded = isServay.shouldRewarded;
                rewardPerUser = isServay.rewardPerUser;
                isAtive = isServay.isAtive;
                creation_time = isServay.creation_time;
                createdBy = isServay.createdBy;
                takenBy = isServay.takenBy;
                questionCount = tempQuestionCount;
                usersWillGetReward = isServay.usersWillGetReward;
                attemptsPerUser = isServay.attemptsPerUser;
                remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
                oldRewardPerUser = isServay.oldRewardPerUser;
                entryId = isServay.entryId;
              };
              let questions = servayQustionsStorage.replace(key, newQuestions);
              let tempServayUpdate = servayStorage.replace(key, tempServay);

              return #ok("Question deleted successfully.", true);

            };
            case (null) {
              return #err("Question not found", false);

            };
          };
        };
        case (null) {
          return #err("Question not found", false);

        };

      };
    };
    case (null) {
      return #err("servay not found", false);

    };
  };

};

// this is the function of delete multiple questions from quiz

public shared ({ caller }) func deleteSurveyQuestions(key : Text, titles : [Text], userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  // takes 3 parameters  1)survey id 3) questions id and lats one is canister id
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {
      return #err("permission denied", false);
    };
  };
  let questions = servayQustionsStorage.get(key);
  switch (servay) {
    case (?isServay) {
      switch (questions) {
        case (?questionsList) {
          var tempQuestions = questionsList;
          var count = 0;
          let data = Iter.fromArray(titles);

          for (title in data) {
            let newQuestions = Array.find<ServayQuestion>(tempQuestions, func q = q.title == title);

            switch (newQuestions) {
              case (?isAlready) {
                let newQuestion = Array.filter<ServayQuestion>(tempQuestions, func q = q.title != title);
                count += 1;
                tempQuestions := newQuestion;

              };
              case (null) {

              };
            };
          };
          var tempQuestionCount = isServay.questionCount -count;
          var tempServay : Servay = {

            title = isServay.title;
            description = isServay.description;
            shouldRewarded = isServay.shouldRewarded;
            rewardPerUser = isServay.rewardPerUser;
            isAtive = isServay.isAtive;
            creation_time = isServay.creation_time;
            createdBy = isServay.createdBy;
            takenBy = isServay.takenBy;
            questionCount = tempQuestionCount;
            usersWillGetReward = isServay.usersWillGetReward;
            attemptsPerUser = isServay.attemptsPerUser;
            remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
            oldRewardPerUser = isServay.oldRewardPerUser;
            entryId = isServay.entryId;
          };
          let questions = servayQustionsStorage.replace(key, tempQuestions);
          let tempServayUpdate = servayStorage.replace(key, tempServay);

          // it return the new tempQuiz with deleted question and on sucess it show messag
          return #ok("Questions deleted found", false);

        };
        case (null) {
          // on  error it return message
          return #err("Questions not found", false);
        };
      };
    };
    case (null) {
      return #err("Survey not found", false);
    };
  };
};

public shared ({ caller }) func saveUserResponseToServay(key : Text, result : [UserServayResponse], userCanisterId : Text) : async Result.Result<(Text, ?Nat, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);
  let userCanister = actor (userCanisterId) : actor {
    add_reward : (caller : Principal, like_reward : Nat, enum : Text) -> async Bool;
    get_user_name : (userId : Principal) -> async ?{
      name : ?Text;
      image : ?NewImageObject;
      designation : ?Text;
    };

  };
  let servay = servayStorage.get(key);
  let questions = servayQustionsStorage.get(key);
  if (result.size() < 1) {
    return #err("Not allowed", false);

  };
  switch (servay) {
    case (?isServay) {
      // check if user already taken the servay if yes then return with an error
      let isTaskenTheServay = Array.find<ServayTakenBy>(isServay.takenBy, func u = u.user == caller);
      switch (isTaskenTheServay) {
        case (?isTaken) {
          return #err("you already taken the servay", false);

        };
        case (null) {

        };
      };
      // check if servay status is active then allow
      if (not isServay.isAtive) {
        return #err("Not allowed", false);
      };

      switch (questions) {
        case (?questionsList) {
          var tempQuestions : [ServayQuestion] = questionsList;
          for (ques in result.vals()) {
            let findQuestion = Array.find<ServayQuestion>(tempQuestions, func q = q.title == ques.title);
            switch (findQuestion) {
              case (?isQuestion) {
                let filteredUsers = Array.filter<ServayQuestionTakenBy>(isQuestion.takenBy, func u = u.user != caller);
                var tempName = "";
                let userName = await userCanister.get_user_name(caller);
                switch (userName) {
                  case (?isData) {
                    switch (isData.name) {
                      case (?isName) {
                        tempName := isName;

                      };
                      case (null) {};
                    };
                  };
                  case (null) {

                  };
                };
                let currentDate = getCurrentDate();
                var tempUserTaken : ServayQuestionTakenBy = {
                  userSuggestion = ques.seggestion;
                  selectedOption = ques.selectedOption;
                  user = caller;
                  creation_time = currentDate;
                  userName = tempName;
                };
                var temptakenArray : [ServayQuestionTakenBy] = Array.append(filteredUsers, [tempUserTaken]);

                var tempQuestion : ServayQuestion = {
                  title = isQuestion.title;
                  options = isQuestion.options;
                  takenBy = temptakenArray;
                  creation_time = isQuestion.creation_time;
                  ifSelected = isQuestion.ifSelected;

                };
                let filteredQuestions = Array.filter<ServayQuestion>(tempQuestions, func q = q.title != isQuestion.title);
                tempQuestions := Array.append(filteredQuestions, [tempQuestion]);

              };
              case (null) {};
            };

          };
          let questions = servayQustionsStorage.replace(key, tempQuestions);
          var remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
          if (remaningUserCanTakeReward <= 0) {
            return #err("Not allowed", false);
          };
          switch (isServay.rewardPerUser) {
            case (?isReward) {
              let sended = userCanister.add_reward(caller, isReward, "l");

            };
            case (null) {

            };
          };
          let filteredUsers = Array.filter<ServayTakenBy>(isServay.takenBy, func u = u.user != caller);
          let currentDate = getCurrentDate();
          var tempTaken : ServayTakenBy = {
            user = caller;
            attemptAt = currentDate;
            reward = isServay.rewardPerUser;
          };
          let newtakenUsers : [ServayTakenBy] = Array.append(filteredUsers, [tempTaken]);

          var tempIsActive = true;
          if (remaningUserCanTakeReward -1 == 0) {
            tempIsActive := false;

          };
          var tempUpdateServay : Servay = {

            title = isServay.title;
            description = isServay.description;
            shouldRewarded = isServay.shouldRewarded;
            rewardPerUser = isServay.rewardPerUser;
            isAtive = tempIsActive;
            creation_time = isServay.creation_time;
            createdBy = isServay.createdBy;
            takenBy = newtakenUsers;
            questionCount = isServay.questionCount;
            usersWillGetReward = isServay.usersWillGetReward;
            attemptsPerUser = isServay.attemptsPerUser;
            remaningUserCanTakeReward = remaningUserCanTakeReward -1;
            oldRewardPerUser = isServay.oldRewardPerUser;
            entryId = isServay.entryId;
          };
          let servay = servayStorage.replace(key, tempUpdateServay);
          return #ok("rewarded", isServay.rewardPerUser, true);

        };
        case (null) {
          return #err("Questions not found", false);

        };

      };

    };
    case (null) {
      return #err("servay not found", false);
    };
  };

};
// get list of user seggestion
public shared ({ caller }) func getUserSeggestionList(key : Text, questionId : Text, search : Text, startIndex : Nat, length : Nat, userCanisterId : Text) : async Result.Result<(Text, { entries : [ServayQuestionTakenBy]; amount : Nat }), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);
  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = servayQustionsStorage.get(key);

  switch (servay) {
    case (?isServay) {
      switch (questions) {
        case (?questions) {
          let findQuestion = Array.find<ServayQuestion>(questions, func q = q.title == questionId);
          switch (findQuestion) {
            case (?isQuestion) {
              let takenBy = isQuestion.takenBy;

              let resultQuiz = EntryStoreHelper.searchTakenByList(takenBy, search, startIndex, length);
              return #ok("taken list", resultQuiz);
            };
            case (null) {
              return #err("question not found", false)

            };
          };

        };
        case (null) {
          return #err("questions not found", false)

        };
      };

    };
    case (null) {
      return #err("servay not found", false);
    };

  };

};

// =======  Quiz ======
func isEntryNotRejected(key : Text) : Bool {
  let maybeOldEntry = entryStorage.get(key);
  switch (maybeOldEntry) {
    case (?isEntry) {
      switch (isEntry.status) {
        case (#approved) {

          return true;
        };
        case (#pending) {

          return true;
        };
        case (_) {
          return false;

        };
      };

    };
    case (null) {
      return false;
    };
  };

};
func isEntryApproved(key : Text) : Bool {
  let maybeOldEntry = entryStorage.get(key);
  switch (maybeOldEntry) {
    case (?isEntry) {
      switch (isEntry.status) {
        case (#approved) {

          return true;
        };
        case (#pending) {

          return false;
        };
        case (_) {
          return false;

        };
      };

    };
    case (null) {
      return false;
    };
  };

};
func isEntryVerified(key : Text) : Bool {
  let maybeOldEntry = entryStorage.get(key);
  switch (maybeOldEntry) {
    case (?isEntry) {
      switch (isEntry.status) {
        case (#approved) {

          return true;
        };
        case (_) {
          return false;

        };
      };

    };
    case (null) {
      return false;
    };
  };

};
public func isEntryVerifiedPublicFn(key : Text) : async Bool {
  let maybeOldEntry = entryStorage.get(key);
  switch (maybeOldEntry) {
    case (?isEntry) {
      switch (isEntry.status) {
        case (#approved) {

          return true;
        };
        case (_) {
          return false;

        };
      };

    };
    case (null) {
      return false;
    };
  };

};
func isQuizAlreadyCreated(entryId : Text) : Bool {
  let isCreated = false;
  for ((key, quiz) in quizStorage.entries()) {

    let searchString = Text.map(entryId, Prim.charToLower);
    let id = Text.map(quiz.entryId, Prim.charToLower);
    var isSearched = Text.contains(id, #text searchString);
    if (isSearched) {
      return true;

    };
  };
  return isCreated;
};
func isSurveyAlreadyCreated(entryId : Text) : Bool {
  let isCreated = false;
  for ((key, survey) in servayStorage.entries()) {

    let searchString = Text.map(entryId, Prim.charToLower);
    let id = Text.map(survey.entryId, Prim.charToLower);
    var isSearched = Text.contains(id, #text searchString);
    if (isSearched) {
      return true;

    };
  };
  return isCreated;
};
func getCreaterOfEntry(entryId : Text) : ?UserId {
  let getEntry = entryStorage.get(entryId);
  switch (getEntry) {
    case (?isEntry) {
      // switch (isEntry.user) {
      //   case (?userId) {
      //     return ?userId;

      //   };
      //   case (null) {
      //     return null;

      //   };
      // };
      return ?isEntry.user;

    };
    case (null) {
      return null;
    };

  };

};
public shared ({ caller }) func addQuiz(input : InputQuiz, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  let isAdmin = await userCanister.entry_require_permission(caller, #manage_article);
  var creatorOfQuiz : UserId = caller;

  let creatorOfEntry = getCreaterOfEntry(input.entryId);
  switch (creatorOfEntry) {
    case (?creatorOfEntry) {
      if (isAdmin) {
        creatorOfQuiz := creatorOfEntry;

      } else if (creatorOfEntry == caller) {
        creatorOfQuiz := creatorOfEntry;
      };
    };
    case (null) {
      return #err("Entry not found", false);

    };
  };

  var tempReward : ?Nat = null;
  // if (input.rewardPerUser != null and input.shouldRewarded) {
  //   tempReward := input.rewardPerUser;
  // };
  let isEntry = isEntryNotRejected(input.entryId);
  if (not isEntry) {
    return #err("You can only create quiz on approved article", false);

  };
  let isCreatedOnThisEntry = isQuizAlreadyCreated(input.entryId);
  if (isCreatedOnThisEntry) {
    return #err("Quiz already created on this Entry", false);

  };
  switch (input.rewardPerUser) {
    case (?isReward) {
      tempReward := input.rewardPerUser;
    };
    case (null) {};
  };
  let currentDate = getCurrentDate();
  var tempQuiz : Quiz = {

    title = input.title;
    description = input.description;
    isGeneral = input.isGeneral;
    entryId = input.entryId;
    shouldRewarded = input.shouldRewarded;
    rewardPerUser = tempReward;
    isAtive = false;
    duration = input.duration;
    creation_time = currentDate;
    createdBy = creatorOfQuiz;
    takenBy = [];
    questionCount = 0;
    usersWillGetReward = input.usersWillGetReward;
    attemptsPerUser = 2;
    passingMarks = input.passingMarks;
    remaningUserCanTakeReward = 0;
    oldRewardPerUser = null;

  };
  let rendomId = Int.toText(Time.now());
  let res = quizStorage.put(rendomId, tempQuiz);
  return #ok("Quiz added successfuly", true);
};

//  =====  update quiz  =====
public shared ({ caller }) func updateQuiz(input : InputQuiz, userCanisterId : Text, key : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);

  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);
      };
      var tempQuiz : Quiz = {

        title = input.title;
        description = input.description;
        isGeneral = input.isGeneral;
        entryId = input.entryId;
        shouldRewarded = input.shouldRewarded;
        rewardPerUser = isQuiz.rewardPerUser;
        isAtive = false;
        duration = input.duration;
        creation_time = isQuiz.creation_time;
        createdBy = isQuiz.createdBy;
        takenBy = isQuiz.takenBy;
        questionCount = isQuiz.questionCount;
        usersWillGetReward = isQuiz.usersWillGetReward;
        attemptsPerUser = 2;
        passingMarks = input.passingMarks;
        remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
        oldRewardPerUser = isQuiz.oldRewardPerUser;

      };
      let res = quizStorage.replace(key, tempQuiz);
      let modificationDate = getCurrentDate();
      var update = updateModificationDate(key, modificationDate, isQuiz.creation_time);
      return #ok("Quiz updated successfuly", true);
    };
    case (null) {
      return #err("Quiz not found", false);

    };

  };
};
public query func getQuizById(key : Text) : async ?Quiz {
  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.isAtive) {
        return quiz;

      } else {
        return null;
      };
    };
    case (null) {
      return null;

    };
  };
};
// for admin
public query func getQuizById_foradmin(key : Text) : async ?Quiz {

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {

      return quiz;

    };
    case (null) {
      return null;

    };
  };
};
func canAttempt(caller : Principal, quiz : Quiz, key : Text) : async Bool {
  let tempIsAreadyTaken = Array.find<TakenBy>(quiz.takenBy, func item = item.user == caller);
  switch (tempIsAreadyTaken) {
    case (?isTaken) {
      switch (isTaken.reward) {
        case (?isRewarded) {
          return false;

        };
        case (null) {

        };
      };
      if (isTaken.status == 0) {
        if (isTaken.remainingAttempts > 0) {
          return true;
        } else {
          let currentDate = getCurrentDate();
          let lastAttempt = (Time.now() / 1000000) -24 * 60 * 60 * 1000;
          // let lastAttempt = currentDate -2 * 60 * 1000;n

          if (isTaken.attemptAt < lastAttempt) {
            let quiz = quizStorage.get(key);
            switch (quiz) {
              case (?isQuiz) {
                var tempTakenBy : TakenBy = {
                  user = isTaken.user;
                  score = isTaken.score;
                  timestamp = isTaken.timestamp;
                  reward = isTaken.reward;
                  status = isTaken.status;
                  remainingAttempts = 2;
                  attemptAt = isTaken.attemptAt;

                };
                let filterTakenBy = Array.filter<TakenBy>(isQuiz.takenBy, func item = item.user != caller);
                let newTakenByArray = Array.append<TakenBy>(filterTakenBy, [tempTakenBy]);

                var tempQuiz : Quiz = {

                  title = isQuiz.title;
                  description = isQuiz.description;
                  isGeneral = isQuiz.isGeneral;
                  entryId = isQuiz.entryId;
                  shouldRewarded = isQuiz.shouldRewarded;
                  rewardPerUser = isQuiz.rewardPerUser;
                  isAtive = isQuiz.isAtive;
                  duration = isQuiz.duration;
                  creation_time = isQuiz.creation_time;
                  createdBy = isQuiz.createdBy;
                  takenBy = newTakenByArray;
                  questionCount = isQuiz.questionCount;
                  usersWillGetReward = isQuiz.usersWillGetReward;
                  attemptsPerUser = isQuiz.attemptsPerUser;
                  passingMarks = isQuiz.passingMarks;
                  remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
                  oldRewardPerUser = isQuiz.oldRewardPerUser;

                };
                let update = quizStorage.replace(key, tempQuiz);

                return true;

              };
              case (null) {

                return false;
              };
            };

            return true;

          } else {

            return false;

          };
        };

      } else {

        return false;

      };

    };
    case (null) {

      return true;
    };
  };

};

func canAttemptSurvey(caller : Principal, servay : Servay, key : Text) : async Bool {
  let tempIsAreadyTaken = Array.find<ServayTakenBy>(servay.takenBy, func item = item.user == caller);
  switch (tempIsAreadyTaken) {
    case (?isTaken) {
      return false;

    };
    case (null) {
      return true;
    };
  };

};
//get quiz of spacific entry or all
public shared ({ caller }) func getQuizList(entryId : ?Text, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Text, QuizForUser)];
  amount : Nat;
} {
  // assert not Principal.isAnonymous(caller);
  var sortedQuiz = Map.HashMap<Text, QuizForUser>(0, Text.equal, Text.hash);

  for ((key, quiz) in quizStorage.entries()) {
    let canattepmt = await canAttempt(caller, quiz, key);
    let tempQuiz : QuizForUser = {
                  isTaken = not canattepmt;
                  title = quiz.title;
                  entryId = quiz.entryId;
                  participatedCount = quiz.takenBy.size();
                  rewardPerUser = quiz.rewardPerUser;
                  isAtive = quiz.isAtive;
                  duration = quiz.duration;
                  creation_time = quiz.creation_time;
                  questionCount = quiz.questionCount;
                  usersWillGetReward = quiz.usersWillGetReward;
                };
  

      if (quiz.isAtive and quiz.questionCount > 0) {
        
        switch (entryId) {
          case (?isId) {
            let searchString = Text.map(isId, Prim.charToLower);
            let id = Text.map(quiz.entryId, Prim.charToLower);
            var isSearched = Text.contains(id, #text searchString);
            if (isSearched) {
            
              sortedQuiz.put(key, tempQuiz);
            };
          };
          case (null) {
            sortedQuiz.put(key, tempQuiz);
          };
        };

      };

    
  };
  let quizArray = Iter.toArray(sortedQuiz.entries());
  let resultQuiz = EntryStoreHelper.searchListQuiz(quizArray, search, startIndex, length, getModificationdate);
  return resultQuiz;
};
//get quiz of spacific entry or all for admin
public shared ({ caller }) func getQuizList_for_admin(entryId : ?Text, activeList : Int, search : Text, startIndex : Nat, length : Nat) : async {
  entries : [(Text, ReturnQuizWithTitle)];
  amount : Nat;
} {
  var sortedQuiz = Map.HashMap<Text, ReturnQuizWithTitle>(0, Text.equal, Text.hash);
  var title : Text = "";
  for ((key, quiz) in quizStorage.entries()) {

    if (activeList == 1) {

      if (quiz.isAtive) {
        switch (entryId) {
          case (?isId) {
            let searchString = Text.map(isId, Prim.charToLower);
            let id = Text.map(quiz.entryId, Prim.charToLower);
            var isSearched = Text.contains(id, #text searchString);
            if (isSearched) {
              let maybeEntry = entryStorage.get(quiz.entryId);
              switch (maybeEntry) {
                case (?isEntry) {
                  title := isEntry.title;
                  sortedQuiz.put(key, { quiz with entryTitle = title });
                };
                case (null) {};

              };
            };
          };
          case (null) {
            let maybeEntry = entryStorage.get(quiz.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedQuiz.put(key, { quiz with entryTitle = title });
              };
              case (null) {};

            };
          };
        };

      };
    } else if (activeList == 2) {
      if (not quiz.isAtive) {
        switch (entryId) {
          case (?isId) {
            let searchString = Text.map(isId, Prim.charToLower);
            let id = Text.map(quiz.entryId, Prim.charToLower);
            var isSearched = Text.contains(id, #text searchString);
            if (isSearched) {
              let maybeEntry = entryStorage.get(quiz.entryId);
              switch (maybeEntry) {
                case (?isEntry) {
                  title := isEntry.title;
                  sortedQuiz.put(key, { quiz with entryTitle = title });
                };
                case (null) {};

              };
            };
          };
          case (null) {
            let maybeEntry = entryStorage.get(quiz.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedQuiz.put(key, { quiz with entryTitle = title });
              };
              case (null) {};

            };
          };
        };

      };

    } else {
      switch (entryId) {
        case (?isId) {
          let searchString = Text.map(isId, Prim.charToLower);
          let id = Text.map(quiz.entryId, Prim.charToLower);
          var isSearched = Text.contains(id, #text searchString);
          if (isSearched) {
            let maybeEntry = entryStorage.get(quiz.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedQuiz.put(key, { quiz with entryTitle = title });
              };
              case (null) {};

            };
          };
        };
        case (null) {
          let maybeEntry = entryStorage.get(quiz.entryId);
          switch (maybeEntry) {
            case (?isEntry) {
              title := isEntry.title;
              sortedQuiz.put(key, { quiz with entryTitle = title });
            };
            case (null) {};

          };
        };
      };
    };

  };
  let quizArray = Iter.toArray(sortedQuiz.entries());
  let resultQuiz = EntryStoreHelper.searchListQuizWithTitle(quizArray, search, startIndex, length, getModificationdate);
  return resultQuiz;
};
public shared ({ caller }) func changeTheStatusOfQuiz(status : Bool, userCanisterId : Text, key : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      let isEntry = isEntryVerified(isQuiz.entryId);
      if (not isEntry) {
        return #err("You can only activate the quiz if the article is approved", false);

      };
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);
      };
    };
    case (null) {};

  };

  switch (quiz) {
    case (?isQuiz) {
      if (status) {
        var remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
        var numberOfUsersAlreadyTakenTheReward = usersAlreadyTakenReward(isQuiz.takenBy);
        if (remaningUserCanTakeReward > 0) {
          var tempQuiz : Quiz = {

            title = isQuiz.title;
            description = isQuiz.description;
            isGeneral = isQuiz.isGeneral;
            entryId = isQuiz.entryId;
            shouldRewarded = isQuiz.shouldRewarded;
            rewardPerUser = isQuiz.rewardPerUser;
            isAtive = true;
            duration = isQuiz.duration;
            creation_time = isQuiz.creation_time;
            createdBy = isQuiz.createdBy;
            takenBy = isQuiz.takenBy;
            questionCount = isQuiz.questionCount;
            usersWillGetReward = isQuiz.usersWillGetReward;
            attemptsPerUser = isQuiz.attemptsPerUser;
            passingMarks = isQuiz.passingMarks;
            remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
            oldRewardPerUser = isQuiz.oldRewardPerUser;

          };
          let res = quizStorage.replace(key, tempQuiz);
          return #ok("Quiz updated successfuly", true);
        } else {
          return #err("You can't update the quiz", false);

        };
      } else {
        var tempQuiz : Quiz = {

          title = isQuiz.title;
          description = isQuiz.description;
          isGeneral = isQuiz.isGeneral;
          entryId = isQuiz.entryId;
          shouldRewarded = isQuiz.shouldRewarded;
          rewardPerUser = isQuiz.rewardPerUser;
          isAtive = false;
          duration = isQuiz.duration;
          creation_time = isQuiz.creation_time;
          createdBy = isQuiz.createdBy;
          takenBy = isQuiz.takenBy;
          questionCount = isQuiz.questionCount;
          usersWillGetReward = isQuiz.usersWillGetReward;
          attemptsPerUser = isQuiz.attemptsPerUser;
          passingMarks = isQuiz.passingMarks;
          remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
          oldRewardPerUser = isQuiz.oldRewardPerUser;

        };
        let res = quizStorage.replace(key, tempQuiz);
        return #ok("Quiz updated successfuly", true);
      };

    };
    case (null) {
      return #err("Quiz not found", false);

    };

  };
};
public shared ({ caller }) func promotedTheQuiz(quizIcp : Nat, userCanisterId : Text, key : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      let isEntry = isEntryVerified(isQuiz.entryId);
      if (not isEntry) {
        return #err("You can only activate the survey if the article is approved", false);

      };
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);
      };
    };
    case (null) {};

  };
  switch (quiz) {
    case (?isQuiz) {

      let LEDGER = actor (TOKEN_CANISTER_ID) : actor {
        icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
      };
      if (List.size(quiz_transaction_history) >= MAX_TRANSACTIONS) {
        var totalPlatformFee = 0;
        var totalAdminFee = 0;
        func iterVals(item : TransactionHistoryItem) : Bool {
          totalPlatformFee := totalPlatformFee + item.platform;
          totalAdminFee := totalAdminFee + item.admin;
          return false;
        };
        let newHistory = List.filter<TransactionHistoryItem>(quiz_transaction_history, iterVals);
        quiz_transaction_history := List.nil();
        let platformRes = await LEDGER.icrc2_transfer_from({
          amount = totalPlatformFee;
          created_at_time = null;
          fee = null;
          from = {
            owner = Principal.fromText(MASTER_WALLET);
            subaccount = null;
          };
          memo = null;
          spender_subaccount = null;
          to = {
            owner = Principal.fromText(PLATFORM_WALLET);
            subaccount = null;
          };
        });
        let adminRes = await LEDGER.icrc2_transfer_from({
          amount = totalAdminFee;
          created_at_time = null;
          fee = null;
          from = {
            owner = Principal.fromText(MASTER_WALLET);
            subaccount = null;
          };
          memo = null;
          spender_subaccount = null;
          to = {
            owner = Principal.fromText(ADMIN_WALLET);
            subaccount = null;
          };
        });
      };
      let platformPercentage : Float = Float.fromInt(reward_config.platform) / 100;
      let adminPercentage : Float = Float.fromInt(reward_config.admin) / 100;
      let platformFee = (platformPercentage * Float.fromInt(quizIcp));
      let adminFee = (adminPercentage * Float.fromInt(quizIcp));
      let intAdminfees = Int.abs(Float.toInt(adminFee));
      let intPlateFormfees = Int.abs(Float.toInt(platformFee));

      let rewardToGive = quizIcp + intPlateFormfees + intAdminfees;

      let response = await LEDGER.icrc2_transfer_from({
        amount = rewardToGive;
        created_at_time = null;
        fee = null;
        from = { owner = caller; subaccount = null };
        memo = null;
        spender_subaccount = null;
        to = {
          owner = Principal.fromText(MASTER_Token_WALLET);
          subaccount = null;
        };
      });
      let currentDate = getCurrentDate();
      var newTransaction : TransactionHistoryItem = {
        user = caller;
        platform = Int.abs(Float.toInt(platformFee));
        admin = Int.abs(Float.toInt(adminFee));
        creation_time = currentDate;
      };
      var newQuizTransactionRecord : TransactionHistoryOfServayAndQuiz = {
        user = caller;
        platform = Int.abs(Float.toInt(platformFee));
        admin = Int.abs(Float.toInt(adminFee));
        creation_time = currentDate;
        id = key;
        entryType = #quiz;
        promotional = quizIcp;
        gasFee = 0;
      };
      let quizTransId = EntryType.generateNewRemoteObjectId();
      let new_quiz_and_survey_record = quizAndSurveyTransectionsStorage.put(quizTransId, newQuizTransactionRecord);

      let new_transaction_history = List.push(newTransaction, quiz_transaction_history);
      quiz_transaction_history := new_transaction_history;

      switch (response) {
        case (#Ok(_)) {

        };
        case (#Err(_)) {
          return #err("Error during transaction", false);
        };
      };

      var tempQuiz : Quiz = {

        title = isQuiz.title;
        description = isQuiz.description;
        isGeneral = isQuiz.isGeneral;
        entryId = isQuiz.entryId;
        shouldRewarded = isQuiz.shouldRewarded;
        rewardPerUser = isQuiz.rewardPerUser;
        isAtive = true;
        duration = isQuiz.duration;
        creation_time = isQuiz.creation_time;
        createdBy = isQuiz.createdBy;
        takenBy = isQuiz.takenBy;
        questionCount = isQuiz.questionCount;
        usersWillGetReward = isQuiz.usersWillGetReward;
        attemptsPerUser = isQuiz.attemptsPerUser;
        passingMarks = isQuiz.passingMarks;
        remaningUserCanTakeReward = isQuiz.usersWillGetReward;
        oldRewardPerUser = isQuiz.rewardPerUser;

      };
      let res = quizStorage.replace(key, tempQuiz);
      return #ok("Quiz updated successfuly", true);

    };
    case (null) {
      return #err("Quiz not found", false);

    };

  };
};
public shared ({ caller }) func promoteTheServay(servayIcp : Nat, userCanisterId : Text, key : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);
  switch (servay) {
    case (?isServay) {
      let isEntry = isEntryVerified(isServay.entryId);
      if (not isEntry) {
        return #err("You can only activate the survey if the article is approved", false);

      };
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);
      };
    };
    case (null) {};

  };
  switch (servay) {
    case (?isServay) {

      let LEDGER = actor (TOKEN_CANISTER_ID) : actor {
        icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
      };
      if (List.size(quiz_transaction_history) >= MAX_TRANSACTIONS) {

        var totalPlatformFee = 0;
        var totalAdminFee = 0;
        func iterVals(item : TransactionHistoryItem) : Bool {
          totalPlatformFee := totalPlatformFee + item.platform;
          totalAdminFee := totalAdminFee + item.admin;
          return false;
        };
        let newHistory = List.filter<TransactionHistoryItem>(quiz_transaction_history, iterVals);
        quiz_transaction_history := List.nil();
        let platformRes = await LEDGER.icrc2_transfer_from({
          amount = totalPlatformFee;
          created_at_time = null;
          fee = null;
          from = {
            owner = Principal.fromText(MASTER_Token_WALLET);
            subaccount = null;
          };
          memo = null;
          spender_subaccount = null;
          to = {
            owner = Principal.fromText(PLATFORM_WALLET);
            subaccount = null;
          };
        });
        let adminRes = await LEDGER.icrc2_transfer_from({
          amount = totalAdminFee;
          created_at_time = null;
          fee = null;
          from = {
            owner = Principal.fromText(MASTER_Token_WALLET);
            subaccount = null;
          };
          memo = null;
          spender_subaccount = null;
          to = {
            owner = Principal.fromText(ADMIN_WALLET);
            subaccount = null;
          };
        });
      };

      let gasFee = (10000 * 2) / MAX_TRANSACTIONS;
      let platformPercentage : Float = Float.fromInt(reward_config.platform) / 100;
      let adminPercentage : Float = Float.fromInt(reward_config.admin) / 100;
      let platformFee = (platformPercentage * Float.fromInt(servayIcp));
      let adminFee = (adminPercentage * Float.fromInt(servayIcp));

      let intAdminfees = Int.abs(Float.toInt(adminFee));
      let intPlateFormfees = Int.abs(Float.toInt(platformFee));

      let rewardToGive = servayIcp + intPlateFormfees + intAdminfees;
      let response = await LEDGER.icrc2_transfer_from({
        amount = rewardToGive;
        created_at_time = null;
        fee = null;
        from = { owner = caller; subaccount = null };
        memo = null;
        spender_subaccount = null;
        to = {
          owner = Principal.fromText(MASTER_Token_WALLET);
          subaccount = null;
        };
      });
      let currentDate = getCurrentDate();
      var newTransaction : TransactionHistoryItem = {
        user = caller;
        platform = Int.abs(Float.toInt(platformFee));
        admin = Int.abs(Float.toInt(adminFee));
        creation_time = currentDate;
      };
      var newServayTransactionRecord : TransactionHistoryOfServayAndQuiz = {
        user = caller;
        platform = Int.abs(Float.toInt(platformFee));
        admin = Int.abs(Float.toInt(adminFee));
        creation_time = currentDate;
        id = key;
        entryType = #survey;
        promotional = servayIcp;
        gasFee = 0;
      };
      let servayTransId = EntryType.generateNewRemoteObjectId();
      let new_quiz_and_survey_record = quizAndSurveyTransectionsStorage.put(servayTransId, newServayTransactionRecord);
      let new_transaction_history = List.push(newTransaction, quiz_transaction_history);
      quiz_transaction_history := new_transaction_history;

      switch (response) {
        case (#Ok(_)) {

        };
        case (#Err(_)) {
          return #err("Error during transaction", false);
        };
      };

      var tempServay : Servay = {
        title = isServay.title;
        description = isServay.description;
        shouldRewarded = isServay.shouldRewarded;
        rewardPerUser = isServay.rewardPerUser;
        isAtive = true;
        creation_time = isServay.creation_time;
        createdBy = isServay.createdBy;
        takenBy = isServay.takenBy;
        questionCount = isServay.questionCount;
        usersWillGetReward = isServay.usersWillGetReward;
        attemptsPerUser = isServay.attemptsPerUser;
        remaningUserCanTakeReward = isServay.usersWillGetReward;
        oldRewardPerUser = isServay.rewardPerUser;
        entryId = isServay.entryId;

      };
      let res = servayStorage.replace(key, tempServay);

      return #ok("Servay updated successfuly", true);

    };
    case (null) {
      return #err("Servay not found", false);

    };

  };
};
public shared ({ caller }) func addQuestion(key : Text, inputQuestion : InputQuestion, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = qustionsStorage.get(key);
  switch (questions) {
    case (?questionsList) {
      let newQuestions = Array.find<Question>(questionsList, func q = q.title == inputQuestion.title);
      switch (newQuestions) {
        case (?isAlready) {
          return #err("Question with this title already exist", false);

        };
        case (null) {

        };
      };
    };
    case (null) {

    };
  };

  switch (quiz) {
    case (?isQuiz) {
      let tempQuestionCount = isQuiz.questionCount +1;
      var tempQuiz : Quiz = {

        title = isQuiz.title;
        description = isQuiz.description;
        isGeneral = isQuiz.isGeneral;
        entryId = isQuiz.entryId;
        shouldRewarded = isQuiz.shouldRewarded;
        rewardPerUser = isQuiz.rewardPerUser;
        isAtive = isQuiz.isAtive;
        duration = isQuiz.duration;
        creation_time = isQuiz.creation_time;
        createdBy = isQuiz.createdBy;
        takenBy = isQuiz.takenBy;
        questionCount = tempQuestionCount;
        usersWillGetReward = isQuiz.usersWillGetReward;
        attemptsPerUser = isQuiz.attemptsPerUser;
        passingMarks = isQuiz.passingMarks;
        remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
        oldRewardPerUser = isQuiz.oldRewardPerUser;

      };
      let currentDate = getCurrentDate();
      var tempQuestion : Question = {
        title = inputQuestion.title;
        correctAnswer = inputQuestion.correctAnswer;
        options = inputQuestion.options;
        creation_time = currentDate;
      };
      switch (questions) {
        case (?isQuestionArray) {
          let newQuestions = Array.append<Question>(isQuestionArray, [tempQuestion]);
          let questions = qustionsStorage.replace(key, newQuestions);

        };
        case (null) {
          let questions = qustionsStorage.replace(key, [tempQuestion]);

        };
      };
      let quizUpdate = quizStorage.replace(key, tempQuiz);

      return #ok("Question added to quiz", true);

    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };
};
/**

function addMultipleQuestions to add multiple questions in at time in quiz

@param key, inputQuestions, userCanisterId
@returns OK(text,text),ERR(text,text)
**/
public shared ({ caller }) func addMultipleQuestions(key : Text, inputQuestions : [InputQuestion], userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = qustionsStorage.get(key);
  var tempQuestionsArray : [Question] = [];
  var questioncount = 0;

  switch (questions) {
    case (?isQuestionArray) {
      tempQuestionsArray := isQuestionArray;
    };
    case (null) {

    };
  };
  for (inputQuestion in inputQuestions.vals()) {
    let currentDate = getCurrentDate();
    var tempQuestion : Question = {
      title = inputQuestion.title;
      correctAnswer = inputQuestion.correctAnswer;
      options = inputQuestion.options;
      creation_time = currentDate;
    };

    let isAlready = Array.find<Question>(tempQuestionsArray, func q = q.title == inputQuestion.title);
    switch (isAlready) {
      case (?isAlready) {

      };
      case (null) {
        let newQuestions = Array.append<Question>(tempQuestionsArray, [tempQuestion]);
        tempQuestionsArray := newQuestions;
        questioncount += 1;

      };

    };

  };

  switch (quiz) {
    case (?isQuiz) {
      let tempQuestionCount = isQuiz.questionCount +questioncount;
      var tempQuiz : Quiz = {

        title = isQuiz.title;
        description = isQuiz.description;
        isGeneral = isQuiz.isGeneral;
        entryId = isQuiz.entryId;
        shouldRewarded = isQuiz.shouldRewarded;
        rewardPerUser = isQuiz.rewardPerUser;
        isAtive = isQuiz.isAtive;
        duration = isQuiz.duration;
        creation_time = isQuiz.creation_time;
        createdBy = isQuiz.createdBy;
        takenBy = isQuiz.takenBy;
        questionCount = tempQuestionCount;
        usersWillGetReward = isQuiz.usersWillGetReward;
        attemptsPerUser = isQuiz.attemptsPerUser;
        passingMarks = isQuiz.passingMarks;
        remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
        oldRewardPerUser = isQuiz.oldRewardPerUser;

      };
      let quizUpdate = quizStorage.replace(key, tempQuiz);
      let questions = qustionsStorage.replace(key, tempQuestionsArray);
      return #ok("Questions added to quiz", false);
    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };

};

public shared ({ caller }) func updateQuestion(key : Text, title : Text, inputQuestion : InputQuestion, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);
  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = qustionsStorage.get(key);
  switch (questions) {
    case (?questionsList) {
      let newQuestions = Array.find<Question>(questionsList, func q = q.title == title);
      switch (newQuestions) {
        case (?isAlready) {
          let newQuestions = Array.filter<Question>(questionsList, func q = q.title != title);
          let mayBeExist = Array.find<Question>(newQuestions, func q = q.title == inputQuestion.title);
          switch (mayBeExist) {
            case (?isExist) {
              return #err("Question with this title already exist", false);

            };
            case (null) {

            };
          };
          let currentDate = getCurrentDate();
          var tempQuestion : Question = {
            title = inputQuestion.title;
            correctAnswer = inputQuestion.correctAnswer;
            options = inputQuestion.options;
            creation_time = currentDate;
          };
          let updatedQuestion = Array.append<Question>(newQuestions, [tempQuestion]);

          let questions = qustionsStorage.replace(key, updatedQuestion);

          return #ok("Question updated successfully.", true);

        };
        case (null) {
          return #err("Question not found", false);

        };
      };
    };
    case (null) {
      return #err("Questions not found", false);

    };

  };
};
public shared ({ caller }) func deletequizQuestions(key : Text, titles : [Text], userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  // takes 3 parameters  1)survey id 3) questions id and lats one is canister id
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = qustionsStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      switch (questions) {
        case (?questionsList) {
          let data = Iter.fromArray(titles);
          for (title in data) {
            let newQuestions = Array.find<Question>(questionsList, func q = q.title == title);
            switch (newQuestions) {
              case (?isAlready) {
                let newQuestions = Array.filter<Question>(questionsList, func q = q.title != title);

                let tempQuestionCount = isQuiz.questionCount -1;
                var tempQuiz : Quiz = {

                  title = isQuiz.title;
                  description = isQuiz.description;
                  isGeneral = isQuiz.isGeneral;
                  entryId = isQuiz.entryId;
                  shouldRewarded = isQuiz.shouldRewarded;
                  rewardPerUser = isQuiz.rewardPerUser;
                  isAtive = isQuiz.isAtive;
                  duration = isQuiz.duration;
                  creation_time = isQuiz.creation_time;
                  createdBy = isQuiz.createdBy;
                  takenBy = isQuiz.takenBy;
                  questionCount = tempQuestionCount;
                  usersWillGetReward = isQuiz.usersWillGetReward;
                  attemptsPerUser = isQuiz.attemptsPerUser;
                  passingMarks = isQuiz.passingMarks;
                  remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
                  oldRewardPerUser = isQuiz.oldRewardPerUser;

                };

                let questions = qustionsStorage.replace(key, newQuestions);
                let tempQuizupdate = quizStorage.replace(key, tempQuiz);

              };
              case (null) {

              };
            };
          };
          // it return the new tempQuiz with deleted question and on sucess it show message

          return #ok("Question deleted successfully.", true);
        };
        case (null) {
          // on  error it return message
          return #err("Question not found", false);

        };

      };
    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };

};

public shared ({ caller }) func deleteQuestion(key : Text, title : Text, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };
  let questions = qustionsStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      switch (questions) {
        case (?questionsList) {
          let newQuestions = Array.find<Question>(questionsList, func q = q.title == title);
          switch (newQuestions) {
            case (?isAlready) {
              let newQuestions = Array.filter<Question>(questionsList, func q = q.title != title);

              let tempQuestionCount = isQuiz.questionCount -1;
              var tempQuiz : Quiz = {

                title = isQuiz.title;
                description = isQuiz.description;
                isGeneral = isQuiz.isGeneral;
                entryId = isQuiz.entryId;
                shouldRewarded = isQuiz.shouldRewarded;
                rewardPerUser = isQuiz.rewardPerUser;
                isAtive = isQuiz.isAtive;
                duration = isQuiz.duration;
                creation_time = isQuiz.creation_time;
                createdBy = isQuiz.createdBy;
                takenBy = isQuiz.takenBy;
                questionCount = tempQuestionCount;
                usersWillGetReward = isQuiz.usersWillGetReward;
                attemptsPerUser = isQuiz.attemptsPerUser;
                passingMarks = isQuiz.passingMarks;
                remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;
                oldRewardPerUser = isQuiz.oldRewardPerUser;

              };

              let questions = qustionsStorage.replace(key, newQuestions);
              let tempQuizupdate = quizStorage.replace(key, tempQuiz);

              return #ok("Question deleted successfully.", true);

            };
            case (null) {
              return #err("Question not found", false);

            };
          };
        };
        case (null) {
          return #err("Question not found", false);

        };

      };
    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };

};
// public shared ({ caller }) func getQuestionsOfQuiz(key : Text) : async Result.Result<(Quiz, [Question]), (Text, Bool)> {

//   let quiz = quizStorage.get(key);
//   switch (quiz) {
//     case (?isQuiz) {
//       let canUserAttempt = canAttempt(caller, isQuiz, key);
//       if (isQuiz.isAtive and canUserAttempt) {
//         let questions = qustionsStorage.get(key);
//         switch (questions) {
//           case (?questionsArray) {
//             return #ok(isQuiz, questionsArray);

//           };
//           case (null) {
//             return #ok(isQuiz, []);

//           };
//         };

//       } else {
//         return #err("Quiz not found", false);

//       };
//     };
//     case (null) {
//       return #err("Quiz not found", false);

//     };
//   };
// };
public shared ({ caller }) func getQuestionsOfQuiz_admin(key : Text, search : Text, startIndex : Nat, length : Nat) : async Result.Result<(?Quiz, { entries : [Question]; amount : Nat }), (Text, Bool)> {

  let quiz = quizStorage.get(key);
  var tempQuestion : [Question] = [];

  switch (quiz) {
    case (?isQuiz) {

      let questions = qustionsStorage.get(key);
      switch (questions) {
        case (?questionsArray) {
          tempQuestion := questionsArray;
          // return #ok(isQuiz, questionsArray);

        };
        case (null) {
          return #ok(quiz, { entries = []; amount = 0 });

        };
      };

    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };
  let resultQuiz = EntryStoreHelper.searchListQuizQuestion(tempQuestion, search, startIndex, length);

  return #ok(quiz, resultQuiz);

};
public query func getPromotionAmountOfQuiz(key : Text) : async ?Nat {

  let quiz = quizStorage.get(key);

  switch (quiz) {
    case (?isQuiz) {

      return isQuiz.rewardPerUser

    };
    case (null) {
      return null;

    };
  };

};
public shared ({ caller }) func getQuestionsOfQuiz(key : Text) : async Result.Result<(?Quiz, [Question]), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);
  let tempQuiz = quizStorage.get(key);
  var tempCanAccess = false;
  switch (tempQuiz) {
    case (?mabequiz) {
      let canUserAttempt = await canAttempt(caller, mabequiz, key);
      if (not canUserAttempt) {
        return #err("Not allowed", false);
      };
      tempCanAccess := true;
    };
    case (null) {

    };
  };

  let quiz = quizStorage.get(key);
  var tempQuestion : [Question] = [];

  switch (quiz) {
    case (?isQuiz) {
      // let canUserAttempt =await canAttempt(caller, isQuiz, key);
      if (isQuiz.isAtive) {
        let questions = qustionsStorage.get(key);
        switch (questions) {
          case (?questionsArray) {
            tempQuestion := questionsArray;
            // return #ok(isQuiz, questionsArray);

          };
          case (null) {
            return #ok(quiz, []);

          };
        };
      } else {
        return #err("not allowed", false);

      };

    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };
  // let resultQuiz = EntryStoreHelper.searchListQuizQuestion(tempQuestion, search, startIndex, length);

  // return #ok(quiz, resultQuiz);
  return #ok(quiz, tempQuestion);

};

public shared ({ caller }) func getQuestionsOfSurvey(key : Text) : async Result.Result<(?Servay, [ServayQuestion]), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);
  let tempQuiz = servayStorage.get(key);
  var tempCanAccess = false;
  switch (tempQuiz) {
    case (?mabequiz) {
      let canUserAttempt = await canAttemptSurvey(caller, mabequiz, key);
      if (not canUserAttempt) {
        return #err("Not allowed", false);
      };
      tempCanAccess := true;
    };
    case (null) {

    };
  };

  let survey = servayStorage.get(key);
  var tempQuestion : [ServayQuestion] = [];

  switch (survey) {
    case (?isServay) {

      if (isServay.isAtive) {
        let questions = servayQustionsStorage.get(key);
        switch (questions) {
          case (?questionsArray) {
            tempQuestion := questionsArray;

          };
          case (null) {
            return #ok(survey, []);

          };
        };
      } else {
        return #err("not allowed", false);

      };

    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };
  return #ok(survey, tempQuestion);

};

func usersAlreadyTakenReward(userTakenTheQuiz : [TakenBy]) : Int {
  let tempIsAreadyTaken = Array.filter<TakenBy>(userTakenTheQuiz, func item = item.reward != null);
  return Array.size(tempIsAreadyTaken);
};
func usersAlreadyTakenRewardOfServay(userTakenTheQuiz : [ServayTakenBy]) : Int {
  let tempIsAreadyTaken = Array.filter<ServayTakenBy>(userTakenTheQuiz, func item = item.reward != null);
  return Array.size(tempIsAreadyTaken);
};
func arrayContains<Text>(arr : [Text], item : Text, equals : (Text, Text) -> Bool) : Bool {
  for (x in arr.vals()) {
    if (equals(x, item)) {
      return true;
    };
  };
  return false;
};
public shared ({ caller }) func validateQuiz(key : Text, timestamp : Int, answers : [QuestionAnswer], userCanisterId : Text) : async Result.Result<(Text, Int, Int, Int), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let tempQuiz = quizStorage.get(key);
  switch (tempQuiz) {
    case (?mabequiz) {
      let canUserAttempt = await canAttempt(caller, mabequiz, key);
      if (not canUserAttempt) {
        return #err("You reached to your maximum attempts please try again after 24 hours", false);

      };
    };
    case (null) {};
  };

  let quiz = quizStorage.get(key);
  let userCanister = actor (userCanisterId) : actor {
    add_reward : (caller : Principal, like_reward : Nat, enum : Text) -> async Bool;

  };
  switch (quiz) {
    case (?isQuiz) {
      if (not isQuiz.isAtive) {
        return #err("Not allowed", false);
      };
      let questions = qustionsStorage.get(key);
      var tempScore = 0;
      var totalQuestions : Float = 0;
      var tempStatus = 0; //0 mean fail and 1 mean pass
      var tempRewardAmount = 0;
      var willGetReward = false;
      var existedReward : ?Nat = null;
      switch (questions) {
        case (?isQuestionArray) {
          // var tempScore = 0;
          // totalQuestions:=Int.fromNat64(isQuestionArray.size());
          let intQuestionsValue : Int = isQuestionArray.size();
          let floatValue : Float = Float.fromInt(intQuestionsValue);
          totalQuestions := floatValue;

          for (item in answers.vals()) {
            let findQuestion = Array.find<Question>(isQuestionArray, func x = x.title == item.title);
            switch (findQuestion) {
              case (?isQuestion) {
                var isCorrect : Bool = true;
                // for (ans in item.correctAnswer.vals()) {

                //   let findQuestion = Array.find<Text>(isQuestion.correctAnswer, func x = x == ans);

                //   switch (findQuestion) {
                //     case (?isExsited) {
                //       isCorrect := true;

                //     };
                //     case (null) {};
                //   };

                // };
                var tempCorrectQuestion = isQuestion.correctAnswer;
                var tempCorrectAnswer = item.correctAnswer;

                for (answer in tempCorrectAnswer.vals()) {
                  let equals = func(x : Text, y : Text) : Bool { x == y };
                  let result = arrayContains(tempCorrectQuestion, answer, equals);
                  if (not result) {
                    isCorrect := false;
                  };
                };

                if (isCorrect) {
                  tempScore += 1;

                };
                // let result=isQuestionCorrect(item, isQuestion);
                // if (result) {
                //   tempScore += 1;

                // };
              };
              case (null) {};
            };

          };
          let tempUserScore : Float = Float.fromInt(tempScore);
          let tempUserPassingMarks : Float = Float.fromInt(isQuiz.passingMarks);
          let perstageOfMarks : Float = (tempUserScore / totalQuestions) * 100;
          if (perstageOfMarks >= tempUserPassingMarks) {
            tempStatus := 1;
          };
          var totallAttempts : Int = isQuiz.attemptsPerUser;

          let tempIsAreadyTaken = Array.find<TakenBy>(isQuiz.takenBy, func item = item.user == caller);
          var numberOfUserWillGetTheReward = isQuiz.usersWillGetReward;
          var remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward;

          var numberOfUsersAlreadyTakenTheReward = usersAlreadyTakenReward(isQuiz.takenBy);
          if (totallAttempts <= 0) {
            return #err("Not allowed", false);
          };
          if (remaningUserCanTakeReward <= 0) {
            return #err("Not allowed", false);
          };
          switch (tempIsAreadyTaken) {
            case (?isAreadyTaken) {
              if (isAreadyTaken.remainingAttempts <= 0) {
                return #err("You reached to your maximum attempts please try again after 24 hours", false);
              };
              totallAttempts := isAreadyTaken.remainingAttempts -1;

              switch (isAreadyTaken.reward) {
                case (?userReward) {
                  existedReward := isAreadyTaken.reward;
                  willGetReward := false;
                  return #err("You already taken the quiz", false);

                };
                case (null) {
                  if (remaningUserCanTakeReward > 0 and tempStatus == 1) {
                    willGetReward := true;
                    existedReward := isQuiz.rewardPerUser;

                  };

                };
              };

            };
            case (null) {
              totallAttempts := totallAttempts -1;
              if (remaningUserCanTakeReward > 0 and tempStatus == 1) {

                existedReward := isQuiz.rewardPerUser;
                willGetReward := true;

              };

            };
          };
          if (willGetReward) {

            switch (isQuiz.oldRewardPerUser) {
              case (?isReward) {
                tempRewardAmount := isReward;
                let sended = userCanister.add_reward(caller, isReward, "m");

              };
              case (null) {
                existedReward := null;
              };
            };
          };
          let currentDate = getCurrentDate();
          var tempTakenBy : TakenBy = {
            user = caller;
            score = tempScore;
            timestamp = timestamp;
            reward = existedReward;
            status = tempStatus;
            remainingAttempts = totallAttempts;
            attemptAt = currentDate;

          };
          let tempTakenBySize = Array.size(isQuiz.takenBy);
          // check whatever remaning users can taken reward is 0 or not
          var tempIsActive = true;
          if (remaningUserCanTakeReward -1 == 0) {
            tempIsActive := false;

          };
          if (tempTakenBySize > 0) {
            let newQuestions = Array.filter<TakenBy>(isQuiz.takenBy, func item = item.user != caller);

            let newTakenByArray = Array.append<TakenBy>(newQuestions, [tempTakenBy]);
            var tempQuiz : Quiz = {

              title = isQuiz.title;
              description = isQuiz.description;
              isGeneral = isQuiz.isGeneral;
              entryId = isQuiz.entryId;
              shouldRewarded = isQuiz.shouldRewarded;
              rewardPerUser = isQuiz.rewardPerUser;
              isAtive = tempIsActive;
              duration = isQuiz.duration;
              creation_time = isQuiz.creation_time;
              createdBy = isQuiz.createdBy;
              takenBy = newTakenByArray;
              questionCount = isQuiz.questionCount;
              usersWillGetReward = isQuiz.usersWillGetReward;
              attemptsPerUser = isQuiz.attemptsPerUser;
              passingMarks = isQuiz.passingMarks;
              remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward -1;
              oldRewardPerUser = isQuiz.oldRewardPerUser;

            };
            let quiz = quizStorage.replace(key, tempQuiz);

          } else {
            var tempQuiz : Quiz = {

              title = isQuiz.title;
              description = isQuiz.description;
              isGeneral = isQuiz.isGeneral;
              entryId = isQuiz.entryId;
              shouldRewarded = isQuiz.shouldRewarded;
              rewardPerUser = isQuiz.rewardPerUser;
              isAtive = tempIsActive;
              duration = isQuiz.duration;
              creation_time = isQuiz.creation_time;
              createdBy = isQuiz.createdBy;
              takenBy = [tempTakenBy];
              questionCount = isQuiz.questionCount;
              usersWillGetReward = isQuiz.usersWillGetReward;
              attemptsPerUser = isQuiz.attemptsPerUser;
              passingMarks = isQuiz.passingMarks;
              remaningUserCanTakeReward = isQuiz.remaningUserCanTakeReward -1;
              oldRewardPerUser = isQuiz.oldRewardPerUser;

            };
            let quiz = quizStorage.replace(key, tempQuiz);

          };
          return #ok("formate is: score, status,RewardAmount", tempScore, tempStatus, tempRewardAmount);
        };
        case (null) {
          return #err("Question not found of this quiz", false);

        };
      };

    };
    case (null) {
      return #err("Quiz not found", false);

    };
  };
};
public shared ({ caller }) func changeStatusOfServay(status : Bool, userCanisterId : Text, key : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let servay = servayStorage.get(key);

  switch (servay) {
    case (?isServay) {
      let isEntry = isEntryVerified(isServay.entryId);
      if (not isEntry) {
        return #err("You can only activate the survey if the article is approved", false);

      };
      if (isServay.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);

      };
    };
    case (null) {

    };
  };

  switch (servay) {
    case (?isServay) {
      if (status) {
        var remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
        var numberOfUsersAlreadyTakenTheReward = usersAlreadyTakenRewardOfServay(isServay.takenBy);
        if (remaningUserCanTakeReward > 0) {
          var tempServay : Servay = {
            title = isServay.title;
            description = isServay.description;
            shouldRewarded = isServay.shouldRewarded;
            rewardPerUser = isServay.rewardPerUser;
            isAtive = true;
            creation_time = isServay.creation_time;
            createdBy = isServay.createdBy;
            takenBy = isServay.takenBy;
            questionCount = isServay.questionCount;
            usersWillGetReward = isServay.usersWillGetReward;
            attemptsPerUser = isServay.attemptsPerUser;
            remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
            oldRewardPerUser = isServay.oldRewardPerUser;
            entryId = isServay.entryId;

          };
          let res = servayStorage.replace(key, tempServay);

          return #ok("Servay Activated successfuly", true);

        } else {
          return #err("Servay can't be activated", false);

        };
      } else {
        var tempServay : Servay = {
          title = isServay.title;
          description = isServay.description;
          shouldRewarded = isServay.shouldRewarded;
          rewardPerUser = isServay.rewardPerUser;
          isAtive = false;
          creation_time = isServay.creation_time;
          createdBy = isServay.createdBy;
          takenBy = isServay.takenBy;
          questionCount = isServay.questionCount;
          usersWillGetReward = isServay.usersWillGetReward;
          attemptsPerUser = isServay.attemptsPerUser;
          remaningUserCanTakeReward = isServay.remaningUserCanTakeReward;
          oldRewardPerUser = isServay.oldRewardPerUser;
          entryId = isServay.entryId;

        };
        let res = servayStorage.replace(key, tempServay);
        return #ok("Servay Deactivated successfuly", true);

      };
    };
    case (null) {
      return #err("Servay not found", false);

    };

  };
};
public shared ({ caller }) func delete_quiz(key : Text, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let quiz = quizStorage.get(key);

  let questions = qustionsStorage.get(key);
  switch (quiz) {
    case (?isQuiz) {
      if (isQuiz.createdBy != caller) {
        let userCanister = actor (userCanisterId) : actor {
          entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
        };
        assert await userCanister.entry_require_permission(caller, #manage_article);
      };
      let res = quizStorage.remove(key);

    };
    case (null) {
      return #err("Quiz not found.", false);
    };
  };
  switch (questions) {
    case (?isExsited) {
      let res = qustionsStorage.remove(key);

    };
    case (null) {

    };
  };
  return #ok("quiz deleted successfully", false);

};

// ==========  featured campaign ======

// === add feature campaign ======
func isCampaignExist(key : Text) : Bool {
  let maybeCampaign = featuredCampaignStorage.get(key);
  switch (maybeCampaign) {
    case (?isCampaign) {
      return true;

    };
    case (null) {
      return false;
    };
  };

};
public shared ({ caller }) func add_campaign(input : InputFeaturedCampaign, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let maybeCampaign = featuredCampaignStorage.get(input.entryId);
  let isExisted = isCampaignExist(input.entryId);
  if (isExisted) {
    return #err("Campaign with this EntryId is already exist", false);

  };
  let currentDate = getCurrentDate();
  let maybeEntry = entryStorage.get(input.entryId);
  switch (maybeEntry) {
    case (?isEntry) {
      if (isEntry.status != #approved) {
        return #err("Entry is not approved", false);

      };
      let tempCampaign : FeaturedCampaign = {
        entryId = input.entryId;
        startDate = input.startDate;
        endDate = input.endDate;
        isActive = input.isActive;
        createdBy = caller;
        creation_time = currentDate;
      };
      let rendomId = input.entryId;
      let res = featuredCampaignStorage.put(rendomId, tempCampaign);
      return #ok("Featured campaign created successfully.", true);

    };
    case (null) {

      return #err("Invalid EntryId", false);
    };
  };
};
// === delete feature campaign ======
public shared ({ caller }) func delete_campaign(key : Text, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);
  let maybeCampaign = featuredCampaignStorage.get(key);
  switch (maybeCampaign) {
    case (?isCampaign) {

      let res = featuredCampaignStorage.remove(key);
      return #ok("Featured campaign deleted successfully.", true);

    };
    case (null) {

      return #err("Featured campaign not found", false);
    };
  };
};
// === delete feature campaign ======
public shared ({ caller }) func update_campaign(key : Text, input : InputFeaturedCampaign, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
  assert not Principal.isAnonymous(caller);

  let userCanister = actor (userCanisterId) : actor {
    entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
  };
  assert await userCanister.entry_require_permission(caller, #manage_article);

  let maybeCampaign = featuredCampaignStorage.get(key);
  switch (maybeCampaign) {
    case (?isCampaign) {
      let maybeEntry = entryStorage.get(input.entryId);
      switch (maybeEntry) {
        case (?isEntry) {
          if (isEntry.status != #approved) {
            return #err("Entry is not approved", false);

          };
        };
        case (null) {
          return #err("Invalid EntryId", false);

        };
      };
      if (input.entryId != isCampaign.entryId) {
        let isExisted = isCampaignExist(input.entryId);
        if (isExisted) {
          return #err("Campaign with this EntryId is already exist", false);

        };

      };
      let tempCampaign : FeaturedCampaign = {
        entryId = input.entryId;
        startDate = input.startDate;
        endDate = input.endDate;
        isActive = input.isActive;
        createdBy = isCampaign.createdBy;
        creation_time = isCampaign.creation_time;
      };

      let res = featuredCampaignStorage.replace(key, tempCampaign);
      let modificationDate = getCurrentDate();
      var updateMod = updateModificationDate(key, modificationDate, isCampaign.creation_time);
      return #ok("Featured campaign updated successfully.", true);

    };
    case (null) {

      return #err("Featured campaign not found", false);
    };
  };
};
func get_campaign_ids() : [Text] {

  var campaignsIds : [Text] = [];
  let currentDate = getCurrentDate();
  var entriesArray : [(Key, FeaturedCampaign)] = Iter.toArray(featuredCampaignStorage.entries());

    let compare = func((keyA : Key, a : FeaturedCampaign), (keyB : Key, b : FeaturedCampaign)) : Order.Order {
      let currentTime = currentDate;
      if ((a.isActive and b.isActive)) {
        if ((a.startDate < currentTime and a.endDate > currentTime) and (b.startDate < currentTime and b.endDate > currentTime)) {
          return #equal;

        } else if ((a.startDate <= currentTime and a.endDate >= currentTime)) {
          return #less;

        }  else {
          return #greater;

        }
      } else if (a.isActive) {

        return #less;
      } else if (b.isActive) {
        return #greater;
      } else {
        return #equal;

      };
    };
    
    let sortedEntries = Array.sort(
      entriesArray,
      compare,
    );
    for ((key, campaign) in sortedEntries.vals()) {

        campaignsIds := Array.append(campaignsIds, [campaign.entryId]);
    
    };
    return campaignsIds;

  };
  // ===== get featured campaigns list =====\
  public query func getFeaturedCampaignList(search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Key, FeaturedCampaignItem)];
    amount : Nat;
  } {

    var campaignList = Map.HashMap<Key, FeaturedCampaignItem>(0, Text.equal, Text.hash);

    for ((key, campaign) in featuredCampaignStorage.entries()) {
      let entrytitle = getEntryTitle(campaign.entryId);
      let tempCamp : FeaturedCampaignItem = {
        entryId = campaign.entryId;
        startDate = campaign.startDate;
        endDate = campaign.endDate;
        isActive = campaign.isActive;
        createdBy = campaign.createdBy;
        creation_time = campaign.creation_time;
        title = entrytitle;
      };
      campaignList.put(key, tempCamp);

    };
    return EntryStoreHelper.searchSortListOfCampaign(campaignList, search, startIndex, length, getModificationdate);

  };

  // ====  get list of featured campaign entries=====
  public query func getFeaturedEntriesList(search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Key, ListEntryItem)];
    amount : Nat;
  } {

    var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);
    var get_campaign_ids_list = get_campaign_ids();
    for (key in get_campaign_ids_list.vals()) {
      let maybeEntry = entryStorage.get(key);
      switch (maybeEntry) {
        case (?entry) {
          let modificationDate = getModificationdate(key, entry.creation_time);

          let lisEntryItem : ListEntryItem = {
            entry with modificationDate = modificationDate;
          };
          entiresList.put(key, lisEntryItem);

        };
        case (null) {

        };
      };

    };
    return EntryStoreHelper.searchSortCampaingList(entiresList, search, startIndex, length);

  };
  public query func getCampaignById_forAdmin(key : Text) : async ?FeaturedCampaign {

    let campaign = featuredCampaignStorage.get(key);
    switch (campaign) {
      case (?isCampaign) {

        return campaign;

      };
      case (null) {
        return null;

      };
    };
  };
  // get quiz of user
  public shared ({ caller }) func getQuizList_for_auther(entryId : ?Text, activeList : Int, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Text, ReturnQuizWithTitle)];
    amount : Nat;

  } {

    var sortedQuiz = Map.HashMap<Text, ReturnQuizWithTitle>(0, Text.equal, Text.hash);
    var title : Text = "";
    for ((key, quiz) in quizStorage.entries()) {

      if (quiz.createdBy == caller) {
        switch (entryId) {
          case (?isId) {
            let searchString = Text.map(isId, Prim.charToLower);
            let id = Text.map(quiz.entryId, Prim.charToLower);
            var isSearched = Text.contains(id, #text searchString);
            if (isSearched) {
              let maybeEntry = entryStorage.get(quiz.entryId);
              switch (maybeEntry) {
                case (?isEntry) {
                  title := isEntry.title;
                  sortedQuiz.put(key, { quiz with entryTitle = title });
                };
                case (null) {};

              };
            };
          };
          case (null) {
            let maybeEntry = entryStorage.get(quiz.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedQuiz.put(key, { quiz with entryTitle = title });
              };
              case (null) {};

            };
          };

        };

      };

    };
    let quizArray = Iter.toArray(sortedQuiz.entries());
    let resultQuiz = EntryStoreHelper.searchListQuizWithTitle(quizArray, search, startIndex, length, getModificationdate);
    return resultQuiz;
  };

  public shared ({ caller }) func getOnlyActiveQuizOfArticle(entryId : Text) : async [Text] {
    let isApproved = isEntryApproved(entryId);

    var sortedQuizIds : [Text] = [];
    if (not isApproved) return sortedQuizIds;
    for ((key, quiz) in quizStorage.entries()) {

      if (quiz.isAtive and quiz.questionCount > 0) {
        let canattepmt = await canAttempt(caller, quiz, key);
        if (canattepmt) {

          let searchString = Text.map(entryId, Prim.charToLower);
          let id = Text.map(quiz.entryId, Prim.charToLower);
          var isSearched = Text.contains(id, #text searchString);
          if (isSearched) {
            var res = Array.append(sortedQuizIds, [key]);
            sortedQuizIds := res;

          };
        };
      };
    };

    return sortedQuizIds;

  };

  public shared ({ caller }) func getOnlyActiveQuizOfArticles(entryId : Text) : async [(Text, ?Nat)] {
    var sortedQuizIds : [(Text, ?Nat)] = [];

    for ((key, quiz) in quizStorage.entries()) {
      if (quiz.isAtive and quiz.questionCount > 0) {
        var reward = quiz.rewardPerUser;
        let canattepmt = await canAttempt(caller, quiz, key);
        if (canattepmt) {

          // let searchString = Text.map(entryId, Prim.charToLower);
          // let id = Text.map(quiz.entryId, Prim.charToLower);
          // var isSearched = Text.contains(id, #text searchString);
          var isSearched = entryId == quiz.entryId;

          if (isSearched) {
            var res = Array.append(sortedQuizIds, [(key, reward)]);
            sortedQuizIds := res;

          };
        };
      };
    };

    return sortedQuizIds;
  };

  public query func getRewardsOfQuizandSurvey(entryId : Text) : async Nat {
    var totalReward : Nat = 0;

    for ((key, quiz) in quizStorage.entries()) {
      var isSearched = entryId == quiz.entryId;
      if (isSearched and quiz.isAtive and quiz.questionCount > 0) {

        var reward = quiz.rewardPerUser;
        switch (reward) {
          case (?reward) {
            totalReward += reward;
          };
          case (null) {
            totalReward += 0;
          };

        };
      };
    };
    for ((key, survey) in servayStorage.entries()) {
      var isSearched = entryId == survey.entryId;
      if (isSearched and survey.isAtive and survey.questionCount > 0) {

        var reward = survey.rewardPerUser;

        switch (reward) {
          case (?reward) {
            totalReward += reward;
          };
          case _ { totalReward := 0 }

        };

      };
    };

    return totalReward;
  };

  public shared ({ caller }) func getQuizIdsList_Of_article(entryId : Text) : async [Text] {
    var sortedQuizIds : [Text] = [];

    for ((key, quiz) in quizStorage.entries()) {

      let searchString = Text.map(entryId, Prim.charToLower);
      let id = Text.map(quiz.entryId, Prim.charToLower);
      var isSearched = Text.contains(id, #text searchString);
      if (isSearched) {
        var res = Array.append(sortedQuizIds, [key]);
        sortedQuizIds := res;

      };
    };

    return sortedQuizIds;
  };
  public shared ({ caller }) func getSurveyIdsList_Of_article(entryId : Key) : async [Text] {
    var sortedSurveyIds : [Text] = [];

    for ((key, survey) in servayStorage.entries()) {

      let searchString = Text.map(entryId, Prim.charToLower);
      let id = Text.map(survey.entryId, Prim.charToLower);
      var isSearched = Text.contains(id, #text searchString);
      if (isSearched) {
        var res = Array.append(sortedSurveyIds, [key]);
        sortedSurveyIds := res;

      };
    };

    return sortedSurveyIds;
  };
  public shared ({ caller }) func getOnlyActiveSurveyOfArticle(entryId : Key) : async [Text] {
    var sortedSurveyIds : [Text] = [];
    let isApproved = isEntryApproved(entryId);
    if (not isApproved) return sortedSurveyIds;
    for ((key, survey) in servayStorage.entries()) {

      let searchString = Text.map(entryId, Prim.charToLower);
      let id = Text.map(survey.entryId, Prim.charToLower);
      var isSearched = Text.contains(id, #text searchString);
      if (isSearched) {
        if (survey.isAtive and survey.questionCount > 0) {
          let isTaskenTheServay = Array.find<ServayTakenBy>(survey.takenBy, func u = u.user == caller);
          switch (isTaskenTheServay) {
            case (?isTaken) {

            };
            case (null) {
              var res = Array.append(sortedSurveyIds, [key]);
              sortedSurveyIds := res;

            };
          };

        };

      };
    };

    return sortedSurveyIds;
  };
  // get servay of user
  public shared ({ caller }) func getServayList_for_auther(entryId : ?Text, activeList : Int, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Text, ServaywithTitle)];
    amount : Nat;
  } {
    var title : Text = "";
    var sortedServay = Map.HashMap<Text, ServaywithTitle>(0, Text.equal, Text.hash);

    for ((key, servay) in servayStorage.entries()) {
      if (servay.createdBy == caller) {
        switch (entryId) {
          case (?isId) {
            let searchString = Text.map(isId, Prim.charToLower);
            let id = Text.map(servay.entryId, Prim.charToLower);
            var isSearched = Text.contains(id, #text searchString);

            if (isSearched) {
              let maybeEntry = entryStorage.get(servay.entryId);
              switch (maybeEntry) {
                case (?isEntry) {
                  title := isEntry.title;
                  sortedServay.put(key, { servay with entryTitle = title });
                };
                case (null) {

                };

              };

            };
          };
          case (null) {

            let maybeEntry = entryStorage.get(servay.entryId);
            switch (maybeEntry) {
              case (?isEntry) {
                title := isEntry.title;
                sortedServay.put(key, { servay with entryTitle = title });
              };
              case (null) {

              };

            };

          };
        };

      };

    };
    let servayArray = Iter.toArray(sortedServay.entries());
    let resultServay = EntryStoreHelper.searchListServaywithTitle(servayArray, search, startIndex, length, getModificationdate);
    return resultServay;
  };

  // get quiz and survey transection
  public shared ({ caller }) func getQuizAndServayTransectionForAdmin(transType : InputTransectionTypes, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Text, TransactionHistoryOfServayAndQuiz)];
    amount : Nat;
  } {
    var sorted = Map.fromIter<Text, TransactionHistoryOfServayAndQuiz>(stable_quiz_and_survey_record.vals(), stable_quiz_and_survey_record.size(), Text.equal, Text.hash);

    for ((key, trans) in quizAndSurveyTransectionsStorage.entries()) {
      switch (transType) {
        case (#survey) {
          switch (trans.entryType) {
            case (#survey) {
              sorted.put(key, trans);
            };
            case (#quiz) {

            };

          };
        };
        case (#quiz) {
          switch (trans.entryType) {
            case (#quiz) {
              sorted.put(key, trans);
            };
            case (#survey) {

            };
          };
        };
        case (#all) {

          sorted.put(key, trans);

        };
      };

    };
    let sortedArray = Iter.toArray(sorted.entries());
    let resultQuiz = EntryStoreHelper.searchListQuizAndSurveyTrans(sortedArray, search, startIndex, length, getModificationdate);
    return resultQuiz;
  };
  /**

function for update modification date of article,podcast, pressrelease, web3 and events

@param null
@returns {
       creation_time : Int;
     modification_date : Int;
     key : Text;
  }; object.
*/
  func updateModificationDate(key : Key, modification_date : Int, creation_time : Int) : () {
    let getDate = entryModificationStorage.get(key);
    var tempDate : EntriesModificationDate = {
      creation_time = creation_time;
      modification_date = modification_date;
    };
    switch (getDate) {

      case (?getDate) {
        let res = entryModificationStorage.replace(key, tempDate)

      };
      case (null) {

        let res = entryModificationStorage.put(key, tempDate)

      };
    };

  };
  /**
function buyNFTStudio24Tokens use for handle transection
@permeters userCanisterId, token amount

retun error if error during transection and else OK
  **/
  public shared ({ caller }) func buyNFTStudio24Tokens(userCanisterId : Text, icpIne8s : Nat,dollarRate:Nat) : async Result.Result<Text, Text> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
      get_NFT24Coin : () -> async Nat;
    };

    let LEDGER = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor {
      icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
    };

    let TOKEN = actor (TOKEN_CANISTER_ID) : actor {
      icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
    };

    let gasFee = 10000;
    let icpWithOutFee = (icpIne8s -gasFee);
    // if (icpWithOutFee / E8S <= 0) {
    //   return #err("Error during transaction");
    // };
    let response = await LEDGER.icrc2_transfer_from({
      amount = icpWithOutFee;
      created_at_time = null;
      fee = null;
      from = { owner = caller; subaccount = null };
      memo = null;
      spender_subaccount = null;
      to = { owner = Principal.fromText(MASTER_WALLET); subaccount = null };
    });
    Debug.print(debug_show (response,icpWithOutFee,icpIne8s,"response"));
    var coinsInOneIcp = await userCanister.get_NFT24Coin();

    let tokensInFloat = (Float.fromInt(icpWithOutFee) / Float.fromInt(E8S)) * Float.fromInt(coinsInOneIcp);

    let totalTokens = dollarRate*coinsInOneIcp;
    let dem = await TOKEN.icrc2_transfer_from({
      amount = totalTokens;
      created_at_time = null;
      fee = ?0;
      from = { owner = Principal.fromText(MASTER_WALLET); subaccount = null };
      memo = null;
      spender_subaccount = null;
      to = { owner = caller; subaccount = null };
    });
    Debug.print(debug_show ({dem},"response"));

    switch (response) {
      case (#Ok(_)) {
        switch (dem) {
          case (#Ok(_)) {
            return #ok("Tokens send to your wallet.");

          };
          case (#Err(_)) {
            return #err("Error during transaction");
          };
        };

      };
      case (#Err(_)) {
        return #err("Error during transaction");
      };
    };

  };
  /**
getTakenQuizOfUser user to get list of survey of user which taken by him

@retrun {entries : [(Text, TakenByWithTitle)]; amount : Nat;}
@perms user:Principal, search : Text, startIndex : Nat, length : Nat

  **/
  public shared ({ caller }) func getTakenQuizOfUser(user : UserId, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Text, TakenByWithTitle)];
    amount : Nat;
  } {

    var sortedQuiz = Map.HashMap<Text, TakenByWithTitle>(0, Text.equal, Text.hash);

    for ((key, quiz) in quizStorage.entries()) {
      let isTaken = Array.find<TakenBy>(quiz.takenBy, func t = t.user == user);
      switch (isTaken) {
        case (null) {

        };
        case (?taken) {

          let tempTaken : TakenByWithTitle = {
            title = quiz.title;
            user = taken.user;
            score = taken.score;
            status = taken.status;
            timestamp = taken.timestamp;
            reward = taken.reward;
            remainingAttempts = taken.remainingAttempts;
            attemptAt = taken.attemptAt;
          };

          sortedQuiz.put(key, tempTaken);

        };

      };

    };
    let quizArray = Iter.toArray(sortedQuiz.entries());
    let resultQuiz = EntryStoreHelper.searchListQuizTakenBy(quizArray, search, startIndex, length, getModificationdate);
    return resultQuiz;
  };
  /**
getTakenQugetTakenSurveyOfUserzOfUser user to get list of survey of user which taken by him

@retrun {entries : [(Text, ServayTakenByList)]; amount : Nat;}
@perms user:Principal, search : Text, startIndex : Nat, length : Nat

  **/
  public shared ({ caller }) func getTakenSurveyOfUser(user : UserId, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Text, ServayTakenByList)];
    amount : Nat;
  } {

    var sortedSurvey = Map.HashMap<Text, ServayTakenByList>(0, Text.equal, Text.hash);

    for ((key, survey) in servayStorage.entries()) {
      let isTaken = Array.find<ServayTakenBy>(survey.takenBy, func t = t.user == user);
      switch (isTaken) {
        case (null) {

        };
        case (?taken) {
          let tempTaken : ServayTakenByList = {
            title = survey.title;
            user = taken.user;
            reward = taken.reward;
            attemptAt = taken.attemptAt;
          };

          sortedSurvey.put(key, tempTaken);

        };

      };

    };
    let surveyArray = Iter.toArray(sortedSurvey.entries());
    let resultQuiz = EntryStoreHelper.searchListSurveyTakenBy(surveyArray, search, startIndex, length, getModificationdate);
    return resultQuiz;
  };
  // ======= system function ======
  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_entries := Iter.toArray(entryStorage.entries());
    stable_web3 := Iter.toArray(web3Storage.entries());
    tstable_categories := Iter.toArray(categoryStorage.entries());
    stable_events := Iter.toArray(eventStorage.entries());
    stableQuiz := Iter.toArray(quizStorage.entries());
    stableQuestions := Iter.toArray(qustionsStorage.entries());
    stableServay := Iter.toArray(servayStorage.entries());
    stableServayQuestions := Iter.toArray(servayQustionsStorage.entries());
    stableFeaturedCampaign := Iter.toArray(featuredCampaignStorage.entries());
    stable_quiz_and_survey_record := Iter.toArray(quizAndSurveyTransectionsStorage.entries());
    stable_modification_date := Iter.toArray(entryModificationStorage.entries());

    Debug.print("pre-upgrade finished.");

  };
  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    entryStorage := Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    web3Storage := Map.fromIter<Key, Web3>(stable_web3.vals(), stable_web3.size(), Text.equal, Text.hash);
    categoryStorage := Map.fromIter<CategoryId, Category>(tstable_categories.vals(), tstable_categories.size(), Text.equal, Text.hash);
    eventStorage := Map.fromIter<EventId, Event>(stable_events.vals(), stable_events.size(), Text.equal, Text.hash);

    quizStorage := Map.fromIter<Text, Quiz>(stableQuiz.vals(), stableQuiz.size(), Text.equal, Text.hash);
    qustionsStorage := Map.fromIter<Text, [Question]>(stableQuestions.vals(), stableQuestions.size(), Text.equal, Text.hash);
    servayStorage := Map.fromIter<Text, Servay>(stableServay.vals(), stableServay.size(), Text.equal, Text.hash);
    servayQustionsStorage := Map.fromIter<Text, [ServayQuestion]>(stableServayQuestions.vals(), stableServayQuestions.size(), Text.equal, Text.hash);
    featuredCampaignStorage := Map.fromIter<Text, FeaturedCampaign>(stableFeaturedCampaign.vals(), stableFeaturedCampaign.size(), Text.equal, Text.hash);
    quizAndSurveyTransectionsStorage := Map.fromIter<Text, TransactionHistoryOfServayAndQuiz>(stable_quiz_and_survey_record.vals(), stable_quiz_and_survey_record.size(), Text.equal, Text.hash);
    entryModificationStorage := Map.fromIter<Key, EntriesModificationDate>(stable_modification_date.vals(), stable_modification_date.size(), Text.equal, Text.hash);

    stable_entries := [];
    stable_web3 := [];
    tstable_categories := [];
    stable_events := [];
    stableQuiz := [];
    stableQuestions := [];
    stableServay := [];
    stableServayQuestions := [];
    stableFeaturedCampaign := [];
    stable_quiz_and_survey_record := [];
    stable_modification_date := [];

    Debug.print("post-upgrade finished.");

  };

};
