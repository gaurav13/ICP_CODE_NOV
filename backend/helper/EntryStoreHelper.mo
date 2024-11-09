import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Map "mo:base/HashMap";

import ImageType "../model/ImageType";
import EntryType "../model/EntryType";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Prelude "mo:base/Prelude";
import Order "mo:base/Order";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Option "mo:base/Option";
import Prim "mo:prim";
import UserType "../model/UserType";
import Float "mo:base/Float";
import Int64 "mo:base/Int64";
import Nat64 "mo:base/Nat64";
module EntryStoreHelper {
  public type TopWinnerUserList = UserType.TopWinnerUserList;
  type Entry = EntryType.Entry;
  type UserId = EntryType.UserId;
  type InputEntry = EntryType.InputEntry;
  type EntryStorage = EntryType.EntryStorage;
  type EntryStatus = EntryType.EntryStatus;
  type TrendingEntryItemSidebar = EntryType.TrendingEntryItemSidebar;
  type UsersReward = UserType.UsersReward;
  type ListUserDashboard = UserType.ListUserDashboard;
  type UsersRewards = UserType.UsersRewards;
  type ReturnMenualAndArtificialReward = UserType.ReturnMenualAndArtificialReward;
  type ReturnMenualAndArtificialRewardList = [(Text, ReturnMenualAndArtificialReward)];

  type RewardValuesChangeRecordReturn = UserType.RewardValuesChangeRecordReturn;
  type RewardValuesChangeRecordReturnList = UserType.RewardValuesChangeRecordReturnList;
type ServayForUser = EntryType.ServayForUser;

  type EntryId = EntryType.EntryId;
  type ListEntryItem = EntryType.ListEntryItem;
  type ListPodcastItem = EntryType.ListPodcastItem;
  type Question = EntryType.Question;
  type Key = Text;
  type SubKey = EntryType.SubKey;

  type Id = UserType.Id;
  type ListUser = UserType.ListUser;
  type Subscriber = EntryType.Subscriber;
  type ListAdminUser = UserType.ListAdminUser;
  type CommentItem = UserType.CommentItem;
  type Comments = [CommentItem];

  type ImageStore = Trie.Trie<ImageId, ImageObject>;
  type ImageObject = ImageType.ImageObject;
  type NewImageObject = ImageType.NewImageObject;
  type ImageId = ImageType.ImageId;
  type CategoryId = EntryType.CategoryId;
  type Category = EntryType.Category;
  type Categories = [(CategoryId, Category)];
  type ListCategory = EntryType.ListCategory;
  type TopWeb3Category = EntryType.TopWeb3Category;
  type ListCategories = [(CategoryId, ListCategory)];
  type TopWeb3Categories = [(CategoryId, TopWeb3Category)];

  type EventId = EntryType.EventId;
  type Event = EntryType.Event;
  type Events = EntryType.Events;
  type EventStatus = EntryType.EventStatus;
  type TakenByWithTitle = EntryType.TakenByWithTitle;
  type ServayTakenByList = EntryType.ServayTakenByList;
type QuizForUser = EntryType.QuizForUser;
  type TokenClaimRequest = UserType.TokenClaimRequest;
  type TokenClaimRequests = UserType.TokenClaimRequests;
  let E8S : Nat = 100000000;
  // ==== quiz ======
  type Quiz = EntryType.Quiz;
  type ReturnQuizWithTitle = EntryType.ReturnQuizWithTitle;
  // ====== servay  ===
  type ServayQuestion = EntryType.ServayQuestion;
  type Servay = EntryType.Servay;
  type ServaywithTitle = EntryType.ServaywithTitle;
  type ServayQuestionTakenBy = EntryType.ServayQuestionTakenBy;
  // ======= featured campaing =======

  type FeaturedCampaignItem = EntryType.FeaturedCampaignItem;
  type FeaturedCampaign = EntryType.FeaturedCampaign;

