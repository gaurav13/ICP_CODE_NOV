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
import Prim "mo:prim";
import UserType "../model/UserType";

module Web3StoreHelper {
  type Web3Storage = EntryType.Web3Storage;
  type Web3 = EntryType.Web3;
  type UserId = EntryType.UserId;
  type Web3List = EntryType.Web3List;
  type Web3DashboardList = EntryType.Web3DashboardList;

  type Web3Status = EntryType.Web3Status;
  type InputWeb3 = EntryType.InputWeb3;
  type Id = Principal;
  type Key = Text;
  private let MAX_LINK_CHARS = 2048;
    private let MAX_EMAIL_CHARS = 320;
  public func companyExists(company : Text, web3Storage : Web3Storage) : Bool {
    // let users = Map.HashMap.entries<Id, User>(userStorage);
    for ((_, web3) : (Text, Web3) in web3Storage.entries()) {

      if (web3.company == company) {
        return true;
      };

    };
    return false;
  };
  public func addNewWeb3(web3Storage : Web3Storage, web3 : InputWeb3, web3Id : Text, caller : UserId, isEdit : Bool) : Web3Storage {

    // var categories = Array.mapFilter<Text, Text>(
    //   entry.category,
    //   func(x) {
    //     var found = false;
    //     for (cat in stable_categories.vals()) {
    //       if (x == cat) {
    //         found := true;
    //       };
    //     };
    //     if (found) {
    //       ?x;
    //     } else {
    //       ?"Other";
    //     };
    //   },
    // );

    // for ((key, entry) in web3Storage.entries()) {
    //   if (entry.company == web3.company) {
    //     return #err("Company already exists.");
    //   };
    // };
    var tempWebsite = "";
    var tempFacebookLink = "";
    var tempLinkinLink = "";
    var tempInstagrameLink = "";
    var tempdiscordLink = "";
    var temptelegramLink = "";
    var temptwitterLink = "";
    assert web3.companyUrl.size() <= MAX_LINK_CHARS;
    tempWebsite := web3.companyUrl;

    assert web3.facebook.size() <= MAX_LINK_CHARS;
    tempFacebookLink := web3.facebook;

    assert web3.linkedin.size() <= MAX_LINK_CHARS;
    tempLinkinLink := web3.linkedin;

    assert web3.instagram.size() <= MAX_LINK_CHARS;
    tempInstagrameLink := web3.instagram;

    assert web3.discord.size() <= MAX_LINK_CHARS;
    tempdiscordLink := web3.discord;

    assert web3.telegram.size() <= MAX_LINK_CHARS;
    temptelegramLink := web3.telegram;

    assert web3.twitter.size() <= MAX_LINK_CHARS;
    temptwitterLink := web3.twitter;
    assert web3.founderEmail.size() <= MAX_EMAIL_CHARS;

    var web3Status : Web3Status = #un_verfied;

    if (isEdit) {
      let getWeb3 = web3Storage.get(web3Id);
      switch (getWeb3) {
        case (?isweb3) {
          let tempWeb3 : Web3 = {
            company = web3.company;
            shortDescription = web3.shortDescription;
            founderName = web3.founderName;
            founderDetail = web3.founderDetail;
            founderImage = web3.founderImage;
            companyBanner = web3.companyBanner;
            catagory = web3.catagory;
            creation_time = isweb3.creation_time;
            user = isweb3.user;
            status = isweb3.status;
            likes = isweb3.likes;
            likedUsers = isweb3.likedUsers;
            companyUrl = ?tempWebsite;
            facebook = ?tempFacebookLink;
            instagram = ?tempInstagrameLink;
            linkedin = ?tempLinkinLink;
            companyDetail = web3.companyDetail;
            companyLogo = web3.companyLogo;
            discord = ?tempdiscordLink;
            telegram = ?temptelegramLink;
            twitter = ?temptwitterLink;
            views = isweb3.views;
            articleCount = isweb3.articleCount;
            podcastCount = isweb3.podcastCount;
            pressReleaseCount = isweb3.pressReleaseCount;
            totalCount = isweb3.totalCount;
             isStatic=isweb3.isStatic;
             founderEmail=isweb3.founderEmail;


          };
          let res=web3Storage.replace(web3Id, tempWeb3);
          let newweb3Storage : Map.HashMap<Text, Web3> = Map.fromIter<Text, Web3>(web3Storage.entries(), web3Storage.size(), Text.equal, Text.hash);

          return newweb3Storage;
        };
        case (null) {
          return web3Storage;
        };
      };
    };
    let tempWeb3 : Web3 = {
      company = web3.company;
      shortDescription = web3.shortDescription;
      founderName = web3.founderName;
      founderDetail = web3.founderDetail;
      founderImage = web3.founderImage;
      companyBanner = web3.companyBanner;
      catagory = web3.catagory;
      creation_time = Time.now() / 1000000;
      user = caller;
      status = web3Status;
      likes = 0;
      likedUsers = [];
      companyUrl = ?tempWebsite;
      facebook = ?tempFacebookLink;
      instagram = ?tempInstagrameLink;
      linkedin = ?tempLinkinLink;
      companyDetail = web3.companyDetail;
      companyLogo = web3.companyLogo;
      discord = ?tempdiscordLink;
      telegram = ?temptelegramLink;
      twitter = ?temptwitterLink;
      views = 0;
      articleCount = 0;
      podcastCount = 0;
      pressReleaseCount = 0;
      totalCount = 0;
      isStatic=false;
             founderEmail=web3.founderEmail;


    };

    web3Storage.put(web3Id, tempWeb3);
    let newweb3Storage : Map.HashMap<Text, Web3> = Map.fromIter<Text, Web3>(web3Storage.entries(), web3Storage.size(), Text.equal, Text.hash);
    return newweb3Storage;

  };


