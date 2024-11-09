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
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Order "mo:base/Order";
import EntryType "../model/EntryType";
import EntryStoreHelper "../helper/EntryStoreHelper";
import UserType "../model/UserType";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = Text;

  type ActivityType = UserType.ActivityType;
  type Comment = UserType.Comment;
  type CommentItem = UserType.CommentItem;

  type Activity = {
    // user : Principal;
    activity_type : ActivityType;
    time : Int;
    target : Text;
    title : Text;

  };
  type Activities = [Activity];
  type Permission = UserType.Permission;
  type Entry = EntryType.Entry;
  type AdminActivityType = UserType.AdminActivityType;
  type AdminActivity = {
    activity_type : AdminActivityType;
    time : Int;
    target : Text;
    title : Text;
  };
  type AdminActivities = [AdminActivity];

  type UserId = Principal;
  private let MAX_ACTIVITIES_PER_USER = 100;
  private let MAX_ACTIVITIES = 1000;
  private let MAX_ACTIVITIES_PER_ADMIN = 100;

  private let MAX_COMMENTS_PER_ARTICLE = 100;
  private let MAX_COMMENTS = 1000;
  type InputComment = Text;
  type Comments = [Comment];
  type CommentsStore = [(Key, Comments)];
  type ActivityStore = [(UserId, Activities)];
  type AdminActivityStore = [(UserId, AdminActivities)];
  stable var comment_reward : Nat = 1000;
  stable var stable_comments : CommentsStore = [];
  var commentstorage = Map.fromIter<Key, Comments>(stable_comments.vals(), 0, Text.equal, Text.hash);

  stable var stable_activities : ActivityStore = [];
  var activitystorage = Map.fromIter<UserId, Activities>(stable_activities.vals(), 0, Principal.equal, Principal.hash);

  stable var stable_admin_activities : AdminActivityStore = [];
  var adminActivitystorage = Map.fromIter<UserId, AdminActivities>(stable_admin_activities.vals(), 0, Principal.equal, Principal.hash);

  public shared ({ caller }) func addActivity(user : UserId, target : Text, activityType : ActivityType, title : Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    assert Principal.isController(caller);
   

    assert activitystorage.size() <= MAX_ACTIVITIES;

    // assert inputComment
    try {
      let oldActivities = activitystorage.get(user);
      var newActivities = [];
      let tempActivity : Activity = {
        time = Time.now() / 1000000;
        // user = user;
        target = target;
        activity_type = activityType;
        title = title;
      };
      switch (oldActivities) {
        case (?isActivities) {
          // assert isActivities.size() <= MAX_ACTIVITIES_PER_USER;
          if (isActivities.size() >= MAX_ACTIVITIES_PER_USER) {
            let cutActivities = Array.subArray<Activity>(isActivities, 1, isActivities.size() - 1);
            let newActivities = Array.append<Activity>(cutActivities, [tempActivity]);
            activitystorage.put(user, newActivities);
            return true;
          } else {
            let newActivities = Array.append<Activity>(isActivities, [tempActivity]);
            activitystorage.put(user, newActivities);
            return true;
          };
        };
        case (null) {
          let initActivities = [tempActivity];
          activitystorage.put(user, initActivities);
          return true;
        };
      };
    } catch (err) {
      return false;
    };

  };
  func userActivites(userId : Principal) : Result.Result<(Activities, Text), Text> {
    let maybeActivities = activitystorage.get(userId);

    switch (maybeActivities) {
      case (?activities) {
        let compare = func(a : Activity, b : Activity) : Order.Order {
          if (a.time > b.time) {
            return #less;
          } else if (a.time < b.time) {
            return #greater;
          } else {
            return #equal;
          };
        };
        // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
        let sortedActivities = Array.sort(
          activities,
          compare,
        );
        return #ok(sortedActivities, "Activities get successfully");
      };
      case (null) {
        return #err("Error while getting Activities");
      };
    };
  };
  public query ({ caller }) func getActivities() : async Result.Result<(Activities, Text), Text> {
   return userActivites(caller);

  };
   public shared ({ caller }) func getActivitiesDashboard(userId:Principal,userCanisterId:Text) : async Result.Result<(Activities, Text), Text> {
      let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #manage_user);

   return userActivites(userId);

  };
  public shared ({ caller }) func addAdminActivity(user : UserId, target : Text, activityType : AdminActivityType, title : Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    assert Principal.isController(caller);
    assert activitystorage.size() <= MAX_ACTIVITIES;

    // assert inputComment
    try {
      let oldActivities = adminActivitystorage.get(user);

      var newActivities = [];
      let tempActivity : AdminActivity = {
        time = Time.now() / 1000000;
        // user = user;
        target = target;
        activity_type = activityType;
        title = title;
      };
      switch (oldActivities) {
        case (?isActivities) {
          // assert isActivities.size() <= MAX_ACTIVITIES_PER_USER;
          if (isActivities.size() >= MAX_ACTIVITIES_PER_ADMIN) {
            let cutActivities = Array.subArray<AdminActivity>(isActivities, 1, isActivities.size() - 1);
            let newActivities = Array.append<AdminActivity>(cutActivities, [tempActivity]);
            let n = adminActivitystorage.replace(user, newActivities);

            return true;
          } else {

            let newActivities = Array.append<AdminActivity>(isActivities, [tempActivity]);
            let n = adminActivitystorage.replace(user, newActivities);

            return true;
          };
        };
        case (null) {
          let initActivities = [tempActivity];
          adminActivitystorage.put(user, initActivities);
          return true;
        };
      };
    } catch (err) {
      return false;
    };

  };

  public shared ({ caller }) func getAdminActivities(user : UserId, userCanisterId : Text) : async Result.Result<(AdminActivities, Text), Text> {
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #assign_role);
    let maybeActivities = adminActivitystorage.get(user);

    switch (maybeActivities) {
      case (?activities) {
        let compare = func(a : AdminActivity, b : AdminActivity) : Order.Order {
          if (a.time > b.time) {
            return #less;
          } else if (a.time < b.time) {
            return #greater;
          } else {
            return #equal;
          };
        };
        // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
        let sortedActivities = Array.sort(
          activities,
          compare,
        );
        return #ok(sortedActivities, "Activities get successfully");
      };
      case (null) {
        return #err("Error while getting Activities");
      };
    };

  };

  func isUserCommented(userId : Principal, articleId : Text) : Bool {
    let oldComments = commentstorage.get(articleId);
    switch (oldComments) {
      case (?isComment) {
        let isCommented = Array.find<Comment>(isComment, func x = x == userId);
        switch (isCommented) {
          case (?useComment) {
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
  };
  public shared ({ caller }) func addComment(inputComment : InputComment, userCanisterId : Text, entryCanisterId : Text, article : Text, title : Text, entryType : Text) : async Result.Result<(Comment, Text), Text> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      add_reward : (caller : Principal, like_reward : Nat,enum:Text) -> async Bool;
      check_user_exists : (caller : Principal) -> async Bool;
      get_NFT24Coin : () -> async Nat;
    };
    let entryCanister = actor (entryCanisterId) : actor {
      getEntry : (key : Text) -> async ?Entry;
      updateEntry(tempEntry : Entry, key : Text) : async Bool;
    };

    let maybeEntry = await entryCanister.getEntry(article);
    var isfirstComment = true;

    assert commentstorage.size() <= MAX_COMMENTS;

    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;
    // assert inputComment
    try {

      let oldComments = commentstorage.get(article);

      var newComments = [];
      let tempComment : Comment = {
        creation_time = Time.now() / 1000000;
        user = caller;
        content = inputComment;
      };

      switch (maybeEntry) {
        case (?isEntry) {

          //  tempLikedUsers = isEntry.likedUsers;
          var isCommented = isUserCommented(caller, article);
          var isPromoted = isEntry.isPromoted;
          var newPromoted = false;

          if (isPromoted) {
            if (isCommented) {
              return #err("You already comment on this entry.");
            } else {

              var newPromotionTokens : Nat = isEntry.promotionICP;
              var shouldReward = false;
              var oneCoinsValue = await userCanister.get_NFT24Coin();

              if ((newPromotionTokens - comment_reward) : Int == 0) {
                newPromotionTokens := newPromotionTokens - comment_reward;
                newPromoted := false;
                shouldReward := true;
              } else if ((newPromotionTokens - comment_reward) : Int <= 0) {
                shouldReward := false;
                newPromoted := false;
              } else {
                newPromotionTokens := newPromotionTokens - comment_reward;
                newPromoted := true;
                shouldReward := true;
              };
              // let newLikedUsers = Array.append(tempLikedUsers, [caller]);
              var isUserRewarded = true;
              if (shouldReward) {
                isUserRewarded := await userCanister.add_reward(caller, comment_reward,"b");
              };

              if (isUserRewarded) {

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
                  isPromoted = newPromoted;
                  minters = isEntry.minters;
                  userName = isEntry.userName;
                  // promotionLikesTarget = isEntry.promotionLikesTarget;
                  promotionICP = comment_reward;
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
                let newEntry = entryCanister.updateEntry(tempEntry, article);
                switch (oldComments) {
                  case (?isComments) {
                    assert isComments.size() <= MAX_COMMENTS_PER_ARTICLE;
                    let newComments = Array.append<Comment>(isComments, [tempComment]);
                    commentstorage.put(article, newComments);
                    if (entryType == "podcast") {
                      let activitied = addActivity(caller, article, #comment_podcats, title);

                    } else if (entryType == "pressRelease") {
                      let activitied = addActivity(caller, article, #comment_pressRelease, title);

                    } else {
                      let activitied = addActivity(caller, article, #comment, title);

                    };
                    isfirstComment := false;
                  };
                  case (null) {
                    let initComments = [tempComment];
                    commentstorage.put(article, initComments);
                    if (entryType == "podcast") {
                      let activitied = addActivity(caller, article, #comment_podcats, title);

                    } else if (entryType == "pressRelease") {
                      let activitied = addActivity(caller, article, #comment_pressRelease, title);

                    } else {
                      let activitied = addActivity(caller, article, #comment, title);

                    };
                  };
                };

              } else {

                return #err("Error while adding comment");
              };
              //  return #err("HIIIIi");

            };

          } else {

            switch (oldComments) {
              case (?isComments) {
                assert isComments.size() <= MAX_COMMENTS_PER_ARTICLE;
                let newComments = Array.append<Comment>(isComments, [tempComment]);
                commentstorage.put(article, newComments);
                if (entryType == "podcast") {
                  let activitied = addActivity(caller, article, #comment_podcats, title);

                } else if (entryType == "pressRelease") {
                  let activitied = addActivity(caller, article, #comment_pressRelease, title);

                } else {
                  let activitied = addActivity(caller, article, #comment, title);

                };
                isfirstComment := false;
              };
              case (null) {
                let initComments = [tempComment];
                commentstorage.put(article, initComments);
                if (entryType == "podcast") {
                  let activitied = addActivity(caller, article, #comment_podcats, title);

                } else if (entryType == "pressRelease") {
                  let activitied = addActivity(caller, article, #comment_pressRelease, title);

                } else {
                  let activitied = addActivity(caller, article, #comment, title);

                };
              };
            };
          };
        };
        case (null) {
          return #err("Error while adding comment");

        };
      };

      if (isfirstComment) {
        return #ok(tempComment, "First Comment added successfully");

      } else {
        return #ok(tempComment, "Comment added successfully");

      };

    } catch (err) {
      return #err("Error while adding comment");
    };
  };
  public query func getComments(article : Text) : async Result.Result<(Comments, Text), Text> {
    let maybeComments = commentstorage.get(article);

    switch (maybeComments) {
      case (?comments) {
        return #ok(comments, "Comments get successfully")

      };
      case (null) {
        return #err("Error while getting comments");
      };
    };

  };
  public query ({ caller }) func get_comment_reward() : async Nat {

    return comment_reward;
  };

  public query func getCommentsofUser(userId : Principal,startIndex:Nat,length:Nat) : async {
    entries : [CommentItem];
    amount : Nat;
  } {
    var userComments : [CommentItem] = [];
    for ((key, comments) in commentstorage.entries()) {

      for (comment in comments.vals()) {
        if (comment.user == userId) {
          let tempCommentItem : CommentItem = {
            user = comment.user;
            content = comment.content;
            creation_time = comment.creation_time;
            entryId = key;
          };
          let newArray = Array.append(userComments, [tempCommentItem]);
           userComments := newArray;
        };
      };
    };

    let userSortedComments = EntryStoreHelper.searchSortComments(userComments, startIndex, length);
    return userSortedComments;
  };
  public shared ({ caller }) func update_comment_reward(userCanisterId : Text, inputReward : Nat) : async Nat {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
      saveRewardValuesChangers : (changer:Principal,newValue:Nat,oldValue:Nat, rewardType : Text) -> ();
    };

    assert await userCanister.entry_require_permission(caller, #assign_role);
    assert comment_reward < 100000000;
    let tempOldReward=comment_reward;
    comment_reward := inputReward;
    let res=userCanister.saveRewardValuesChangers(caller,inputReward,tempOldReward,"e");
    return comment_reward;
  };
  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_comments := Iter.toArray(commentstorage.entries());
    stable_activities := Iter.toArray(activitystorage.entries());
    stable_admin_activities := Iter.toArray(adminActivitystorage.entries());
    Debug.print("pre-upgrade finished.");

  };

  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    commentstorage := Map.fromIter<Key, Comments>(stable_comments.vals(), stable_comments.size(), Text.equal, Text.hash);
    stable_comments := [];

    activitystorage := Map.fromIter<UserId, Activities>(stable_activities.vals(), stable_activities.size(), Principal.equal, Principal.hash);
    stable_activities := [];

    adminActivitystorage := Map.fromIter<UserId, AdminActivities>(stable_admin_activities.vals(), stable_admin_activities.size(), Principal.equal, Principal.hash);
    stable_admin_activities := [];

    Debug.print("post-upgrade finished.");

  };

};