  // transections
  type TransectionTypes = EntryType.TransectionTypes;
  type TransactionHistoryOfServayAndQuiz = EntryType.TransactionHistoryOfServayAndQuiz;
  public func addNewEntry(entryStorage : EntryStorage, entry : InputEntry, entryId : EntryId, caller : UserId, isDraftUpdate : Bool, draftId : Text, articlePool : Nat, stable_categories : [Text], coinsInOneIcp : Nat) : EntryStorage {

    var categories = entry.category;

    var tempcompanyId = "";

    // if (entry.isCompanySelected) {
    //   categories := [];
    // };
    // case ("AI") ?"AI";

    // case ("BlockChain") ?"BlockChain";
    // case ("Guide") ?"Guide";
    // case ("GameReview") ?"GameReview";
    // case (_) ?"Other";

    // switch (entry.category) {

    //   case ("AI") "AI";
    //   case ("BlockChain") "BlockChain";
    //   case ("Guide") "Guide";
    //   case ("GameReview") "GameReview";
    //   case (_) "Other";
    // };

    var entryStatus : EntryStatus = #pending;
    // if (not entry.isPodcast) {
    if (entry.isPromoted) {

      let oldEntry = entryStorage.get(draftId);
      switch (oldEntry) {
        case (?isEntry) {

          let icpOfArticlePool : Float = Float.fromInt(articlePool);
          let e8aValueInfloat : Float = Float.fromInt(E8S);
          let coinsInOneIcpFloat : Float = Float.fromInt(coinsInOneIcp);

          var newArticleTokens = (icpOfArticlePool / e8aValueInfloat) * coinsInOneIcpFloat;
          let newArticlePoolNat : Nat = Nat64.toNat(Int64.toNat64(Float.toInt64(newArticleTokens)));
          let mergedPromotionICP = newArticlePoolNat + isEntry.promotionICP;
          tempcompanyId := isEntry.companyId;
          if (not entry.isCompanySelected) {
            tempcompanyId := "";
          };
          var tempImg : ?NewImageObject = null;
          if (entry.image != null) {

            tempImg := entry.image;

          };
          var temppodcastImg : ?NewImageObject = null;
          if (entry.podcastImg != null) {

            temppodcastImg := entry.podcastImg;

          };
          let newPromotion = List.push<Int>(Time.now() / 1000000, isEntry.promotionHistory);
          let tempEntry : Entry = {
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
            isPromoted = entry.isPromoted;
            // promotionLikesTarget = isEntry.promotionLikesTarget;
            promotionICP = mergedPromotionICP;
            minters = isEntry.minters;
            userName = isEntry.userName;
            status = isEntry.status;
            promotionHistory = newPromotion;
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
          let oldEntry = entryStorage.replace(draftId, tempEntry);
          let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
          return newEntryStorage;

        };
        case (null) {
          return entryStorage;
        };
      };
    } else {
      var tempcompanyId = "";
      tempcompanyId := entry.companyId;
      if (not entry.isCompanySelected) {
        tempcompanyId := "";
      };
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
        creation_time = Time.now() / 1000000;
        user = caller;
        views = 0;
        likes = 0;
        category = categories;
        seoTitle = entry.seoTitle;
        seoSlug = entry.seoSlug;
        viewedUsers = [];
        likedUsers = [];
        seoDescription = entry.seoDescription;
        seoExcerpt = entry.seoExcerpt;
        subscription = entry.subscription;
        isDraft = entry.isDraft;
        isPromoted = false;
        // promotionLikesTarget = entry.promotionLikesTarget;
        promotionICP = 0;
        minters = [];
        userName = entry.userName;
        status = entryStatus;
        promotionHistory = List.nil<Int>();
        pressRelease = entry.pressRelease;
        caption = entry.caption;
        tags = entry.tags;
        isCompanySelected = entry.isCompanySelected;
        companyId = tempcompanyId;
        isPodcast = entry.isPodcast;
        podcastVideoLink = entry.podcastVideoLink;
        podcastImgCation = entry.podcastImgCation;
        isStatic = false;
        podcastImg = temppodcastImg;
      };
      if (isDraftUpdate) {
        let oldEntry = entryStorage.get(draftId);
        var entryStatus : EntryStatus = #pending;
        switch (oldEntry) {
          case (?isEntry) {
            let tempEntryUpdate : Entry = {
              title = entry.title;
              description = entry.description;
              image = tempImg;
              creation_time = isEntry.creation_time;
              user = isEntry.user;
              views = isEntry.views;
              likes = isEntry.likes;
              category = entry.category;
              seoTitle = entry.seoTitle;
              seoSlug = entry.seoSlug;
              viewedUsers = isEntry.viewedUsers;
              likedUsers = isEntry.likedUsers;
              seoDescription = entry.seoDescription;
              seoExcerpt = entry.seoExcerpt;
              subscription = entry.subscription;
              isDraft = entry.isDraft;
              isPromoted = isEntry.isPromoted;
              // promotionLikesTarget = isEntry.promotionLikesTarget;
              promotionICP = isEntry.promotionICP;
              minters = isEntry.minters;
              userName = isEntry.userName;
              status = isEntry.status;
              promotionHistory = isEntry.promotionHistory;
              pressRelease = isEntry.pressRelease;
              caption = entry.caption;
              tags = entry.tags;
              isCompanySelected = entry.isCompanySelected;
              companyId = entry.companyId;
              isPodcast = isEntry.isPodcast;
              podcastVideoLink = entry.podcastVideoLink;
              podcastImgCation = entry.podcastImgCation;
              podcastImg = temppodcastImg;
              isStatic = isEntry.isStatic;
            };
            let oldEntry = entryStorage.replace(draftId, tempEntryUpdate);
            let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
            return newEntryStorage;

          };
          case (null) {

            let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
            return newEntryStorage;
          };
        };

      } else {
        entryStorage.put(entryId, tempEntry);
        let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
        return newEntryStorage;

      };
    };
    // } else {

    //   var tempcompanyId = "";
    //   tempcompanyId := entry.companyId;
    //   if (not entry.isCompanySelected) {
    //     tempcompanyId := "";
    //   };
    //   var tempImg : ?ImageObject = null;
    //   if (entry.image != null) {

    //     tempImg := entry.image;

    //   };
    //   var temppodcastImg : ?ImageObject = null;
    //   if (entry.podcastImg != null) {

    //     temppodcastImg := entry.podcastImg;

    //   };
    //   let tempEntry : Entry = {
    //     title = entry.title;
    //     description = entry.description;
    //     image = tempImg;
    //     creation_time = Time.now() / 1000000;
    //     user = caller;
    //     views = 0;
    //     likes = 0;
    //     category = categories;
    //     seoTitle = entry.seoTitle;
    //     seoSlug = entry.seoSlug;
    //     viewedUsers = [];
    //     likedUsers = [];
    //     seoDescription = entry.seoDescription;
    //     seoExcerpt = entry.seoExcerpt;
    //     subscription = entry.subscription;
    //     isDraft = false;
    //     isPromoted = false;
    //     // promotionLikesTarget = entry.promotionLikesTarget;
    //     promotionICP = 0;
    //     minters = [];
    //     userName = entry.userName;
    //     status = entryStatus;
    //     promotionHistory = List.nil<Int>();
    //     pressRelease = false;
    //     imageTags = [""];
    //     caption = "";
    //     tags = entry.tags;
    //     isCompanySelected = entry.isCompanySelected;
    //     companyId = tempcompanyId;
    //     isPodcast = true;
    //     podcastVideoLink = entry.podcastVideoLink;
    //     podcastImgCation = entry.podcastImgCation;
    //     podcastImg = temppodcastImg;
    //   };
    //   entryStorage.put(entryId, tempEntry);
    //   let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
    //   return newEntryStorage;
    // };

  };