  public func searchSortList(array : Map.HashMap<Key, Web3>, search : Text, startIndex : Nat, length : Nat,getModificationdate:(Key,Int)->Int) : {
    web3List : [(Key, Web3)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedWeb3 = Map.HashMap<Key, Web3>(0, Text.equal, Text.hash);
    for ((key, entry) in array.entries()) {
      let companyName = Text.map(entry.company, Prim.charToLower);
      let founderName = Text.map(entry.founderName, Prim.charToLower);

      var isTitleSearched = Text.contains(companyName, #text searchString);
      var isfounderNameSearched = Text.contains(founderName, #text searchString);

      if (isTitleSearched or isfounderNameSearched ) {
        searchedWeb3.put(key, entry);
      };
    };
    var searchedEntriesArray : [(Key, Web3)] = Iter.toArray(searchedWeb3.entries());
    let compare = func((keyA : Key, a : Web3), (keyB : Key, b : Web3)) : Order.Order {
let firstItemModificationDate=getModificationdate(keyA,a.creation_time);
let secondItemModificationDate=getModificationdate(keyB,b.creation_time);

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
    var paginatedArray : [(Key, Web3)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 10;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, Web3)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, Web3)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, Web3)>(sortedEntries, startIndex, itemsPerPage);

      };
    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      Debug.print(debug_show (size, startIndex, amount));
      paginatedArray := Array.subArray<(Key, Web3)>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<(Key, Web3)>(sortedEntries, startIndex, amount);

    } else if (size < startIndex) {
      paginatedArray := [];
    } else {
      paginatedArray := sortedEntries;

    };

    return { web3List = paginatedArray; amount = sortedEntries.size() };
  };
  // for this type Web3List
  public func searchSortListWeb3(array : Map.HashMap<Key, Web3List>, search : Text, startIndex : Nat, length : Nat,getModificationdate:(Key,Int)->Int) : {
    web3List : [(Key, Web3List)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedWeb3 = Map.HashMap<Key, Web3List>(0, Text.equal, Text.hash);
    for ((key, entry) in array.entries()) {
      let companyName = Text.map(entry.company, Prim.charToLower);
      var isTitleSearched = Text.contains(companyName, #text searchString);
      if (isTitleSearched) {
        searchedWeb3.put(key, entry);
      };
    };
    var searchedEntriesArray : [(Key, Web3List)] = Iter.toArray(searchedWeb3.entries());
    let compare = func((keyA : Key, a : Web3List), (keyB : Key, b : Web3List)) : Order.Order {
let firstItemModificationDate=getModificationdate(keyA,a.creation_time);
let secondItemModificationDate=getModificationdate(keyB,b.creation_time);
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
    var paginatedArray : [(Key, Web3List)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size >= startIndex and size >= (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, Web3List)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, Web3List)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, Web3List)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      Debug.print(debug_show (size, startIndex, amount));
      paginatedArray := Array.subArray<(Key, Web3List)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, Web3List)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { web3List = paginatedArray; amount = sortedEntries.size() };
  };
  public func searchSortWeb3DashboardList(array : Map.HashMap<Key, Web3DashboardList>, search : Text, startIndex : Nat, length : Nat,getModificationdate:(Key,Int)->Int) : {
    web3List : [(Key, Web3DashboardList)];
    amount : Nat;
  } {
    let searchString = Text.map(search, Prim.charToLower);
    var searchedWeb3 = Map.HashMap<Key, Web3DashboardList>(0, Text.equal, Text.hash);
    for ((key, entry) in array.entries()) {
      let companyName = Text.map(entry.company, Prim.charToLower);
      var isTitleSearched = Text.contains(companyName, #text searchString);
      if (isTitleSearched) {
        searchedWeb3.put(key, entry);
      };
    };
    var searchedEntriesArray : [(Key, Web3DashboardList)] = Iter.toArray(searchedWeb3.entries());
    let compare = func((keyA : Key, a : Web3DashboardList), (keyB : Key, b : Web3DashboardList)) : Order.Order {
let firstItemModificationDate=getModificationdate(keyA,a.creation_time);
let secondItemModificationDate=getModificationdate(keyB,b.creation_time);
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
    var paginatedArray : [(Key, Web3DashboardList)] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 6;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, Web3DashboardList)>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<(Key, Web3DashboardList)>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<(Key, Web3DashboardList)>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, Web3DashboardList)>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, Web3DashboardList)>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { web3List = paginatedArray; amount = sortedEntries.size() };
  };
  public func sortEntriesByLatest(array : [(Key, Web3)],getModificationdate:(Key,Int)->Int) : [(Key, Web3)] {
    let compare = func((keyA : Key, a : Web3), (keyB : Key, b : Web3)) : Order.Order {

      let firstItemModificationDate=getModificationdate(keyA,a.creation_time);
let secondItemModificationDate=getModificationdate(keyB,b.creation_time);
      if (firstItemModificationDate > secondItemModificationDate) {
        return #less;
      } else if (firstItemModificationDate < secondItemModificationDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    Array.sort(
      array,
      compare,
    );
  };

};