  public func searchSortList(array : Map.HashMap<Key, ListEntryItem>, search : Text, startIndex : Nat, length : Nat) : {
    entries : [(Key, ListEntryItem)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedEntries = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);
    for ((key, entry) in array.entries()) {
      let title = Text.map(entry.title, Prim.charToLower);
      let user = Text.map(entry.userName, Prim.charToLower);
      var isTitleSearched = Text.contains(title, #text searchString);
      var isUserSearched = Text.contains(user, #text searchString);
      if (isTitleSearched or isUserSearched) {
        searchedEntries.put(key, entry);
      };
    };
    var searchedEntriesArray : [(Key, ListEntryItem)] = Iter.toArray(searchedEntries.entries());
    let compare = func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) : Order.Order {
      if (a.isPromoted and not b.isPromoted) {
        return #less;
      } else if (b.isPromoted and not a.isPromoted) {
        return #greater;
      } else {
        if (a.modificationDate > b.modificationDate) {
          return #less;
        } else if (a.modificationDate < b.modificationDate) {
          return #greater;
        } else {
          return #equal;
        };
      };
    };
    let sortedEntries = Array.sort(
      searchedEntriesArray,
      compare,
    );
    var paginatedArray : [(Key, ListEntryItem)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, ListEntryItem)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, ListEntryItem)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, ListEntryItem)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, ListEntryItem)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, ListEntryItem)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortCampaingList(array : Map.HashMap<Key, ListEntryItem>, search : Text, startIndex : Nat, length : Nat) : {
    entries : [(Key, ListEntryItem)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedEntries = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);
    for ((key, entry) in array.entries()) {
      let title = Text.map(entry.title, Prim.charToLower);
      let user = Text.map(entry.userName, Prim.charToLower);
      var isTitleSearched = Text.contains(title, #text searchString);
      var isUserSearched = Text.contains(user, #text searchString);
      if (isTitleSearched or isUserSearched) {
        searchedEntries.put(key, entry);
      };
    };
    var searchedEntriesArray : [(Key, ListEntryItem)] = Iter.toArray(searchedEntries.entries());
  
   
    var paginatedArray : [(Key, ListEntryItem)] = [];
    let size = searchedEntriesArray.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, ListEntryItem)>(searchedEntriesArray, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, ListEntryItem)>(searchedEntriesArray, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, ListEntryItem)>(searchedEntriesArray, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, ListEntryItem)>(searchedEntriesArray, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, ListEntryItem)>(searchedEntriesArray, 0, itemsPerPage);
    } else {
      paginatedArray := searchedEntriesArray;
    };
    return { entries = paginatedArray; amount = searchedEntriesArray.size() };
  };
  public func searchSortListOfCampaign(array : Map.HashMap<Key, FeaturedCampaignItem>, search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Key, FeaturedCampaignItem)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedCampaigns = Map.HashMap<Key, FeaturedCampaignItem>(0, Text.equal, Text.hash);
    for ((key, campaign) in array.entries()) {
      let camptitle = Text.map(campaign.title, Prim.charToLower);

      var isEntryIdSearched = Text.contains(camptitle, #text searchString);

      if (isEntryIdSearched) {
        searchedCampaigns.put(key, campaign);
      };
    };
    var searchedCampaignArray : [(Key, FeaturedCampaignItem)] = Iter.toArray(searchedCampaigns.entries());
    let compare = func((keyA : Key, a : FeaturedCampaignItem), (keyB : Key, b : FeaturedCampaignItem)) : Order.Order {

      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };

    };
    let sortedEntries = Array.sort(
      searchedCampaignArray,
      compare,
    );
    var paginatedArray : [(Key, FeaturedCampaignItem)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, FeaturedCampaignItem)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, FeaturedCampaignItem)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, FeaturedCampaignItem)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, FeaturedCampaignItem)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, FeaturedCampaignItem)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortListPodcast(array : Map.HashMap<Key, ListPodcastItem>, search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Key, ListPodcastItem)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedEntries = Map.HashMap<Key, ListPodcastItem>(0, Text.equal, Text.hash);
    for ((key, entry) in array.entries()) {
      let title = Text.map(entry.title, Prim.charToLower);
      let user = Text.map(entry.userName, Prim.charToLower);
      var isTitleSearched = Text.contains(title, #text searchString);
      var isUserSearched = Text.contains(user, #text searchString);
      if (isTitleSearched or isUserSearched) {
        searchedEntries.put(key, entry);
      };
    };
    var searchedEntriesArray : [(Key, ListPodcastItem)] = Iter.toArray(searchedEntries.entries());
    let compare = func((keyA : Key, a : ListPodcastItem), (keyB : Key, b : ListPodcastItem)) : Order.Order {
      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };

    };
    let sortedEntries = Array.sort(
      searchedEntriesArray,
      compare,
    );
    var paginatedArray : [(Key, ListPodcastItem)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size > startIndex and size >= (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, ListPodcastItem)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {

        paginatedArray := Array.subArray<(Key, ListPodcastItem)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, ListPodcastItem)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, ListPodcastItem)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, ListPodcastItem)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func sortTopWinner(array : Map.HashMap<Id, TopWinnerUserList>, search : Text, startIndex : Nat, length : Nat) : {
    users : [(Id, TopWinnerUserList)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedEntries = Map.HashMap<Id, TopWinnerUserList>(0, Principal.equal, Principal.hash);
    for ((key, entry) in array.entries()) {
      let user = Text.map(entry.name, Prim.charToLower);
      var isUserSearched = Text.contains(user, #text searchString);
      if (isUserSearched) {
        searchedEntries.put(key, entry);
      };
    };

    var searchedEntriesArray : [(Id, TopWinnerUserList)] = Iter.toArray(searchedEntries.entries());
    let compare = func((keyA : Id, a : TopWinnerUserList), (keyB : Id, b : TopWinnerUserList)) : Order.Order {
      if (a.totalReward > b.totalReward) {
        return #less;
      } else if (a.totalReward < b.totalReward) {
        return #greater;
      } else {
        return #equal;
      };

    };
    let sortedEntries = Array.sort(
      searchedEntriesArray,
      compare,
    );
    var paginatedArray : [(Id, TopWinnerUserList)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Id, TopWinnerUserList)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Id, TopWinnerUserList)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Id, TopWinnerUserList)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, TopWinnerUserList)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, TopWinnerUserList)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { users = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortUserList(array : Map.HashMap<Id, ListUser>, search : Text, startIndex : Nat, length : Nat) : {
    users : [(Id, ListUser)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedUsers = Map.HashMap<Id, ListUser>(0, Principal.equal, Principal.hash);
    for ((key, user) in array.entries()) {
      // let title = Text.map(user.title, Prim.charToLower);
      var name = "";
      switch (user.name) {
        case (?isName) {
          name := isName;
        };
        case (null) {

        };
      };
      let userName = Text.map(name, Prim.charToLower);
      // var isTitleSearched = Text.contains(title, #text searchString);
      var isUserSearched = Text.contains(userName, #text searchString);
      if (isUserSearched) {
        searchedUsers.put(key, user);
      };
    };
    var searchedUsersArray : [(Id, ListUser)] = Iter.toArray(searchedUsers.entries());
    let compare = func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) : Order.Order {
      if (a.joinedFrom > b.joinedFrom) {
        return #less;
      } else if (a.joinedFrom < b.joinedFrom) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedUsersArray,
      compare,
    );
    // let entryArray = Iter.toArray(searchedEntries.entries());
    var paginatedArray : [(Id, ListUser)] = [];
    let itemsPerPage = 10;
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Id, ListUser)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Id, ListUser)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Id, ListUser)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, ListUser)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, ListUser)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { users = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortUserListDashboard(array : Map.HashMap<Id, ListUserDashboard>, search : Text, startIndex : Nat, length : Nat) : {
    users : [(Id, ListUserDashboard)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedUsers = Map.HashMap<Id, ListUserDashboard>(0, Principal.equal, Principal.hash);
    for ((key, user) in array.entries()) {
      // let title = Text.map(user.title, Prim.charToLower);
      var name = "";
      switch (user.name) {
        case (?isName) {
          name := isName;
        };
        case (null) {

        };
      };
      let userName = Text.map(name, Prim.charToLower);
      // var isTitleSearched = Text.contains(title, #text searchString);
      var isUserSearched = Text.contains(userName, #text searchString);
      if (isUserSearched) {
        searchedUsers.put(key, user);
      };
    };
    var searchedUsersArray : [(Id, ListUserDashboard)] = Iter.toArray(searchedUsers.entries());
    let compare = func((keyA : Id, a : ListUserDashboard), (keyB : Id, b : ListUserDashboard)) : Order.Order {
      if (a.joinedFrom > b.joinedFrom) {
        return #less;
      } else if (a.joinedFrom < b.joinedFrom) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedUsersArray,
      compare,
    );
    // let entryArray = Iter.toArray(searchedEntries.entries());
    var paginatedArray : [(Id, ListUserDashboard)] = [];
    let itemsPerPage = 10;
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Id, ListUserDashboard)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Id, ListUserDashboard)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Id, ListUserDashboard)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, ListUserDashboard)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, ListUserDashboard)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { users = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortReward(rewardArray : UsersRewards, startIndex : Nat, length : Nat) : {
    reward : UsersRewards;
    amount : Nat;
  } {

    let compare = func(a : UsersReward, b : UsersReward) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      rewardArray,
      compare,
    );
    // let entryArray = Iter.toArray(searchedEntries.entries());
    var paginatedArray : UsersRewards = [];
    let itemsPerPage = 10;
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<UsersReward>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<UsersReward>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<UsersReward>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<UsersReward>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<UsersReward>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };
    return { reward = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchArtificialAndMenualRewardList(rewardArray : Map.HashMap<Text, ReturnMenualAndArtificialReward>, search : Text, startIndex : Nat, length : Nat) : {
    reward : ReturnMenualAndArtificialRewardList;
    amount : Nat;
  } {

    let searchString = Text.map(search, Prim.charToLower);
    var searchedRewardList = Map.HashMap<Text, ReturnMenualAndArtificialReward>(0, Text.equal, Text.hash);
    for ((key, item) in rewardArray.entries()) {

      let senderName = Text.map(item.senderName, Prim.charToLower);
      let receiverName = Text.map(item.receiverName, Prim.charToLower);

      var isUserSearched1 = Text.contains(senderName, #text searchString);
      var isUserSearched2 = Text.contains(receiverName, #text searchString);

      if (isUserSearched1 or isUserSearched2) {
        searchedRewardList.put(key, item);
      };
    };

    var searchedRewardsArray : ReturnMenualAndArtificialRewardList = Iter.toArray(searchedRewardList.entries());
    let compare = func((keyA : Text, a : ReturnMenualAndArtificialReward), (keyB : Text, b : ReturnMenualAndArtificialReward)) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedRewardsArray,
      compare,
    );
    // let entryArray = Iter.toArray(searchedEntries.entries());
    var paginatedArray : ReturnMenualAndArtificialRewardList = [];
    let itemsPerPage = 10;
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, ReturnMenualAndArtificialReward)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, ReturnMenualAndArtificialReward)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, ReturnMenualAndArtificialReward)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, ReturnMenualAndArtificialReward)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, ReturnMenualAndArtificialReward)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };
    return { reward = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchRewardChangerList(rewardArray : Map.HashMap<Text, RewardValuesChangeRecordReturn>, search : Text, startIndex : Nat, length : Nat) : {
    entries : RewardValuesChangeRecordReturnList;
    amount : Nat;
  } {

    let searchString = Text.map(search, Prim.charToLower);
    var searchedRewardList = Map.HashMap<Text, RewardValuesChangeRecordReturn>(0, Text.equal, Text.hash);
    for ((key, item) in rewardArray.entries()) {

      let senderName = Text.map(item.changerName, Prim.charToLower);
      let rewardType = Text.map(item.rewardType, Prim.charToLower);

      var isUserSearched = Text.contains(senderName, #text searchString);
      var isUserSearched2 = Text.contains(rewardType, #text searchString);

      if (isUserSearched or isUserSearched2) {
        searchedRewardList.put(key, item);
      };
    };

    var searchedRewardsArray : RewardValuesChangeRecordReturnList = Iter.toArray(searchedRewardList.entries());
    let compare = func((keyA : Text, a : RewardValuesChangeRecordReturn), (keyB : Text, b : RewardValuesChangeRecordReturn)) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedRewardsArray,
      compare,
    );
    // let entryArray = Iter.toArray(searchedEntries.entries());
    var paginatedArray : RewardValuesChangeRecordReturnList = [];
    let itemsPerPage = 10;
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, RewardValuesChangeRecordReturn)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, RewardValuesChangeRecordReturn)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, RewardValuesChangeRecordReturn)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, RewardValuesChangeRecordReturn)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, RewardValuesChangeRecordReturn)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortAdminUserList(array : Map.HashMap<Id, ListAdminUser>, search : Text, startIndex : Nat, length : Nat) : {
    users : [(Id, ListAdminUser)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedUsers = Map.HashMap<Id, ListAdminUser>(0, Principal.equal, Principal.hash);
    for ((key, user) in array.entries()) {
      // let title = Text.map(user.title, Prim.charToLower);
      var name = "";
      switch (user.name) {
        case (?isName) {
          name := isName;
        };
        case (null) {

        };
      };
      let userName = Text.map(name, Prim.charToLower);
      // var isTitleSearched = Text.contains(title, #text searchString);
      var isUserSearched = Text.contains(userName, #text searchString);
      if (isUserSearched) {
        searchedUsers.put(key, user);
      };
    };
    var searchedUsersArray : [(Id, ListAdminUser)] = Iter.toArray(searchedUsers.entries());
    let compare = func((keyA : Id, a : ListAdminUser), (keyB : Id, b : ListAdminUser)) : Order.Order {
      if (a.joinedFrom > b.joinedFrom) {
        return #less;
      } else if (a.joinedFrom < b.joinedFrom) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedUsersArray,
      compare,
    );
    // let entryArray = Iter.toArray(searchedEntries.entries());
    var paginatedArray : [(Id, ListAdminUser)] = [];
    let size = sortedEntries.size();
    let itemsPerPage = 4;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Id, ListAdminUser)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      paginatedArray := Array.subArray<(Id, ListAdminUser)>(sortedEntries, startIndex, itemsPerPage);

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      let amount : Nat = size - startIndex;
      paginatedArray := Array.subArray<(Id, ListAdminUser)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Id, ListAdminUser)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { users = paginatedArray; amount = sortedEntries.size() };
  };
  public func sortEntriesByLatest(array : [(Key, Entry)], getModificationdate : (Key, Int) -> Int) : [(Key, Entry)] {
    let compare = func((keyA : Key, a : Entry), (keyB : Key, b : Entry)) : Order.Order {
      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    Array.sort(
      array,
      compare,
    );
  };
  public func sortTrendingEntriesByLatest(array : [(Key, TrendingEntryItemSidebar)], getModificationdate : (Key, Int) -> Int) : [(Key, TrendingEntryItemSidebar)] {
    let compare = func((keyA : Key, a : TrendingEntryItemSidebar), (keyB : Key, b : TrendingEntryItemSidebar)) : Order.Order {
      let firstItemoMdificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemoMdificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemoMdificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    Array.sort(
      array,
      compare,
    );
  };
  public func paginateEntriesByLatest(array : [(Key, Entry)], startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Key, Entry)];
    amount : Nat;
  } {
    let compare = func((keyA : Key, a : Entry), (keyB : Key, b : Entry)) : Order.Order {
      let firstItemoMdificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemoMdificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemoMdificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      array,
      compare,
    );
    var paginatedArray : [(Key, Entry)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 3;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortEntries(array : [(Key, Entry)], search : Text, page : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Key, Entry)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedEntries = Map.HashMap<Key, Entry>(0, Text.equal, Text.hash);
    for ((key, entry) in array.vals()) {
      let entryTitle = Text.map(entry.title, Prim.charToLower);
      var isEntrySearched = Text.contains(entryTitle, #text searchString);
      if (isEntrySearched) {
        searchedEntries.put(key, entry);
      } else {
        for (tag in entry.tags.vals()) {
          let tagLower = Text.map(tag, Prim.charToLower);
          var isTagSearched = Text.contains(tagLower, #text searchString);
          if (isTagSearched) {
            searchedEntries.put(key, entry);
          };
        };
      };
    };
    var searchedEntriesArray : [(Key, Entry)] = Iter.toArray(searchedEntries.entries());
    let compare = func((keyA : Key, a : Entry), (keyB : Key, b : Entry)) : Order.Order {
      let firstItemoMdificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemoMdificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemoMdificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedEntries = Array.sort(
      searchedEntriesArray,
      compare,
    );
   
     let totalEntries = Array.size(sortedEntries);
    let startIndex : Nat = page * length;
    if (startIndex >= totalEntries) {
      return { amount = totalEntries; entries = [] };
    };

    var endIndex : Nat = startIndex + length;
    if (endIndex > totalEntries) {
      endIndex := totalEntries;
    };

    let slicedEntries = Iter.toArray(Array.slice<(Key, Entry)>(sortedEntries, startIndex, endIndex));
    return {
      amount = totalEntries;
      entries = slicedEntries;
    };
  };
  public func searchSortTaggedEntries(array : [(Key, Entry)], search : Text, tag : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Key, Entry)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    let tagString = Text.map(tag, Prim.charToLower);
    var searchedEntries = Map.HashMap<Key, Entry>(0, Text.equal, Text.hash);
    for ((key, entry) in array.vals()) {
      let entryTitle = Text.map(entry.title, Prim.charToLower);
      var isEntrySearched = Text.contains(entryTitle, #text searchString);

      for (tag in entry.tags.vals()) {
        let tagLower = Text.map(tag, Prim.charToLower);
        var isTagSearched = Text.contains(tagLower, #text tagString);
        if (isTagSearched) {
          if (isEntrySearched) {
            searchedEntries.put(key, entry);
          };
        };
      };

    };
    var searchedEntriesArray : [(Key, Entry)] = Iter.toArray(searchedEntries.entries());
    let compare = func((keyA : Key, a : Entry), (keyB : Key, b : Entry)) : Order.Order {
      let firstItemoMdificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemoMdificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemoMdificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedEntriesArray,
      compare,
    );
    var paginatedArray : [(Key, Entry)] = [];
    let size = sortedEntries.size();
    if (startIndex > size) {
      return { entries = []; amount = 0 };
    };
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    // size > startIndex and
    if (size >= (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, length);
      // size > startIndex and
    } else if (size >= (startIndex + itemsPerPage)) {
      // paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, itemsPerPage);
      // size > startIndex and
      // size < (startIndex + itemsPerPage) and
    } else {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);

    };
    // else if (size > startIndex) {
    //   paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);

    // } else if (size > itemsPerPage) {
    //   // paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, 0, itemsPerPage);

    // } else {
    //   // paginatedArray := sortedEntries;
    // };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortComments(array : [CommentItem], startIndex : Nat, length : Nat) : {
    entries : [CommentItem];
    amount : Nat;
  } {

    let compare = func(a : CommentItem, b : CommentItem) : Order.Order {

      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      array,
      compare,
    );
    var paginatedArray : [CommentItem] = [];
    let size = sortedEntries.size();
    if (startIndex > size) {
      return { entries = []; amount = 0 };
    };
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    // size > startIndex and
    if (size >= (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<CommentItem>(sortedEntries, startIndex, length);
      // size > startIndex and
    } else if (size >= (startIndex + itemsPerPage)) {
      // paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);
      paginatedArray := Array.subArray<CommentItem>(sortedEntries, startIndex, itemsPerPage);
      // size > startIndex and
      // size < (startIndex + itemsPerPage) and
    } else {
      paginatedArray := Array.subArray<CommentItem>(sortedEntries, startIndex, amount);

    };
    // else if (size > startIndex) {
    //   paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, startIndex, amount);

    // } else if (size > itemsPerPage) {
    //   // paginatedArray := Array.subArray<(Key, Entry)>(sortedEntries, 0, itemsPerPage);

    // } else {
    //   // paginatedArray := sortedEntries;
    // };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func paginateSubscribersByLatest(array : [Subscriber], startIndex : Nat, length : Nat) : {
    entries : [Subscriber];
    amount : Nat;
  } {
    let compare = func(a : Subscriber, b : Subscriber) : Order.Order {
      if (a.subscribed_on > b.subscribed_on) {
        return #less;
      } else if (a.subscribed_on < b.subscribed_on) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      array,
      compare,
    );
    var paginatedArray : [Subscriber] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 11;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchCategories(array : TopWeb3Categories, search : Text, startIndex : Nat, length : Nat, isParentOnly : Bool) : {
    entries : TopWeb3Categories;
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedCategories = Map.HashMap<CategoryId, TopWeb3Category>(0, Text.equal, Text.hash);
    for ((key, category) in array.vals()) {
      let categoryName = Text.map(category.name, Prim.charToLower);
      var isCategorySearch = Text.contains(categoryName, #text searchString);
      // Check if the category is searched and is not a child category
      if (isCategorySearch) {
        if ((isParentOnly and not category.isChild) or not isParentOnly) {
          searchedCategories.put(key, category);
        };
      };
    };
    var searchedCategoriesArray : [(CategoryId, TopWeb3Category)] = Iter.toArray(searchedCategories.entries());

    let compare = func((keyA : CategoryId, a : TopWeb3Category), (keyB : CategoryId, b : TopWeb3Category)) : Order.Order {
      if (a.directoryCount > b.directoryCount) {
        return #less;
      } else if (a.directoryCount < b.directoryCount) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedCategoriesArray,
      compare,
    );
    var paginatedArray : TopWeb3Categories = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(CategoryId, TopWeb3Category)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(CategoryId, TopWeb3Category)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(CategoryId, TopWeb3Category)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(CategoryId, TopWeb3Category)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(CategoryId, TopWeb3Category)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(CategoryId, TopWeb3Category)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListCategories(array : Categories, search : Text, startIndex : Nat, length : Nat, isParentOnly : Bool, getModificationdate : (Key, Int) -> Int) : {
    entries : ListCategories;
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedCategories = Map.HashMap<CategoryId, ListCategory>(0, Text.equal, Text.hash);
    for ((key, category) in array.vals()) {
      let categoryName = Text.map(category.name, Prim.charToLower);
      var isCategorySearch = Text.contains(categoryName, #text searchString);
      // Check if the category is searched and is not a child category
      if (isCategorySearch) {
        if ((isParentOnly and not category.isChild) or not isParentOnly) {
          searchedCategories.put(key, category);
        };
      };
    };
    var searchedCategoriesArray : [(CategoryId, ListCategory)] = Iter.toArray(searchedCategories.entries());

    let compare = func((keyA : CategoryId, a : ListCategory), (keyB : CategoryId, b : ListCategory)) : Order.Order {
      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedCategoriesArray,
      compare,
    );
    var paginatedArray : ListCategories = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(CategoryId, ListCategory)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(CategoryId, ListCategory)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(CategoryId, ListCategory)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(CategoryId, ListCategory)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(CategoryId, ListCategory)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };
    // else if (size > itemsPerPage) {
    //   paginatedArray := Array.subArray<(CategoryId, ListCategory)>(sortedEntries, 0, itemsPerPage);
    // }
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };

  public func searchListQuiz(array : [(Text, QuizForUser)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, QuizForUser)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedQuiz = Map.HashMap<Text, QuizForUser>(0, Text.equal, Text.hash);

    for ((key, quiz) in array.vals()) {
      let quizTitle = Text.map(quiz.title, Prim.charToLower);
      var isQuizSearch = Text.contains(quizTitle, #text searchString);
      // Check if the category is searched and is not a child category
      if (isQuizSearch) {

        sortedQuiz.put(key, quiz);

      };
    };
    var searchedQuizArray : [(Text, QuizForUser)] = Iter.toArray(sortedQuiz.entries());

    let compare = func((keyA : Text, a : QuizForUser), (keyB : Text, b : QuizForUser)) : Order.Order {

      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedQuizArray,
      compare,
    );
    var paginatedArray : [(Text, QuizForUser)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, QuizForUser)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, QuizForUser)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, QuizForUser)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, QuizForUser)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, QuizForUser)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };

  public func searchListQuizWithTitle(array : [(Text, ReturnQuizWithTitle)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, ReturnQuizWithTitle)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedQuiz = Map.HashMap<Text, ReturnQuizWithTitle>(0, Text.equal, Text.hash);

    for ((key, quiz) in array.vals()) {
      let quizTitle = Text.map(quiz.title, Prim.charToLower);
      var isQuizSearch = Text.contains(quizTitle, #text searchString);
      // Check if the category is searched and is not a child category
      if (isQuizSearch) {

        sortedQuiz.put(key, quiz);

      };
    };
    var searchedQuizArray : [(Text, ReturnQuizWithTitle)] = Iter.toArray(sortedQuiz.entries());

    let compare = func((keyA : Text, a : ReturnQuizWithTitle), (keyB : Text, b : ReturnQuizWithTitle)) : Order.Order {

      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedQuizArray,
      compare,
    );
    var paginatedArray : [(Text, ReturnQuizWithTitle)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, ReturnQuizWithTitle)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, ReturnQuizWithTitle)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, ReturnQuizWithTitle)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, ReturnQuizWithTitle)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, ReturnQuizWithTitle)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListSurveyTakenBy(array : [(Text, ServayTakenByList)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, ServayTakenByList)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedQuiz = Map.HashMap<Text, ServayTakenByList>(0, Text.equal, Text.hash);

    for ((key, quiz) in array.vals()) {
      let quizTitle = Text.map(quiz.title, Prim.charToLower);
      var isQuizSearch = Text.contains(quizTitle, #text searchString);
      // Check if the category is searched and is not a child category
      if (isQuizSearch) {

        sortedQuiz.put(key, quiz);

      };
    };
    var searchedQuizArray : [(Text, ServayTakenByList)] = Iter.toArray(sortedQuiz.entries());

    let compare = func((keyA : Text, a : ServayTakenByList), (keyB : Text, b : ServayTakenByList)) : Order.Order {

      let firstItemModificationDate = getModificationdate(keyA, a.attemptAt);
      let secondItemModificationDate = getModificationdate(keyB, b.attemptAt);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedQuizArray,
      compare,
    );
    var paginatedArray : [(Text, ServayTakenByList)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, ServayTakenByList)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, ServayTakenByList)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, ServayTakenByList)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, ServayTakenByList)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, ServayTakenByList)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListQuizTakenBy(array : [(Text, TakenByWithTitle)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, TakenByWithTitle)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedQuiz = Map.HashMap<Text, TakenByWithTitle>(0, Text.equal, Text.hash);

    for ((key, quiz) in array.vals()) {
      let quizTitle = Text.map(quiz.title, Prim.charToLower);
      var isQuizSearch = Text.contains(quizTitle, #text searchString);
      // Check if the category is searched and is not a child category
      if (isQuizSearch) {

        sortedQuiz.put(key, quiz);

      };
    };
    var searchedQuizArray : [(Text, TakenByWithTitle)] = Iter.toArray(sortedQuiz.entries());

    let compare = func((keyA : Text, a : TakenByWithTitle), (keyB : Text, b : TakenByWithTitle)) : Order.Order {

      let firstItemModificationDate = getModificationdate(keyA, a.attemptAt);
      let secondItemModificationDate = getModificationdate(keyB, b.attemptAt);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedQuizArray,
      compare,
    );
    var paginatedArray : [(Text, TakenByWithTitle)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, TakenByWithTitle)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, TakenByWithTitle)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, TakenByWithTitle)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, TakenByWithTitle)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, TakenByWithTitle)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListQuizAndSurveyTrans(array : [(Text, TransactionHistoryOfServayAndQuiz)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, TransactionHistoryOfServayAndQuiz)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sorted = Map.HashMap<Text, TransactionHistoryOfServayAndQuiz>(0, Text.equal, Text.hash);

    for ((key, entry) in array.vals()) {
      let entryId = Text.map(entry.id, Prim.charToLower);
      var isSearch = Text.contains(entryId, #text searchString);
      // Check if the category is searched and is not a child category
      if (isSearch) {

        sorted.put(key, entry);

      };
    };
    var searchedArray : [(Text, TransactionHistoryOfServayAndQuiz)] = Iter.toArray(sorted.entries());

    let compare = func((keyA : Text, a : TransactionHistoryOfServayAndQuiz), (keyB : Text, b : TransactionHistoryOfServayAndQuiz)) : Order.Order {
      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedArray,
      compare,
    );
    var paginatedArray : [(Text, TransactionHistoryOfServayAndQuiz)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, TransactionHistoryOfServayAndQuiz)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, TransactionHistoryOfServayAndQuiz)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, TransactionHistoryOfServayAndQuiz)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, TransactionHistoryOfServayAndQuiz)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, TransactionHistoryOfServayAndQuiz)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchTakenByList(array : [ServayQuestionTakenBy], search : Text, startIndex : Nat, length : Nat) : {
    entries : [ServayQuestionTakenBy];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedTaken : [ServayQuestionTakenBy] = [];

    for (taken in array.vals()) {
      let suggestion = Text.map(taken.userSuggestion, Prim.charToLower);
      var isTakenSearch = Text.contains(suggestion, #text searchString);
      // Check if the category is searched and is not a child category
      if (isTakenSearch) {

        sortedTaken := Array.append(sortedTaken, [taken]);

      };
    };

    let compare = func(a : ServayQuestionTakenBy, b : ServayQuestionTakenBy) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      sortedTaken,
      compare,
    );
    var paginatedArray : [ServayQuestionTakenBy] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<ServayQuestionTakenBy>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<ServayQuestionTakenBy>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<ServayQuestionTakenBy>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<ServayQuestionTakenBy>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<ServayQuestionTakenBy>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListServay(array : [(Text, ServayForUser)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, ServayForUser)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedServay = Map.HashMap<Text, ServayForUser>(0, Text.equal, Text.hash);

    for ((key, quiz) in array.vals()) {
      let servayTitle = Text.map(quiz.title, Prim.charToLower);
      var isServaySearch = Text.contains(servayTitle, #text searchString);
      // Check if the category is searched and is not a child category
      if (isServaySearch) {

        sortedServay.put(key, quiz);

      };
    };
    var searchedServayArray : [(Text, ServayForUser)] = Iter.toArray(sortedServay.entries());

    let compare = func((keyA : Text, a : ServayForUser), (keyB : Text, b : ServayForUser)) : Order.Order {
      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedServayArray,
      compare,
    );
    var paginatedArray : [(Text, ServayForUser)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, ServayForUser)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, ServayForUser)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, ServayForUser)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, ServayForUser)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, ServayForUser)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListServaywithTitle(array : [(Text, ServaywithTitle)], search : Text, startIndex : Nat, length : Nat, getModificationdate : (Key, Int) -> Int) : {
    entries : [(Text, ServaywithTitle)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var sortedServay = Map.HashMap<Text, ServaywithTitle>(0, Text.equal, Text.hash);

    for ((key, quiz) in array.vals()) {
      let servayTitle = Text.map(quiz.title, Prim.charToLower);
      var isServaySearch = Text.contains(servayTitle, #text searchString);
      // Check if the category is searched and is not a child category
      if (isServaySearch) {

        sortedServay.put(key, quiz);

      };
    };
    var searchedServayArray : [(Text, ServaywithTitle)] = Iter.toArray(sortedServay.entries());

    let compare = func((keyA : Text, a : ServaywithTitle), (keyB : Text, b : ServaywithTitle)) : Order.Order {
      let firstItemModificationDate = getModificationdate(keyA, a.creation_time);
      let secondItemModificationDate = getModificationdate(keyB, b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedServayArray,
      compare,
    );
    var paginatedArray : [(Text, ServaywithTitle)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Text, ServaywithTitle)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Text, ServaywithTitle)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Text, ServaywithTitle)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Text, ServaywithTitle)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Text, ServaywithTitle)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListQuizQuestion(array : [Question], search : Text, startIndex : Nat, length : Nat) : {
    entries : [Question];
    amount : Nat;
  } {

    let searchString = Text.map(search, Prim.charToLower);
    // var sortedQuiz =Map.HashMap<Text, Quiz>(0, Text.equal, Text.hash);
    let tempSearchedArray = Array.filter<Question>(
      array,
      func(item) {
        let questionTitle = Text.map(item.title, Prim.charToLower);
        var isQuestionSearch = Text.contains(questionTitle, #text searchString);
        // Check if the category is searched and is not a child category
        if (isQuestionSearch) {

          return true;

        } else {
          return false;

        };
      },
    );
    let compare = func(a : Question, b : Question) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };

    };
    let sortedEntries = Array.sort(
      tempSearchedArray,
      compare,
    );
    var paginatedArray : [Question] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<Question>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<Question>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<Question>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<Question>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<Question>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchListServayQuestion(array : [ServayQuestion], search : Text, startIndex : Nat, length : Nat) : {
    entries : [ServayQuestion];
    amount : Nat;
  } {

    let searchString = Text.map(search, Prim.charToLower);
    // var sortedQuiz =Map.HashMap<Text, Quiz>(0, Text.equal, Text.hash);
    let tempSearchedArray = Array.filter<ServayQuestion>(
      array,
      func(item) {
        let questionTitle = Text.map(item.title, Prim.charToLower);
        var isQuestionSearch = Text.contains(questionTitle, #text searchString);
        // Check if the category is searched and is not a child category
        if (isQuestionSearch) {

          return true;

        } else {
          return false;

        };
      },
    );
    let compare = func(a : ServayQuestion, b : ServayQuestion) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };

    };
    let sortedEntries = Array.sort(
      tempSearchedArray,
      compare,
    );
    var paginatedArray : [ServayQuestion] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<ServayQuestion>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<ServayQuestion>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<ServayQuestion>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<ServayQuestion>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<ServayQuestion>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchEvents(array : Events, search : Text, startIndex : Nat, length : Nat, status : EventStatus, month : ?Nat, country : ?Text, city : ?Text, tagString : Text) : {
    entries : Events;
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedEvents = Map.HashMap<EventId, Event>(0, Text.equal, Text.hash);
    let currentTime = Time.now() / 1000000;
    for ((key, event) in array.vals()) {
      var isEventSearched = false;
      if (Text.trim(tagString, #char ' ') == "") {
        let eventName = Text.map(event.title, Prim.charToLower);
         isEventSearched := Text.contains(eventName, #text searchString);

      };

      for (tag in event.tags.vals()) {

        let tagLower = Text.map(tag, Prim.charToLower);
        var isTagSearched = false;
        if (tagLower == tagString) {
          isTagSearched := true;
        };

        if (not isEventSearched and isTagSearched) isEventSearched := isTagSearched;
      };

      var isStatusMatched = false;
      switch (status) {
        case (#all) {
          isStatusMatched := true;
        };
        case (#past) {
          if (event.endDate <= currentTime) {
            isStatusMatched := true;
          } else {
            isStatusMatched := false;
          };

        };
        case (#upcoming) {
          if (event.date >= currentTime) {
            isStatusMatched := true;
          } else {
            isStatusMatched := false;
          };
        };
        case (#ongoing) {
          if (event.date <= currentTime and event.endDate >= currentTime) {
            isStatusMatched := true;
          } else {
            isStatusMatched := false;
          };
        };
      };

      if (isEventSearched and isStatusMatched) {
        switch (month) {
          case (?isMonth) {
            if (event.month == isMonth) {
              switch (country) {
                case (?isCountry) {
                  if (event.country == isCountry) {
                    switch (city) {
                      case (?isCity) {
                        if (event.city == isCity) {
                          searchedEvents.put(key, event);
                        };
                      };
                      case (null) {
                        searchedEvents.put(key, event);

                      };
                    };
                  };
                };
                case (null) {
                  switch (city) {
                    case (?isCity) {
                      if (event.city == isCity) {
                        searchedEvents.put(key, event);
                      };
                    };
                    case (null) {
                      searchedEvents.put(key, event);

                    };
                  };
                };
              };
            };
          };
          case (null) {
            switch (country) {
              case (?isCountry) {
                if (event.country == isCountry) {
                  switch (city) {
                    case (?isCity) {
                      if (event.city == isCity) {
                        searchedEvents.put(key, event);
                      };
                    };
                    case (null) {
                      searchedEvents.put(key, event);

                    };
                  };
                };
              };
              case (null) {
                switch (city) {
                  case (?isCity) {
                    if (event.city == isCity) {
                      searchedEvents.put(key, event);
                    };
                  };
                  case (null) {
                    searchedEvents.put(key, event);

                  };
                };
              };
            };
          };
        };

      };
    };
    var searchedEventsArray : [(EventId, Event)] = Iter.toArray(searchedEvents.entries());
    let absDiff = func(a : Time.Time, b : Time.Time) : Time.Time {
      if (a > b) {
        return a - b;
      } else {
        return b - a;
      };
    };
    let compare = func((keyA : EventId, a : Event), (keyB : EventId, b : Event)) : Order.Order {
      // if (a.date < b.date) {
      //   return #less;
      // } else if (a.date > b.date) {
      //   return #greater;
      // } else {
      //   return #equal;
      // };
      let currentDate = Time.now() / 1000000; // Get the current time as an Int
      let diffA = absDiff(currentDate, a.date);
      let diffB = absDiff(currentDate, b.date);

      if (diffA < diffB) {
        return #less;
      } else if (diffA > diffB) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedEntries = Array.sort(
      searchedEventsArray,
      compare,
    );
    var paginatedArray : Events = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(EventId, Event)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(EventId, Event)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(EventId, Event)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(EventId, Event)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(EventId, Event)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(EventId, Event)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
   public func paginatedTokensClaimRequest(array : TokenClaimRequests, startIndex : Nat, length : Nat) : {
    entries : TokenClaimRequests;
    amount : Nat;
  } {
    let compare = func((keyA : Key, a : TokenClaimRequest), (keyB : Key, b : TokenClaimRequest)) : Order.Order {
      let firstItemModificationDate =  a.creation_time;
      let secondItemModificationDate =  b.creation_time;
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      array,
      compare,
    );
    var paginatedArray : TokenClaimRequests = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 3;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, TokenClaimRequest)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, TokenClaimRequest)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, TokenClaimRequest)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, TokenClaimRequest)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Key, TokenClaimRequest)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, TokenClaimRequest)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size();};
  };

};
