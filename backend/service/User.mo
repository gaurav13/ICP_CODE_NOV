// Import base modules
import AssocList "mo:base/AssocList";
import Error "mo:base/Error";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Bool "mo:base/Bool";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import ImageType "../model/ImageType";
import UserType "../model/UserType";
import Order "mo:base/Order";
// import LEDGER "canister:icp_ledger_canister";
import EntryStoreHelper "../helper/EntryStoreHelper";
import EntryType "../model/EntryType";

shared ({ caller = initializer }) actor class () {

  private let MAX_USERS = 1_000;
  private let MAX_NAME_CHARS = 40;
  private let MAX_TITLE_CHARS = 60;
  private let MAX_DESIGNATION_CHARS = 100;
  private let MAX_BIO_CHARS = 500;
  private let MAX_LINK_CHARS = 2048;
  private let MAX_EMAIL_CHARS = 320;
  //
  type SubAccount = UserType.SubAccount;
  type Icrc1Timestamp = UserType.Icrc1Timestamp;
  type Icrc1Tokens = UserType.Icrc1Tokens;
  type Icrc1BlockIndex = UserType.Icrc1BlockIndex;

  type Account = UserType.Account;
  type TransferFromArgs = UserType.TransferFromArgs;
  type TransferFromResult = UserType.TransferFromResult;

  type TransferFromError = UserType.TransferFromError;
  type UserCount = UserType.UserCount;
  type Burners = UserType.Burners;
  type TokenBurn = UserType.TokenBurn;
  //

  type ImageObject = ImageType.ImageObject;
  type NewImageObject = ImageType.NewImageObject;
  type Reward = UserType.Reward;
  type UsersReward = UserType.UsersReward;
  type UsersRewards = UserType.UsersRewards;
  type Rewards = UserType.Rewards;
  type AdminActivityType = UserType.AdminActivityType;
  public type Role = UserType.Role;
  public type Permission = UserType.Permission;
  public type User = UserType.User;
  public type ListUser = UserType.ListUser;
  public type TopWinnerUserList = UserType.TopWinnerUserList;
  public type InputUser = UserType.InputUser;
  public type UserId = UserType.UserId;
  public type Id = UserType.Id;

  type ProfileCompleteReward = UserType.ProfileCompleteReward;
  type EmailVerification = UserType.ProfileCompleteReward;
  type EntryIds = UserType.EntryIds;
  type EntryId = UserType.EntryId;
  type EmailVerifiedReward = UserType.EmailVerifiedReward;
  type Users = UserType.Users;
  type ArticleReaders = UserType.ArticleReaders;
  type RewardValuesChangeRecord = UserType.RewardValuesChangeRecord;
  type RewardConfig = { master : Nat; admin : Nat; platform : Nat };
  type MenualAndArtificialRewardsType = UserType.MenualAndArtificialRewardsType;
  type MenualAndArtificialRewardType = UserType.MenualAndArtificialRewardType;
  type ReturnMenualAndArtificialReward = UserType.ReturnMenualAndArtificialReward;
  type ReturnMenualAndArtificialRewardList = [(Text, ReturnMenualAndArtificialReward)];
  type RewardValuesChangeRecordReturnList = UserType.RewardValuesChangeRecordReturnList;
  type RewardValuesChangeRecordReturn = UserType.RewardValuesChangeRecordReturn;
  type TokenClaimRequest = UserType.TokenClaimRequest;
  type TokenClaimRequests = UserType.TokenClaimRequests;
  type TokensClaimStatus = UserType.TokensClaimStatus;

  type ListUsers = UserType.ListUsers;
  type ListAdminUser = UserType.ListAdminUser;
  type LoginReward = UserType.LoginReward;
  type LoginRewardRecord = UserType.LoginRewardRecord;
  type ListUserDashboard = UserType.ListUserDashboard;

  // type ProfileComplete =UserType.ProfileComplete;
  type EmailVerifiedRewardRecord = UserType.EmailVerifiedRewardRecord;
  // type ProfileComplete =UserType.ProfileComplete;
  let TOKEN_CANISTER_ID = UserType.TOKEN_CANISTER_ID;
  type Minters = UserType.Minters;
  type TokenMinter = UserType.TokenMinter;
  private var sectek = "#cosa@erwe0ss1s<e}s*dfCc<e>c!dwa)<vvde>";

  stable var stable_users : Users = [];
  stable var oneNFT24Coin : Nat = 100000000000;
  stable var emailVerficationReward : Nat = 10;
  stable var newUserReward : Nat = 10;
  stable var articleReadReward : Nat = 10;
  stable var minimumClaimReward : Nat = 1000;
  stable var dailyLoginReward : Nat = 10;
  stable var profileCompReward : Nat = 10;
  stable var transactionfees : Nat = 10;


  stable var stable_Article_reader : ArticleReaders = [];
  stable var stable_users_rewards : [(Id, UsersRewards)] = [];
  stable var stable_daily_login_rewards : [(Id, LoginRewardRecord)] = [];
  stable var stable_profile_complete_rewards : [(Id, ProfileCompleteReward)] = [];
  stable var stable_email_verified_rewards : [(Id, EmailVerification)] = [];
  stable var stable_menual_and_artificial_reward : [(Text, MenualAndArtificialRewardType)] = [];
  stable var stable_rewards_values_changed : [(Text, RewardValuesChangeRecord)] = [];
  stable var stable_token_claimRequest : TokenClaimRequests = [];

  var loginAttemptCount = false;
  var addEntryRewardLoading = false;

  var userStorage = Map.fromIter<Id, User>(stable_users.vals(), stable_users.size(), Principal.equal, Principal.hash);
  var emailVerifiedRewardedStorage = Map.fromIter<Id, EmailVerification>(stable_email_verified_rewards.vals(), stable_email_verified_rewards.size(), Principal.equal, Principal.hash);
  var compProfileRewardedStorage = Map.fromIter<Id, ProfileCompleteReward>(stable_profile_complete_rewards.vals(), stable_profile_complete_rewards.size(), Principal.equal, Principal.hash);
  var articleReadersStorage = Map.fromIter<Id, EntryIds>(stable_Article_reader.vals(), stable_Article_reader.size(), Principal.equal, Principal.hash);
  var usersRewardsStorage = Map.fromIter<Id, UsersRewards>(stable_users_rewards.vals(), stable_users_rewards.size(), Principal.equal, Principal.hash);
  var dailyUserLoginStorage = Map.fromIter<Id, LoginRewardRecord>(stable_daily_login_rewards.vals(), stable_daily_login_rewards.size(), Principal.equal, Principal.hash);
  var menualAndArtificialRewardStorage = Map.fromIter<Text, MenualAndArtificialRewardType>(stable_menual_and_artificial_reward.vals(), stable_menual_and_artificial_reward.size(), Text.equal, Text.hash);
  var rewardValueChangedStorage = Map.fromIter<Text, RewardValuesChangeRecord>(stable_rewards_values_changed.vals(), stable_rewards_values_changed.size(), Text.equal, Text.hash);
  var tokensClaimRequest = Map.fromIter<Text, TokenClaimRequest>(stable_token_claimRequest.vals(), stable_token_claimRequest.size(), Text.equal, Text.hash);

  let enumsOfReward_type = [
    ("a", "Like"),
    ("b", "Comment"),
    ("c", "Daily login"),
    ("d", "Profile complete"),
    ("e", "Email verification"),
    ("f", "Reading article"),
    ("g", "new joining"),
    ("h", "Quiz create"),
    ("i", "Survey create"),
    ("j", "BlockZa"),
    ("k", "Other"),
    ("l", "Survey"),
    ("m", "Quiz"),
  ];
  var enumsStore = Map.fromIter<Text, Text>(enumsOfReward_type.vals(), 0, Text.equal, Text.hash);
  let rewardChangeType = [
    ("a", "Article Promotion Pool"),
    ("b", "Platform Fee"),
    ("c", "Admin Fee"),
    ("d", "Like Reward"),
    ("e", "Comment Reward"),
    ("f", "Email Verification Reward"),
    ("g", "New User Reward"),
    ("h", "Article Read Reward"),
    ("i", "Minimum claimable reward"),
    ("j", "Daily login reward"),
    ("k", "Profile Complete Reward"),

  ];
  var rewardValueChangeEnumsStore = Map.fromIter<Text, Text>(rewardChangeType.vals(), 0, Text.equal, Text.hash);

  var GAS_FEE = 10000;
  var MIN_REWARD = GAS_FEE * 3;
  let E8S : Nat = 100000000;
  let MASTER_WALLET = UserType.MASTER_WALLET;
  let MASTER_Token_WALLET = UserType.MASTER_WALLET;
  let ADMIN_WALLET = UserType.ADMIN_WALLET;
  let PLATFORM_WALLET = UserType.PLATFORM_WALLET;
  func getCurrentDate() : Int {
    return Time.now() / 1_000_000;
  };
  func emailExists(email : Text) : Bool {
    // let users = Map.HashMap.entries<Id, User>(userStorage);
    for ((_, user) : (Id, User) in userStorage.entries()) {
      switch (user.email) {
        case (?userEmail) {
          if (userEmail == email) {
            return true;
          };
        };
        case null {};
      };
    };
    return false;
  };
  /*
getUserClaimedAndUnclaimedReward use to check claimed and unclaim reward of user
params {id:Principal}

retrun {
    claimed : Nat;
    unClaimed : Nat;
  }
  */
  func getUserClaimedAndUnclaimedReward(id : Id) : {
    claimed : Nat;
    unClaimed : Nat;
  } {
    var claimed = 0;
    var unClaimed = 0;

    let userRewards = usersRewardsStorage.get(id);
    switch (userRewards) {
      case (null) {};
      case (?isReward) {

        for (r in isReward.vals()) {
          if (r.isClaimed) {
            claimed += r.amount;
          } else {
            unClaimed += r.amount;

          };

        };

      };
    };
    return { claimed = claimed; unClaimed = unClaimed };
  };
  public shared ({ caller }) func add_user() : async Result.Result<(Text, User), Text> {
    // Return error if the user already exists
    assert not Principal.isAnonymous(caller);
    let oldUser = userStorage.get(caller);
    if (oldUser != null) {
      let user = userStorage.get(caller);
      switch user {
        case (?iuser) {
          if (not loginAttemptCount) {
            let res = addDailyLoginReward(caller);

          };
          return #ok("Already a User", iuser);
        };
        case (null) {
          return #err("Error while getting user");
        };
      };
    };
    if (not loginAttemptCount) {
      let res = addDailyLoginReward(caller);

    };
    let currentTime = Time.now();
    let lastFourDigits = currentTime % 10000; // This gives us the last four digits
    let textNumber = Int.toText(lastFourDigits);
    let result = "User" # textNumber;
    // Create new user with default name
    let tempCurrentTime = getCurrentDate();
    var tempUser = {
      profileImg = null;
      bannerImg = null;
      name = ?result;
      designation = null;
      email = null;
      website = null;
      dob = null;
      gender = null;
      facebook = null;
      twitter = null;
      instagram = null;
      linkedin = null;
      authorInfo = null;
      authorTitle = null;
      authorDescription = null;
      joinedFrom = (tempCurrentTime);
      rewards = [];
      role = #authorized;
      isBlocked = false;
      isAdminBlocked = false;
      isVerified = false;
      isVerificationRequested = false;
      identificationImage = null;

      // subscribers = ?0;
    };

    userStorage.put(caller, tempUser);
    let newJoineyReward = await add_reward(caller, newUserReward, "g");
    return #ok("User added successfuly", tempUser);
  };
  // Check if the user exists
  func is_user(caller : Principal) : ?User {
    assert not Principal.isAnonymous(caller);
    let user = userStorage.get(caller);
    switch (user) {
      case (?isUser) {
        assert not isUser.isBlocked;
      };
      case (null) {

      };
    };

    return user;
  };
  // Check if the user has permission
  func has_permission(pal : Principal, perm : Permission) : Bool {
    let isUser = userStorage.get(pal);
    // if(Principal.isController(pal)){
    //   return true;
    // };
    switch (isUser) {
      case (?user) {
        let role = user.role;
        switch (role, perm) {
          case (#admin, _) true;
          case (#sub_admin, #write or #manage_user or #manage_article) true;
          case (#user_admin, #manage_user or #write) true;
          case (#article_admin, #manage_article or #write) true;
          case (#authorized, #write) true;
          case (_, _) false;
        };
      };
      case (null) {
        return false;
      };
    };

  };
  // Reject unauthorized user identities
  func require_permission(pal : Principal, perm : Permission) : Bool {
    if (has_permission(pal, perm) == false) {
      // throw Error.reject("unauthorized");
      return false;
    } else {
      return true;
    };
  };
  //
  public query ({ caller }) func entry_require_permission(pal : Principal, perm : Permission) : async Bool {
    assert Principal.isController(caller);

    if (has_permission(pal, perm) == false) {
      return false;
    } else {
      return true;
    };
  };
  // Assign a new role to a principal
  public shared ({ caller }) func assign_role(assignee : Principal, name : Text, new_role : Role) : async Result.Result<(Text, User), Text> {
    assert require_permission(caller, #assign_role);

    switch new_role {
      case (#admin) {
        throw Error.reject("Errror");
      };
      case (_) {};
    };
    // if (assignee == initializer) {
    //   throw Error.reject("Cannot assign a role to the canister owner");
    // };
    let isOldUser = userStorage.get(assignee);

    switch (isOldUser) {
      case (?oldUser) {
        if (oldUser.isBlocked) {
          return #err("This user is blocked");
        };
        let user = userStorage.get(assignee);
        switch user {
          case (?iuser) {
            if (iuser.role == #admin) {
              return #err("Error");
            };
            var tempUser = {
              profileImg = iuser.profileImg;
              bannerImg = iuser.bannerImg;
              name = ?name;
              designation = iuser.designation;
              email = iuser.email;
              website = iuser.website;
              dob = iuser.dob;
              gender = iuser.gender;
              facebook = iuser.facebook;
              twitter = iuser.twitter;
              instagram = iuser.instagram;
              linkedin = iuser.linkedin;
              authorInfo = iuser.authorInfo;
              authorTitle = iuser.authorTitle;
              authorDescription = iuser.authorDescription;
              joinedFrom = iuser.joinedFrom;
              rewards = iuser.rewards;
              role = new_role;
              isBlocked = iuser.isBlocked;
              isAdminBlocked = iuser.isAdminBlocked;
              isVerified = iuser.isVerified;
              isVerificationRequested = iuser.isVerificationRequested;
              identificationImage = iuser.identificationImage;
              // subscribers = ?0;
            };

            userStorage.put(assignee, tempUser);
            return #ok("Successfuly", tempUser);
          };
          case (null) {
            return #err("Error");
          };
        };
      };
      case (null) {};

    };
    // let lastFourDigits = currentTime % 10000; // This gives us the last four digits
    // let textNumber = Int.toText(lastFourDigits);
    // let result = "User" # textNumber;
    // Create new user with default name
    let currentTime = getCurrentDate();
    var tempUser = {
      profileImg = null;
      bannerImg = null;
      name = ?name;
      designation = null;
      email = null;
      website = null;
      dob = null;
      gender = null;
      facebook = null;
      twitter = null;
      instagram = null;
      linkedin = null;
      authorInfo = null;
      authorTitle = null;
      authorDescription = null;
      joinedFrom = (currentTime);
      rewards = [];
      role = new_role;
      isBlocked = false;
      isAdminBlocked = false;
      isVerified = false;
      isVerificationRequested = false;
      identificationImage = null;
      // subscribers = ?0;
    };

    userStorage.put(assignee, tempUser);
    return #ok("User added successfuly", tempUser);

    // roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, new_role).0;
    // role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
  };
  public shared ({ caller }) func make_admin(assignee : Principal, new_role : Role) : async Bool {
    assert Principal.isController(caller);
    let isOldUser = userStorage.get(assignee);
    if (isOldUser != null) {
      switch (isOldUser) {
        case (?oldUser) {
          if (oldUser.isBlocked) {
            return false;
          };
        };
        case (null) {

        };
      };
      let user = userStorage.get(assignee);
      switch user {
        case (?iuser) {
          var tempUser = {
            profileImg = iuser.profileImg;
            bannerImg = iuser.bannerImg;
            name = iuser.name;
            designation = iuser.designation;
            email = iuser.email;
            website = iuser.website;
            dob = iuser.dob;
            gender = iuser.gender;
            facebook = iuser.facebook;
            twitter = iuser.twitter;
            instagram = iuser.instagram;
            linkedin = iuser.linkedin;
            authorInfo = iuser.authorInfo;
            authorTitle = iuser.authorTitle;
            authorDescription = iuser.authorDescription;
            joinedFrom = iuser.joinedFrom;
            rewards = iuser.rewards;
            role = new_role;
            isBlocked = iuser.isBlocked;
            isAdminBlocked = iuser.isAdminBlocked;
            isVerified = iuser.isVerified;
            isVerificationRequested = iuser.isVerificationRequested;
            identificationImage = iuser.identificationImage;
            // subscribers = ?0;
          };

          userStorage.put(assignee, tempUser);
          return true;
        };
        case (null) {
          return false;
        };
      };
    };
    let lastFourDigits = Time.now() % 10000; // This gives us the last four digits
    let textNumber = Int.toText(lastFourDigits);
    let result = "User" # textNumber;
    // Create new user with default name
    let tempCurrentTime = getCurrentDate();
    var tempUser = {
      profileImg = null;
      bannerImg = null;
      name = ?result;
      designation = null;
      email = null;
      website = null;
      dob = null;
      gender = null;
      facebook = null;
      twitter = null;
      instagram = null;
      linkedin = null;
      authorInfo = null;
      authorTitle = null;
      authorDescription = null;
      joinedFrom = (tempCurrentTime);
      rewards = [];
      role = new_role;
      isBlocked = false;
      isAdminBlocked = false;
      isVerified = false;
      isVerificationRequested = false;
      identificationImage = null;
      // subscribers = ?0;
    };

    userStorage.put(assignee, tempUser);
    return true;

  };
  // artificial reward
  public shared ({ caller }) func give_reward(userId : Id, givenReward : Nat, isMenual : Bool) : async Bool {
    assert require_permission(caller, #assign_role);

    let isOldUser = userStorage.get(userId);
    if (isOldUser != null) {
      switch (isOldUser) {
        case (?oldUser) {
          if (oldUser.isBlocked) {
            return false;
          };
        };
        case (null) {

        };
      };
      let user = userStorage.get(userId);
      switch user {
        case (?iuser) {
          var tempIsClaimed = true;
          if (isMenual) {
            tempIsClaimed := false;
          };
          let tempCurrentTime = getCurrentDate();
          var tempReward : UsersReward = {
            isClaimed = tempIsClaimed;
            creation_time = tempCurrentTime;
            claimed_at = ?(tempCurrentTime);
            amount = givenReward;
            reward_type = "k";
          };
          let oldRewards = iuser.rewards;

          let userRewards = usersRewardsStorage.get(userId);
          switch (userRewards) {
            case (?isOldReward) {
              let newRewards : UsersRewards = Array.append(isOldReward, [tempReward]);
              let newEntry = usersRewardsStorage.replace(userId, newRewards);

            };
            case (null) {
              let userRewards = usersRewardsStorage.put(userId, [tempReward]);

            };
          };
          let res = saveRecordOfArtificialAndmenualReward(caller, userId, givenReward, isMenual);
          return true;
        };
        case (null) {
          return false;
        };
      };
    } else {
      return true;

    };

  };
  public func check_user_exists(caller : Principal) : async Bool {
    let user = userStorage.get(caller);
    switch (user) {
      case (?isUser) {
        assert not isUser.isBlocked;
      };
      case (null) {

      };
    };
    return user != null;
  };

  public query ({ caller }) func get_authorized_users(search : Text, startIndex : Nat, length : Nat) : async {
    users : [(Id, ListUserDashboard)];
    amount : Nat;
  } {
    assert require_permission(caller, #manage_user);
    let users : Users = [];

    var usersList = Map.HashMap<Id, ListUserDashboard>(0, Principal.equal, Principal.hash);
    for ((id, user) in userStorage.entries()) {
      let userReward = getUserClaimedAndUnclaimedReward(id);

      let listUser : ListUserDashboard = {
        name = user.name;
        email = user.email;
        joinedFrom = user.joinedFrom;
        isBlocked = user.isBlocked;
        isAdminBlocked = user.isAdminBlocked;
        isVerified = user.isVerified;
        isVerificationRequested = user.isVerificationRequested;
        identificationImage = user.identificationImage;
        claimedReward = userReward.claimed;
        unclaimedReward = userReward.unClaimed;

      };
      switch (user.role) {
        // case (#admin or #sub_admin or #user_admin) {
        case (#authorized) {
          usersList.put(id, listUser);
        };
        case (_) {
          // return #err("UnAuthorized");
        };
      };
    };
    return EntryStoreHelper.searchSortUserListDashboard(usersList, search, startIndex, length);

  };
  public query ({ caller }) func get_subAdmin_users(search : Text, startIndex : Nat, length : Nat) : async {
    users : [(Id, ListAdminUser)];
    amount : Nat;
  } {
    // var usersList = Map.HashMap<Id, ListUser>(0, Principal.equal, Principal.hash);
    // for ((id, user) in userStorage.entries()) {
    //   let listUser : ListUser = {
    //     name = user.name;
    //     email = user.email;
    //     joinedFrom = user.joinedFrom;
    //     isBlocked = user.isBlocked;
    //   };
    //   switch (user.role) {
    //     case (#sub_admin or #user_admin or #article_admin) {
    //       usersList.put(id, listUser);
    //     };
    //     case (_) {
    //       // return #err("UnAuthorized");
    //     };
    //   };
    // };
    // let usersArray = Iter.toArray(usersList.entries());
    // return #ok("Successfully", usersArray);
    assert require_permission(caller, #assign_role);

    let users : Users = [];
    var usersList = Map.HashMap<Id, ListAdminUser>(0, Principal.equal, Principal.hash);
    for ((id, user) in userStorage.entries()) {
      let listUser : ListAdminUser = {
        name = user.name;
        email = user.email;
        joinedFrom = user.joinedFrom;
        role = user.role;
        isBlocked = user.isBlocked;
        isAdminBlocked = user.isAdminBlocked;
      };
      switch (user.role) {
        // case (#admin or #sub_admin or #user_admin) {
        case (#sub_admin or #user_admin or #article_admin) {
          usersList.put(id, listUser);
        };
        case (_) {
          // return #err("UnAuthorized");
        };
      };
    };
    return EntryStoreHelper.searchSortAdminUserList(usersList, search, startIndex, length);
  };
  func totalReward(ary : [UsersReward]) : Nat {
    var totalReward = 0;
    for (entry in ary.vals()) {

      totalReward += entry.amount;

    };

    return totalReward;
  };
  func get_reward_of_user_by_id(id : Id) : ?UsersRewards {
    let userRewards = usersRewardsStorage.get(id);
    return userRewards;
  };

  public query ({ caller }) func get_winner_users(search : Text, startIndex : Nat, length : Nat) : async {
    users : [(Id, TopWinnerUserList)];
    amount : Nat;
  } {

    let users : Users = [];
    var usersList = Map.HashMap<Id, TopWinnerUserList>(0, Principal.equal, Principal.hash);
    for ((id, user) in userStorage.entries()) {
      var userReward : UsersRewards = [];
      let getReward = get_reward_of_user_by_id(id);
      switch (getReward) {
        case (?getReward) {
          userReward := getReward;
        };
        case (null) {};
      };
      var tempTotalreward = totalReward(userReward);

      var tempName : Text = "";
      //  if(user.name !=null){
      //  };
      switch (user.name) {
        case (?isname) {
          tempName := isname;

        };
        case (null) {

        };
      };
      let listUser : TopWinnerUserList = {
        name = tempName;
        joinedFrom = user.joinedFrom;
        role = user.role;
        isBlocked = user.isBlocked;
        isAdminBlocked = user.isAdminBlocked;
        dob = user.dob;
        profileImg = user.profileImg;
        gender = user.gender;
        rewards = userReward;
        totalReward = tempTotalreward;
      };

      usersList.put(id, listUser);

    };
    return EntryStoreHelper.sortTopWinner(usersList, search, startIndex, length);
  };
  // Get User details by the caller
  public query ({ caller }) func get_user_details(userId : UserId) : async Result.Result<(Text, User, Bool), Text> {
    // assert is_user(userId) != null;
    var userPrincipal : Principal = caller;
    switch userId {
      case (?isUserId) {
        userPrincipal := Principal.fromText(isUserId);
        let user = userStorage.get(userPrincipal);

        switch user {
          case (?iuser) {
            return #ok("User get by id Successful", iuser, userPrincipal == caller);
          };
          case (null) {
            return #err("User not found");

          };
        };
      };
      case (null) {
        let user = userStorage.get(caller);

        switch user {
          case (?iuser) {
            return #ok("User get by Caller Successful", iuser, true);
          };
          case (null) {
            return #err("User not found");

          };
        };

      };
    };

    // let user = userStorage.get(caller);

    return #err("Something went wrong while getting user");
  };
  public query func get_user_name(userId : Principal) : async ?{
    name : ?Text;
    image : ?NewImageObject;
    designation : ?Text;
  } {
    // assert is_user(userId) != null;

    let user = userStorage.get(userId);

    switch user {
      case (?iuser) {
        return ?{
          name = iuser.name;
          image = iuser.profileImg;
          designation = iuser.designation;
        };
      };
      case (null) {
        return null;

      };
    };

    // let user = userStorage.get(caller);

  };
  public query func get_user_email(userId : Principal) : async ?{
    email : ?Text;
  } {
    // assert is_user(userId) != null;

    let user = userStorage.get(userId);

    switch user {
      case (?iuser) {
        return ?{
          email = iuser.email;

        };
      };
      case (null) {
        return null;

      };
    };

    // let user = userStorage.get(caller);

  };
  public query func get_user_name_only(userId : Principal) : async ?Text {
    let user = userStorage.get(userId);
    switch user {
      case (?iuser) {
        return iuser.name;

      };
      case (null) {
        return null;
      };
    };

  };
  func get_user_name_only_privateFn(userId : Principal) : Text {
    let user = userStorage.get(userId);
    switch user {
      case (?iuser) {
        switch (iuser.name) {
          case (?isName) { return isName };
          case (null) { return "" };
        };

      };
      case (null) {
        return "";
      };
    };

  };
  public shared ({ caller }) func block_user(userId : Text, commentCanisterId : Text) : async Result.Result<(Text, User), Text> {
    assert require_permission(caller, #manage_user);
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
    };
    let userPrincipal = Principal.fromText(userId);
    let maybeUser = is_user(userPrincipal);
    switch (maybeUser) {

      case (?user) {
        var tempUser = {
          name = user.name;
          designation = user.designation;
          email = user.email;
          website = user.website;
          dob = user.dob;
          gender = user.gender;
          facebook = user.facebook;
          twitter = user.twitter;
          instagram = user.instagram;
          linkedin = user.linkedin;
          authorInfo = user.authorInfo;
          authorTitle = user.authorTitle;
          authorDescription = user.authorDescription;
          profileImg = user.profileImg;
          bannerImg = user.bannerImg;
          joinedFrom = user.joinedFrom;
          rewards = user.rewards;
          role = user.role;
          // block the user
          isBlocked = true;
          isAdminBlocked = user.isAdminBlocked;
          isVerified = user.isVerified;
          isVerificationRequested = user.isVerificationRequested;
          identificationImage = user.identificationImage;
        };
        // tempUser.isBlocked := true;
        let oldUser = userStorage.replace(userPrincipal, tempUser);
        var tempname = "";

        switch (user.name) {
          case (?isname) {
            tempname := isname;

          };
          case (null) {

          };
        };
        let activitied = commentCanister.addAdminActivity(caller, userId, #block, tempname);

        return #ok("User blocked", tempUser);
      };
      case (null) {
        return #err("Erroe while blocking");
      };
    };

  };
  public shared ({ caller }) func block_sub_admin(userId : Text, commentCanisterId : Text) : async Result.Result<(Text, User), Text> {
    assert require_permission(caller, #assign_role);
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
    };
    let userPrincipal = Principal.fromText(userId);
    let maybeUser = is_user(userPrincipal);
    switch (maybeUser) {

      case (?user) {
        switch (user.role) {
          case (#admin) {
            return #err("Not Allowed");
          };
          case (_) {

          };
        };

        var tempUser = {
          name = user.name;
          designation = user.designation;
          email = user.email;
          website = user.website;
          dob = user.dob;
          gender = user.gender;
          facebook = user.facebook;
          twitter = user.twitter;
          instagram = user.instagram;
          linkedin = user.linkedin;
          authorInfo = user.authorInfo;
          authorTitle = user.authorTitle;
          authorDescription = user.authorDescription;
          profileImg = user.profileImg;
          bannerImg = user.bannerImg;
          joinedFrom = user.joinedFrom;
          rewards = user.rewards;
          role = user.role;
          // block the user
          isBlocked = user.isBlocked;
          isAdminBlocked = true;
          isVerified = user.isVerified;
          isVerificationRequested = user.isVerificationRequested;
          identificationImage = user.identificationImage;
        };
        // tempUser.isBlocked := true;
        let oldUser = userStorage.replace(userPrincipal, tempUser);
        var tempname = "";

        switch (user.name) {
          case (?isname) {
            tempname := isname;

          };
          case (null) {

          };
        };
        let activitied = commentCanister.addAdminActivity(caller, userId, #block, tempname);

        return #ok("Sub_admin successfully blocked", tempUser);
      };
      case (null) {
        return #err("Error while blocking");
      };
    };

  };
  public shared ({ caller }) func unBlock_sub_admin(userId : Text, commentCanisterId : Text) : async Result.Result<(Text, User), Text> {
    assert require_permission(caller, #assign_role);
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
    };
    let userPrincipal = Principal.fromText(userId);
    let maybeUser = userStorage.get(userPrincipal);
    switch (maybeUser) {
      case (?user) {
        switch (user.role) {
          case (#admin) {
            return #err("Not Allowed.");
          };
          case (_) {

          };
        };

        var tempUser = {
          name = user.name;
          designation = user.designation;
          email = user.email;
          website = user.website;
          dob = user.dob;
          gender = user.gender;
          facebook = user.facebook;
          twitter = user.twitter;
          instagram = user.instagram;
          linkedin = user.linkedin;
          authorInfo = user.authorInfo;
          authorTitle = user.authorTitle;
          authorDescription = user.authorDescription;
          profileImg = user.profileImg;
          bannerImg = user.bannerImg;
          joinedFrom = user.joinedFrom;
          rewards = user.rewards;
          role = user.role;
          // block the user
          isBlocked = user.isBlocked;
          isAdminBlocked = false;
          isVerified = user.isVerified;
          isVerificationRequested = user.isVerificationRequested;
          identificationImage = user.identificationImage;
        };
        // tempUser.isBlocked := true;
        let oldUser = userStorage.replace(userPrincipal, tempUser);
        var tempname = "";

        switch (user.name) {
          case (?isname) {
            tempname := isname;

          };
          case (null) {

          };
        };
        let activitied = commentCanister.addAdminActivity(caller, userId, #unBlock, tempname);
        return #ok("Sub_admin_Unblocked", tempUser);
      };
      case (null) {
        return #err("Erroe while unBlocking");
      };
    };

  };
  public shared ({ caller }) func unBlock_user(userId : Text, commentCanisterId : Text) : async Result.Result<(Text, User), Text> {
    assert require_permission(caller, #manage_user);
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
    };
    let userPrincipal = Principal.fromText(userId);
    let maybeUser = userStorage.get(userPrincipal);
    switch (maybeUser) {
      case (?user) {

        var tempUser = {
          name = user.name;
          designation = user.designation;
          email = user.email;
          website = user.website;
          dob = user.dob;
          gender = user.gender;
          facebook = user.facebook;
          twitter = user.twitter;
          instagram = user.instagram;
          linkedin = user.linkedin;
          authorInfo = user.authorInfo;
          authorTitle = user.authorTitle;
          authorDescription = user.authorDescription;
          profileImg = user.profileImg;
          bannerImg = user.bannerImg;
          joinedFrom = user.joinedFrom;
          rewards = user.rewards;
          role = user.role;
          // block the user
          isBlocked = false;
          isAdminBlocked = user.isAdminBlocked;
          isVerified = user.isVerified;
          isVerificationRequested = user.isVerificationRequested;
          identificationImage = user.identificationImage;
        };
        // tempUser.isBlocked := true;
        let oldUser = userStorage.replace(userPrincipal, tempUser);
        var tempname = "";

        switch (user.name) {
          case (?isname) {
            tempname := isname;

          };
          case (null) {

          };
        };
        let activitied = commentCanister.addAdminActivity(caller, userId, #unBlock, tempname);
        return #ok("User Unblocked", tempUser);
      };
      case (null) {
        return #err("Error while unBlocking");
      };
    };

  };

  func give_reward_if_email_is_verified(userId : Id, user : InputUser) : async () {
    var alreadyRewarded = await isAlreadyVerifiedEmail(userId);
    let oldUser = is_user(userId);
    let currentTime = getCurrentDate();
    let tempReward : EmailVerification = {
      creation_time = currentTime;
      reward = emailVerficationReward;
    };
    assert oldUser != null;
    if (not alreadyRewarded) {
      switch (oldUser) {
        case (?isUser) {
          let trimmed = Text.trim(user.email, #char ' ');
          let isEamil = Text.contains(trimmed, #text "@");
          if (isEamil) {
            let sendreward = await add_reward(userId, emailVerficationReward, "e");
            let res = emailVerifiedRewardedStorage.put(userId, tempReward);
          };
        };
        case (null) {};
      };
    };
  };

  public query func isAlreadyVerifiedEmail(userId : Id) : async Bool {
    let user = emailVerifiedRewardedStorage.get(userId);

    switch (user) {
      case (?isUser) {
        return true;
      };
      case (null) {
        return false;
      };
    };

  };

  func reward_get_when_profile_complete(user : User, userId : Id) : async () {
    //  let sendreward = await add_reward(userId, profileCompReward);

    var alreadyRewarded = isAlreadyCompProfile(userId);
    let currentTime = getCurrentDate();
    let tempReward : ProfileCompleteReward = {
      creation_time = currentTime;
      reward = profileCompReward;
    };
    if (not alreadyRewarded) {
      var canTake = true;
      let userData = [user.bannerImg, user.profileImg, user.dob, user.facebook, user.instagram, user.linkedin, user.twitter, user.gender, user.authorDescription, user.authorTitle, user.authorInfo, user.name, user.designation, user.email, user.website];
      for (val in userData.vals()) {
        switch (val) {
          case (?isVal) {
            let removeSpace = Text.trimStart(isVal, #char ' ');
            if (removeSpace.size() < 1) {
              canTake := false

            };
          };
          case (null) {
            canTake := false;
          };
        };
      };
      if (canTake) {

        let sendreward = await add_reward(userId, profileCompReward, "d");
        let res = compProfileRewardedStorage.put(userId, tempReward);
      };
    };
  };

  func isAlreadyCompProfile(userId : Id) : Bool {
    let user = compProfileRewardedStorage.get(userId);
    switch (user) {
      case (?isUser) {
        return true;
      };
      case (null) {
        return false;
      };
    };

  };

  // Edit User details by the caller
  public shared ({ caller }) func update_user(user : InputUser, entryCanisterId : Text) : async Result.Result<(Text, User, ?User), Text> {
    let entryCanister = actor (entryCanisterId) : actor {
      updateUserEntries : (userId : Principal, userName : Text) -> async Bool;
    };

    let oldUser = is_user(caller);

    assert oldUser != null;
    var tempRewareds : Rewards = [];
    var tempRole : Role = #authorized;
    var tempBlocked = false;
    var tempisAdminBlocked = false;
    switch (oldUser) {
      case (?isOldUser) {

        tempRewareds := isOldUser.rewards;
        tempRole := isOldUser.role;
        tempBlocked := isOldUser.isBlocked;
        tempisAdminBlocked := isOldUser.isAdminBlocked;

        if (tempBlocked) {
          return #err("error while updating profile");
        };
        switch (isOldUser.email) {
          case (?email) {
            if (user.email != email) {
              let isEmail = emailExists(user.email);
              if (isEmail) {
                return #err("Email Already Exists");

              } else {

              };
            };
          };
          case (null) {
            //send reward to user if he did verify his profile

          };
        };
      };
      case (null) {
        return #err("error while updating user");
      };
    };

    // var tempName = "";
    // var tempBio = "";
    // var tempExternalLink = "";
    // var tempTwitter = "";
    // var tempEmail = "";
    var tempName = "";
    var tempDesignation = "";
    var tempEmail = "";
    var tempWebsite = "";
    var tempDob = "";
    var tempGender = "";
    var tempFacebook = "";
    var tempTwitter = "";
    var tempInstagram = "";
    var tempLinekdin = "";
    var tempAuthorInfo = "";
    var tempAuthorTitle = "";
    var tempAuthorDescription = "";
    var tempProfileImg : ?NewImageObject = null;
    var tempBannerImg : ?NewImageObject = null;
    var tempJoinedFrom : Int = 0;
    var tempVerified : Bool = false;
    var tempVerificationRequested : Bool = false;
    var tempidentificationImage : ?NewImageObject = null;

    // assert user.bio.size() <= MAX_BIO_CHARS;
    // tempBio := user.bio;
    // assert user.externalLink.size() <= MAX_LINK_CHARS;
    // tempExternalLink := user.externalLink;
    assert user.name.size() <= MAX_NAME_CHARS;
    assert user.name.size() >= 1;
    tempName := user.name;
    assert user.designation.size() <= MAX_DESIGNATION_CHARS;
    tempDesignation := user.designation;

    assert user.email.size() <= MAX_EMAIL_CHARS;
    tempEmail := user.email;

    assert user.website.size() <= MAX_LINK_CHARS;
    tempWebsite := user.website;

    assert user.dob.size() <= MAX_NAME_CHARS;
    tempDob := user.dob;

    assert user.gender.size() <= MAX_NAME_CHARS;
    tempGender := user.gender;

    assert user.facebook.size() <= MAX_LINK_CHARS;
    tempFacebook := user.facebook;

    assert user.twitter.size() <= MAX_LINK_CHARS;
    tempTwitter := user.twitter;

    assert user.instagram.size() <= MAX_LINK_CHARS;
    tempInstagram := user.instagram;

    assert user.linkedin.size() <= MAX_LINK_CHARS;
    tempLinekdin := user.linkedin;

    assert user.authorInfo.size() <= MAX_BIO_CHARS;
    tempAuthorInfo := user.authorInfo;

    assert user.authorTitle.size() <= MAX_TITLE_CHARS;
    tempAuthorTitle := user.authorTitle;

    assert user.authorDescription.size() <= MAX_BIO_CHARS;
    tempAuthorDescription := user.authorDescription;

    if (user.bannerImg != null) {
      tempBannerImg := user.bannerImg;

    } else {
      switch (oldUser) {
        case (?isUser) {
          tempBannerImg := isUser.bannerImg;
        };
        case (null) {};

      };
    };
    if (user.profileImg != null) {
      tempProfileImg := user.profileImg;
    } else {
      switch (oldUser) {
        case (?isUser) {
          tempProfileImg := isUser.profileImg;
        };
        case (null) {

        };

      };
    };

    switch oldUser {
      case (?isUser) {
        tempJoinedFrom := isUser.joinedFrom;
        tempVerified := isUser.isVerified;
        tempVerificationRequested := isUser.isVerificationRequested;
        tempidentificationImage := isUser.identificationImage;
        // let oldname = isUser.name;
        switch (isUser.name) {
          case (?oldname) {
            let isOldname = Text.notEqual(oldname, tempName);

            if (isOldname) {

              let result = entryCanister.updateUserEntries(caller, tempName);

            };
          };
          case (null) {

          };
        };

      };
      case (null) {
        return #err("Error while updating joined date");
      };
    };

    var tempUser = {
      name = ?tempName;
      designation = ?tempDesignation;
      email = ?tempEmail;
      website = ?tempWebsite;
      dob = ?tempDob;
      gender = ?tempGender;
      facebook = ?tempFacebook;
      twitter = ?tempTwitter;
      instagram = ?tempInstagram;
      linkedin = ?tempLinekdin;
      authorInfo = ?tempAuthorInfo;
      authorTitle = ?tempAuthorTitle;
      authorDescription = ?tempAuthorDescription;
      profileImg = tempProfileImg;
      bannerImg = tempBannerImg;
      joinedFrom = tempJoinedFrom;
      rewards = tempRewareds;
      role = tempRole;
      isBlocked = tempBlocked;
      isAdminBlocked = tempisAdminBlocked;
      isVerified = tempVerified;
      isVerificationRequested = tempVerificationRequested;
      identificationImage = tempidentificationImage;
    };
    let beforeUser = userStorage.replace(caller, tempUser);
    let reward = give_reward_if_email_is_verified(caller, user);

    let rewardedUser = reward_get_when_profile_complete(tempUser, caller);
    return #ok("User Updated Successfuly", tempUser, beforeUser)

  };
  // Edit User details by the admin
  public shared ({ caller }) func admin_update_user(userId : Id, user : InputUser, entryCanisterId : Text) : async Result.Result<(Text, User, ?User), Text> {
    let oldUser = is_user(userId);
    assert require_permission(caller, #assign_role);
    let entryCanister = actor (entryCanisterId) : actor {
      updateUserEntries : (userId : Principal, userName : Text) -> async Bool;
    };
    assert oldUser != null;
    var tempRewareds : Rewards = [];
    var tempRole : Role = #authorized;
    var tempBlocked = false;
    var tempisAdminBlocked = false;
    switch (oldUser) {
      case (?isOldUser) {

        tempRewareds := isOldUser.rewards;
        tempRole := isOldUser.role;
        tempBlocked := isOldUser.isBlocked;
        tempisAdminBlocked := isOldUser.isAdminBlocked;

        if (tempBlocked) {
          return #err("error while updating profile");
        };
        switch (isOldUser.email) {
          case (?email) {
            if (user.email != email) {
              let isEmail = emailExists(user.email);
              if (isEmail) {
                return #err("Email Already Exists");

              } else {

              };
            };
          };
          case (null) {
            //send reward to user if he did verify his profile
            let reward = give_reward_if_email_is_verified(userId, user);

          };
        };
      };
      case (null) {
        return #err("error while updating user");
      };
    };

    // var tempName = "";
    // var tempBio = "";
    // var tempExternalLink = "";
    // var tempTwitter = "";
    // var tempEmail = "";
    var tempName = "";
    var tempDesignation = "";
    var tempEmail = "";
    var tempWebsite = "";
    var tempDob = "";
    var tempGender = "";
    var tempFacebook = "";
    var tempTwitter = "";
    var tempInstagram = "";
    var tempLinekdin = "";
    var tempAuthorInfo = "";
    var tempAuthorTitle = "";
    var tempAuthorDescription = "";
    var tempProfileImg : ?NewImageObject = null;
    var tempBannerImg : ?NewImageObject = null;
    var tempJoinedFrom : Int = 0;
    var tempVerified : Bool = false;
    var tempVerificationRequested : Bool = false;
    var tempidentificationImage : ?NewImageObject = null;
    // assert user.bio.size() <= MAX_BIO_CHARS;
    // tempBio := user.bio;
    // assert user.externalLink.size() <= MAX_LINK_CHARS;
    // tempExternalLink := user.externalLink;
    assert user.name.size() <= MAX_NAME_CHARS;
    assert user.name.size() >= 1;
    tempName := user.name;
    assert user.designation.size() <= MAX_DESIGNATION_CHARS;
    tempDesignation := user.designation;

    assert user.email.size() <= MAX_EMAIL_CHARS;
    tempEmail := user.email;

    assert user.website.size() <= MAX_LINK_CHARS;
    tempWebsite := user.website;

    assert user.dob.size() <= MAX_NAME_CHARS;
    tempDob := user.dob;

    assert user.gender.size() <= MAX_NAME_CHARS;
    tempGender := user.gender;

    assert user.facebook.size() <= MAX_LINK_CHARS;
    tempFacebook := user.facebook;

    assert user.twitter.size() <= MAX_LINK_CHARS;
    tempTwitter := user.twitter;

    assert user.instagram.size() <= MAX_LINK_CHARS;
    tempInstagram := user.instagram;

    assert user.linkedin.size() <= MAX_LINK_CHARS;
    tempLinekdin := user.linkedin;

    assert user.authorInfo.size() <= MAX_BIO_CHARS;
    tempAuthorInfo := user.authorInfo;

    assert user.authorTitle.size() <= MAX_TITLE_CHARS;
    tempAuthorTitle := user.authorTitle;

    assert user.authorDescription.size() <= MAX_BIO_CHARS;
    tempAuthorDescription := user.authorDescription;

    if (user.bannerImg != null) {
      tempBannerImg := user.bannerImg;

    } else {
      switch (oldUser) {
        case (?isUser) {
          tempBannerImg := isUser.bannerImg;
        };
        case (null) {};

      };
    };
    if (user.profileImg != null) {
      tempProfileImg := user.profileImg;
    } else {
      switch (oldUser) {
        case (?isUser) {
          tempProfileImg := isUser.profileImg;
        };
        case (null) {

        };

      };
    };

    switch oldUser {
      case (?isUser) {
        tempJoinedFrom := isUser.joinedFrom;
        tempVerified := isUser.isVerified;
        tempVerificationRequested := isUser.isVerificationRequested;
        tempidentificationImage := isUser.identificationImage;
        switch (isUser.name) {
          case (?oldname) {
            let isOldname = Text.notEqual(oldname, tempName);

            if (isOldname) {

              let result = entryCanister.updateUserEntries(userId, tempName);
            };
          };
          case (null) {

          };
        };
      };
      case (null) {
        return #err("Error while updating joined date");
      };
    };

    var tempUser = {
      name = ?tempName;
      designation = ?tempDesignation;
      email = ?tempEmail;
      website = ?tempWebsite;
      dob = ?tempDob;
      gender = ?tempGender;
      facebook = ?tempFacebook;
      twitter = ?tempTwitter;
      instagram = ?tempInstagram;
      linkedin = ?tempLinekdin;
      authorInfo = ?tempAuthorInfo;
      authorTitle = ?tempAuthorTitle;
      authorDescription = ?tempAuthorDescription;
      profileImg = tempProfileImg;
      bannerImg = tempBannerImg;
      joinedFrom = tempJoinedFrom;
      rewards = tempRewareds;
      role = tempRole;
      isBlocked = tempBlocked;
      isAdminBlocked = tempisAdminBlocked;
      isVerified = tempVerified;
      isVerificationRequested = tempVerificationRequested;
      identificationImage = tempidentificationImage;
    };
    let beforeUser = userStorage.replace(userId, tempUser);

    return #ok("User Updated Successfuly", tempUser, beforeUser)

  };
  public query ({ caller }) func get_users(search : Text, status : Bool, startIndex : Nat, length : Nat) : async {
    users : [(Id, ListUser)];
    amount : Nat;
  } {
    assert require_permission(caller, #manage_user);
    let users : Users = [];
    var usersList = Map.HashMap<Id, ListUser>(0, Principal.equal, Principal.hash);
    for ((id, user) in userStorage.entries()) {
      let listUser : ListUser = {
        name = user.name;
        email = user.email;
        joinedFrom = user.joinedFrom;
        isBlocked = user.isBlocked;
        isAdminBlocked = user.isAdminBlocked;
        isVerified = user.isVerified;
        isVerificationRequested = user.isVerificationRequested;
        identificationImage = user.identificationImage;
      };
      if (status == user.isVerified and user.isVerificationRequested) {
        usersList.put(id, listUser);
      };
    };
    return EntryStoreHelper.searchSortUserList(usersList, search, startIndex, length);

  };

  public query ({ caller }) func user_count() : async Int {
    let userArray = Iter.toArray(userStorage.entries());

    return userArray.size();
  };

  public query func verified_user_count() : async UserCount {
    let userArray = Iter.toArray(userStorage.entries());
    let userCount = userArray.size();
    var verifiedUserCount = 0;
    var blockUserCount = 0;
    var unBlockUserCount = 0;
    var UnverifiedUserCount = 0;

    for ((id, user) in userStorage.entries()) {
      if (not user.isVerified) {
        UnverifiedUserCount += 1;
      };
      if (user.isVerified) {
        verifiedUserCount += 1;
      };
      if (user.isBlocked) {
        blockUserCount += 1;
      };
      if (not user.isBlocked) {
        unBlockUserCount += 1;
      };
    };

    return {
      Users = userCount;
      verified = verifiedUserCount;
      unverified = UnverifiedUserCount;
      blocked = blockUserCount;
      Unblocked = unBlockUserCount;
    };
  };

  public shared ({ caller }) func request_verification(identitificationImage : NewImageObject) : async Result.Result<(Text, User, ?User), Text> {
    let oldUser = is_user(caller);
    assert oldUser != null;
    let request = true;
    let identityImage = identitificationImage;

    switch (oldUser) {
      case (?user) {

        var tempUser = {
          name = user.name;
          designation = user.designation;
          email = user.email;
          website = user.website;
          dob = user.dob;
          gender = user.gender;
          facebook = user.facebook;
          twitter = user.twitter;
          instagram = user.instagram;
          linkedin = user.linkedin;
          authorInfo = user.authorInfo;
          authorTitle = user.authorTitle;
          authorDescription = user.authorDescription;
          profileImg = user.profileImg;
          bannerImg = user.bannerImg;
          joinedFrom = user.joinedFrom;
          rewards = user.rewards;
          role = user.role;
          isBlocked = user.isBlocked;
          isAdminBlocked = user.isAdminBlocked;
          isVerified = user.isVerified;
          isVerificationRequested = request;
          identificationImage = ?identityImage;
        };
        // tempUser.isBlocked := true
        let oldUser = userStorage.replace(caller, tempUser);
        return #ok("Verification Requested", tempUser, oldUser);
      };
      case (null) {
        return #err("Erroe while requesting verification");
      };
    };
  };
  public shared ({ caller }) func verify_user(userId : Text, commentCanisterId : Text) : async Result.Result<(Text, User, ?User), Text> {
    let userPrincipal = Principal.fromText(userId);
    let oldUser = is_user(userPrincipal);
    assert require_permission(caller, #manage_user);
    assert oldUser != null;
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
    };
    let maybeUser = userStorage.get(userPrincipal);
    let verified = true;

    switch (maybeUser) {
      case (?user) {
        var tempUser = {
          name = user.name;
          designation = user.designation;
          email = user.email;
          website = user.website;
          dob = user.dob;
          gender = user.gender;
          facebook = user.facebook;
          twitter = user.twitter;
          instagram = user.instagram;
          linkedin = user.linkedin;
          authorInfo = user.authorInfo;
          authorTitle = user.authorTitle;
          authorDescription = user.authorDescription;
          profileImg = user.profileImg;
          bannerImg = user.bannerImg;
          joinedFrom = user.joinedFrom;
          rewards = user.rewards;
          role = user.role;
          isBlocked = user.isBlocked;
          isAdminBlocked = user.isAdminBlocked;
          isVerified = verified;
          isVerificationRequested = user.isVerificationRequested;
          identificationImage = user.identificationImage;
        };
        // tempUser.isBlocked := true
        let oldUser = userStorage.replace(userPrincipal, tempUser);
        var tempname = "";

        switch (user.name) {
          case (?isname) {
            tempname := isname;

          };
          case (null) {

          };
        };
        let activitied = commentCanister.addAdminActivity(caller, userId, #verify_user, tempname);
        return #ok("User Verified", tempUser, oldUser);
      };
      case (null) {
        return #err("Erroe while verfifying");
      };
    };
    // let beforeUser = userStorage.replace(userId, tempUser);
    // return #ok("User Updated Successfuly", tempUser, beforeUser)

  };
  public shared ({ caller }) func un_verify_user(userId : Text, commentCanisterId : Text) : async Result.Result<(Text, User, ?User), Text> {
    let userPrincipal = Principal.fromText(userId);
    let oldUser = is_user(userPrincipal);
    assert require_permission(caller, #manage_user);
    assert oldUser != null;
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType, title : Text) -> async Bool;
    };
    let maybeUser = userStorage.get(userPrincipal);
    let verified = false;

    switch (maybeUser) {
      case (?user) {
        var tempUser = {
          user with
          isVerified = false;
          isVerificationRequested = false;
          identificationImage = null;
        };
        // tempUser.isBlocked := true
        let oldUser = userStorage.replace(userPrincipal, tempUser);
        var tempname = "";

        switch (user.name) {
          case (?isname) {
            tempname := isname;

          };
          case (null) {

          };
        };
        let activitied = commentCanister.addAdminActivity(caller, userId, #un_verify_user, tempname);
        return #ok("User UnVerified", tempUser, oldUser);
      };
      case (null) {
        return #err("Erroe while verfifying");
      };
    };
    // let beforeUser = userStorage.replace(userId, tempUser);
    // return #ok("User Updated Successfuly", tempUser, beforeUser)

  };
  public shared ({ caller }) func add_reward(user : Principal, like_reward : Nat, enum : Text) : async Bool {
    assert Principal.isController(caller);
    let oldUser = is_user(user);
    assert oldUser != null;

    switch (oldUser) {
      case (?isUser) {
        let tempCurrentTime = getCurrentDate();
        let newReward : UsersReward = {
          creation_time = tempCurrentTime;
          isClaimed = false;
          claimed_at = null;
          amount = like_reward;
          reward_type = enum;
        };
        let userRewards = usersRewardsStorage.get(user);
        switch (userRewards) {
          case (?isOldReward) {
            let newRewards : UsersRewards = Array.append(isOldReward, [newReward]);
            let newEntry = usersRewardsStorage.replace(user, newRewards);

          };
          case (null) {
            let userRewards = usersRewardsStorage.put(user, [newReward]);

          };
        };

        return true;
      };
      case (null) {
        return false;

      };
    };
  };
 
  public shared ({ caller }) func claim_rewards_of_user() : async Bool {

    let oldUser = is_user(caller);
    assert oldUser != null;
    assert not Principal.isAnonymous(caller);
    switch (oldUser) {
      case (?isUser) {
        if (not isUser.isVerified) {

          return false;
        };
      };
      case (null) {

        return false;
      };
    };



    var count : Nat = 0;
    var claimableAmount : Nat = 0;
    func claim_reward(reward : UsersReward) : UsersReward {
      if (reward.isClaimed) {
        return reward;
      } else {
        let tempCurrentTime = getCurrentDate();
        var newReward : UsersReward = {
          creation_time = reward.creation_time;
          isClaimed = true;
          claimed_at = ?(tempCurrentTime);
          amount = reward.amount;
          reward_type = reward.reward_type;
        };
        count := count + 1;
        claimableAmount := claimableAmount + reward.amount;
        return newReward;
      };
    };
    switch (oldUser) {
      case (?isUser) {
        let userRewards = usersRewardsStorage.get(caller);
        switch (userRewards) {
          case (?userRewards) {
            let oldRewards = userRewards;

            var newRewards = Array.map<UsersReward, UsersReward>(oldRewards, claim_reward);
            var totalTokens : Nat = claimableAmount;

            if (totalTokens < minimumClaimReward) {
              newRewards := oldRewards;

              return false;

            };

            if (totalTokens >= minimumClaimReward) {
              let newEntry = usersRewardsStorage.replace(caller, newRewards);
              newRewards := oldRewards;

              if (totalTokens <= 0) {
                return false;
              };
              let tempTodayDate = getCurrentDate();
                  let platformPercentage : Float = Float.fromInt(transactionfees) / 100;
          let platformFee = (platformPercentage * Float.fromInt(totalTokens));
               let transectionfees=Int.abs(Float.toInt(platformFee));
              let tempClaimedReques : TokenClaimRequest = {
                tokens = totalTokens-transectionfees;
                transectionFee=transectionfees;
                creation_time = tempTodayDate;
                user = caller;
                status = #pending;
              };
              let rewardId = EntryType.generateNewRemoteObjectId();
              let _res = tokensClaimRequest.put(rewardId, tempClaimedReques);

          
              return true;
            } else {
              return false;
            };
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
  public shared ({ caller }) func update_NFT24Coin(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward > 0;
    assert inputReward <= E8S * E8S;

    // var oneCoinVal = E8S / inputReward;
    oneNFT24Coin := inputReward;
    return true;
  };
  public shared ({ caller }) func updateEmailVerificationReward(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward > 0;
    assert inputReward <= E8S * E8S;
    let tempOldreward = emailVerficationReward;

    emailVerficationReward := inputReward;
    let res = saveRewardValuesChangers(caller, inputReward, tempOldreward, "f");

    return true;
  };
  public shared ({ caller }) func updateNewUserReward(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward > 0;
    assert inputReward <= E8S * E8S;
    let tempOldreward = newUserReward;

    newUserReward := inputReward;
    let res = saveRewardValuesChangers(caller, inputReward, tempOldreward, "g");

    return true;
  };
  public shared ({ caller }) func updateArticleReadReward(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward >= 0;
    assert inputReward <= E8S * E8S;
    let tempOldreward = articleReadReward;

    articleReadReward := inputReward;
    let res = saveRewardValuesChangers(caller, inputReward, tempOldreward, "h");

    return true;
  };

  public shared ({ caller }) func updateProfileCompReward(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward >= 0;
    assert inputReward <= E8S * E8S;
    let tempOldreward = profileCompReward;
    profileCompReward := inputReward;
    let res = saveRewardValuesChangers(caller, inputReward, tempOldreward, "k");

    return true;
  };

  public shared ({ caller }) func updateMinimumClaimReward(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward > 0;
    assert inputReward <= E8S * E8S * E8S;
    let tempOldreward = minimumClaimReward;

    minimumClaimReward := inputReward;
    let res = saveRewardValuesChangers(caller, inputReward, tempOldreward, "i");

    return true;
  };
  public shared ({ caller }) func updateDailyLoginReward(inputReward : Nat) : async Bool {
    assert not Principal.isAnonymous(caller);

    assert require_permission(caller, #assign_role);
    assert inputReward > 0;
    assert inputReward <= E8S * E8S * E8S;
    let tempOldreward = dailyLoginReward;
    dailyLoginReward := inputReward;
    let res = saveRewardValuesChangers(caller, inputReward, tempOldreward, "j");

    return true;
  };
  public query ({ caller }) func get_newUserReward() : async Nat {

    return newUserReward;
  };
  public query ({ caller }) func getArticleReadReward() : async Nat {

    return articleReadReward;
  };
  public query ({ caller }) func get_NFT24Coin() : async Nat {

    return oneNFT24Coin;
  };
  public query ({ caller }) func getEmailVerificationReward() : async Nat {

    return emailVerficationReward;
  };
  public query ({ caller }) func getProfileCompReward() : async Nat {

    return profileCompReward;
  };
  public query ({ caller }) func getMinimumClaimReward() : async Nat {

    return minimumClaimReward;
  };
  public query ({ caller }) func getDailyLoginReward() : async Nat {

    return dailyLoginReward;
  };
  // logic of article reads
  public query ({ caller }) func isAlreadyReadTheEntry(entryId : EntryId) : async Bool {
    let user = articleReadersStorage.get(caller);
    switch (user) {
      case (?isUser) {
        let findentryId = Array.find<EntryId>(isUser, func key = key == entryId);
        switch (findentryId) {
          case (?findentryId) {
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
  public shared ({ caller }) func addReaderOfEntry(entryId : EntryId, entryCanisterId : Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    if (addEntryRewardLoading) {
      return false;
    };
    addEntryRewardLoading := true;
    let entryCanister = actor (entryCanisterId) : actor {
      isEntryVerifiedPublicFn : (key : Text) -> async Bool;
    };
    let user = articleReadersStorage.get(caller);
    let isEntryVerified = await entryCanister.isEntryVerifiedPublicFn(entryId);
    if (isEntryVerified) {

      switch (user) {
        case (?entriesIds) {
          let findEntryId = Array.find<EntryId>(entriesIds, func key = key == entryId);
          switch (findEntryId) {
            case (?findEntryId) {
              addEntryRewardLoading := false;
              return false;

            };
            case (null) {

              let newArray = Array.append(entriesIds, [entryId]);
              let res = articleReadersStorage.replace(caller, newArray);
              let newJoineyReward = await add_reward(caller, articleReadReward, "f");
              addEntryRewardLoading := false;
              return true;

            };
          };

        };
        case (null) {
          let res = articleReadersStorage.put(caller, [entryId]);
          let newJoineyReward = await add_reward(caller, articleReadReward, "f");
          addEntryRewardLoading := false;
          return true;
        };
      };
    } else {
      addEntryRewardLoading := false;
      return false;

    };

  };
  func isLoginAfter24(user : Id) : async Bool {
    let isUserRecord = dailyUserLoginStorage.get(user);
    switch (isUserRecord) {

      case (?isUserRecord) {
        let compare = func(a : LoginReward, b : LoginReward) : Order.Order {
          if (a.date > b.date) {
            return #less;
          } else if (a.date < b.date) {
            return #greater;
          } else {
            return #equal;
          };
        };
        let sortedEntries = Array.sort(
          isUserRecord,
          compare,
        );

        if (sortedEntries.size() <= 0) {
          return true;
        } else {
          let lastLogin = sortedEntries[0].date;

          let curretTime = getCurrentDate();
          let milisecondsIN24H = 24 * 60 * 60 * 1000;
          // let milisecondsIN24H = 1 * 60 * 1000;

          if (lastLogin + milisecondsIN24H <= curretTime) {

            return true;

          } else {

            return false;

          };

        };
      };
      case (null) {
        return true;
      };
    };
  };

  func addDailyLoginReward(user : Id) : async Bool {
    if (loginAttemptCount) {
      return false;
    };
    loginAttemptCount := true;
    let isUserRecord = dailyUserLoginStorage.get(user);
    let loginAfter24 = await isLoginAfter24(user);

    if (loginAfter24) {
      let tempCurrentTime = getCurrentDate();
      let tempLogin : LoginReward = {
        date = tempCurrentTime;
        reward = dailyLoginReward;
      };
      switch (isUserRecord) {
        case (?isUserRecord) {
          let newArray = Array.append(isUserRecord, [tempLogin]);

          let res = dailyUserLoginStorage.replace(user, newArray);
          let newJoineyReward = await add_reward(user, dailyLoginReward, "c");
          loginAttemptCount := false;
          return true;
        };
        case (null) {
          let res = dailyUserLoginStorage.put(user, [tempLogin]);
          let newJoineyReward = await add_reward(user, dailyLoginReward, "c");
          loginAttemptCount := false;
          return true;
        };
      };
    } else {
      loginAttemptCount := false;
      return false;
    };
  };
  // get rewards
  public query ({ caller }) func get_reward_of_user(startIndex : Nat, length : Nat) : async {
    reward : UsersRewards;
    amount : Nat;
  } {
    var tempArray : UsersRewards = [];
    let userRewards = usersRewardsStorage.get(caller);
    switch (userRewards) {
      case (null) {};
      case (?isUserRewards) {

        for (r in isUserRewards.vals()) {
          var tempEnum = "";
          let getEnum = enumsStore.get(r.reward_type);
          switch (getEnum) {
            case (null) { tempEnum := "other" };
            case (?isEnum) { tempEnum := isEnum };
          };
          let temReward : UsersReward = { r with reward_type = tempEnum };
          tempArray := Array.append(tempArray, [temReward]);

        };

      };
    };
    return EntryStoreHelper.searchSortReward(tempArray, startIndex, length);
  };
  public query ({ caller }) func get_reward_of_user_count() : async {
    all : Nat;
    claimed : Nat;
    unclaimed : Nat;

  } {
    var all : Nat = 0;
    var claimed : Nat = 0;
    var unclaimed : Nat = 0;
    let userRewards = usersRewardsStorage.get(caller);
    switch (userRewards) {
      case (null) {};
      case (?isUserRewards) {
        //  for totall reward claimed
        let tempclaim = Array.filter<UsersReward>(isUserRewards, func rew = rew.isClaimed);
        for (item in tempclaim.vals()) {
          claimed += item.amount;
        };
        //  for totall reward unclaimed
        let tempUnclaim = Array.filter<UsersReward>(isUserRewards, func rew = not rew.isClaimed);
        for (item in tempUnclaim.vals()) {
          unclaimed += item.amount;
        };
        //  for totall reward
        for (item in isUserRewards.vals()) {
          all += item.amount;
        };

      };
    };
    return {
      all = all;
      claimed = claimed;
      unclaimed = unclaimed;

    };
  };
  /*
  saveRecordOfArtificialAndmenualReward use to save artificial and menual reward given by admin

  @parms {from : Id, to : Id, givenReward : Nat, isMenual : Bool}
  @return null



  */
  func saveRecordOfArtificialAndmenualReward(from : Id, to : Id, givenReward : Nat, isMenual : Bool) : () {
    let currentTime = getCurrentDate();
    let rewardId = EntryType.generateNewRemoteObjectId();

    var tempReward : MenualAndArtificialRewardType = {
      isMenual = isMenual;
      creation_time = currentTime;
      amount = givenReward;
      from = from;
      to = to;
    };
    let res = menualAndArtificialRewardStorage.put(rewardId, tempReward);

  };
  /*
  getListOfArtificialAndMenualRewardList use to get list of records send by admin

  @parms {search:Text,startIndex : Nat, length : Nat}
  @return {reward : [ReturnMenualAndArtificialReward], amount : Nat}
  */
  public query ({ caller }) func getListOfArtificialAndMenualRewardList(menual : Bool, search : Text, startIndex : Nat, length : Nat) : async {
    reward : ReturnMenualAndArtificialRewardList;
    amount : Nat;
  } {

    var sortedEntries = Map.HashMap<Text, ReturnMenualAndArtificialReward>(0, Text.equal, Text.hash);

    for ((key, item) in menualAndArtificialRewardStorage.entries()) {

      if (menual == item.isMenual) {
        let tempSenderName = get_user_name_only_privateFn(item.from);
        let tempReceiverName = get_user_name_only_privateFn(item.to);

        var tempReward : ReturnMenualAndArtificialReward = {
          isMenual = item.isMenual;
          creation_time = item.creation_time;
          amount = item.amount;
          from = item.from;
          to = item.to;
          senderName = tempSenderName;
          receiverName = tempReceiverName;
        };
        let tempRewar = sortedEntries.put(key, tempReward);

      };
    };
    return EntryStoreHelper.searchArtificialAndMenualRewardList(sortedEntries, search, startIndex, length);
  };
  /*
  saveRecordOfArtificialAndmenualReward use to save artificial and menual reward given by admin

  @parms {from : Id, to : Id, givenReward : Nat, isMenual : Bool}
  @return null
  */
  public shared ({ caller }) func saveRewardValuesChangers(changer : Id, newValue : Nat, oldValue : Nat, rewardType : Text) : () {
    assert Principal.isController(caller);
    let currentTime = getCurrentDate();
    let rewardId = EntryType.generateNewRemoteObjectId();

    var tempReward : RewardValuesChangeRecord = {
      rewardType = rewardType;
      creation_time = currentTime;
      newValue = newValue;
      oldValue = oldValue;
      changer = changer;
    };
    let res = rewardValueChangedStorage.put(rewardId, tempReward);

  };
  public shared ({ caller }) func saveRewardValuesChangerInterCanister(changer : Id, inputReward : RewardConfig, oldReward : RewardConfig) : () {
    assert Principal.isController(caller);
    let currentTime = getCurrentDate();
    let rewardId = EntryType.generateNewRemoteObjectId();

    if (inputReward.admin != oldReward.admin) {

      var tempReward : RewardValuesChangeRecord = {
        rewardType = "c";
        creation_time = currentTime;
        newValue = inputReward.admin;
        oldValue = oldReward.admin;
        changer = changer;
      };
      let res = rewardValueChangedStorage.put(rewardId, tempReward);

    };
    if (inputReward.master != oldReward.master) {

      var tempReward : RewardValuesChangeRecord = {
        rewardType = "a";
        creation_time = currentTime;
        newValue = inputReward.master;
        oldValue = oldReward.master;
        changer = changer;
      };
      var tempId = rewardId # "1";
      let res = rewardValueChangedStorage.put(tempId, tempReward);

    };
    if (inputReward.platform != oldReward.platform) {

      var tempReward : RewardValuesChangeRecord = {
        rewardType = "b";
        creation_time = currentTime;
        newValue = inputReward.platform;
        oldValue = oldReward.platform;
        changer = changer;
      };
      var tempId = rewardId # "2";

      let res = rewardValueChangedStorage.put(tempId, tempReward);

    };
  };
  /*
  getListOfArtificialAndMenualRewardList use to get list of records send by admin

  @parms {search:Text,startIndex : Nat, length : Nat}
  @return {reward : [ReturnMenualAndArtificialReward], amount : Nat}
  */
  public query ({ caller }) func getRewardChangerList(search : Text, startIndex : Nat, length : Nat) : async {
    entries : RewardValuesChangeRecordReturnList;
    amount : Nat;
  } {

    var sortedEntries = Map.HashMap<Text, RewardValuesChangeRecordReturn>(0, Text.equal, Text.hash);

    for ((key, item) in rewardValueChangedStorage.entries()) {

      let tempSenderName = get_user_name_only_privateFn(item.changer);
      var tempEnum = "";
      let getEnum = rewardValueChangeEnumsStore.get(item.rewardType);
      switch (getEnum) {
        case (null) { tempEnum := "other" };
        case (?isEnum) { tempEnum := isEnum };
      };
      var tempReward : RewardValuesChangeRecordReturn = {
        rewardType = tempEnum;
        creation_time = item.creation_time;
        newValue = item.newValue;
        oldValue = item.oldValue;
        changer = item.changer;
        changerName = tempSenderName;
      };
      let tempRewar = sortedEntries.put(key, tempReward);

    };
    return EntryStoreHelper.searchRewardChangerList(sortedEntries, search, startIndex, length);
  };
  /*
  getListOfMinters use to get list of minter who mint tokens

  @parms (userId : ?Principal, page : Nat, limit : Nat,tokenCanisterId:Text)
  @return     {minters : Minters; total : Nat;}
  */
  public shared ({ caller }) func getListOfMinters(userId : ?Principal, page : Nat, limit : Nat, tokenCanisterId : Text) : async {
    minters : Minters;
    total : Nat;
  } {
    let tokenCanister = actor (tokenCanisterId) : actor {
      getAllMinters : (
        props : {
          userId : ?Principal;
          page : Nat;
          limit : Nat;

        }
      ) -> async { total : Nat; minters : Minters };

    };

    assert await entry_require_permission(caller, #assign_role);

    var tempTokenMinterStorage = Map.HashMap<Text, TokenMinter>(0, Text.equal, Text.hash);

    let tempTokenMinter = await tokenCanister.getAllMinters({
      userId = userId;
      page = page;
      limit = limit;
    });
    // let tempMinterList=Array.toIter(tempTokenMinter.minters);
    for ((key, minter) in tempTokenMinter.minters.vals()) {
      let tempuserName = get_user_name_only_privateFn(minter.user);

      let tempMinter : TokenMinter = { minter with name = tempuserName };
      tempTokenMinterStorage.put(key, tempMinter);

    };
    let mintersWithName = Iter.toArray(tempTokenMinterStorage.entries());
    return { minters = mintersWithName; total = tempTokenMinter.total }

  };
  /*
  getListOfMinters use to get list of minter who mint tokens

  @parms (userId : ?Principal, page : Nat, limit : Nat,tokenCanisterId:Text)
  @return     {minters : Minters; total : Nat;}
  */
  public shared ({ caller }) func getListOfBurner(userId : ?Principal, page : Nat, limit : Nat, tokenCanisterId : Text) : async {
    total : Nat;
    burners : Burners;
  } {
    let tokenCanister = actor (tokenCanisterId) : actor {
      getAllBurners : (
        props : {
          userId : ?Principal;
          page : Nat;
          limit : Nat;

        }
      ) -> async { total : Nat; burners : Burners };

    };

    assert await entry_require_permission(caller, #assign_role);

    var tempTokenBurnerStorage = Map.HashMap<Text, TokenBurn>(0, Text.equal, Text.hash);

    let tempTokenBurner = await tokenCanister.getAllBurners({
      userId = userId;
      page = page;
      limit = limit;
    });
    // let tempMinterList=Array.toIter(tempTokenMinter.minters);
    for ((key, burner) in tempTokenBurner.burners.vals()) {
      let tempuserName = get_user_name_only_privateFn(burner.user);

      let tempBurner : TokenBurn = { burner with name = tempuserName };
      tempTokenBurnerStorage.put(key, tempBurner);

    };
    let userWithName = Iter.toArray(tempTokenBurnerStorage.entries());
    return { burners = userWithName; total = tempTokenBurner.total }

  };
  public shared ({ caller }) func getBalanceOfMyWallets(tokenCanisterId : Text) : async {
    master : Nat;
    plateform : Nat;
    admin : Nat;
  } {
    let master = Principal.fromText(MASTER_WALLET);
    let plateform = Principal.fromText(PLATFORM_WALLET);
    let admin = Principal.fromText(ADMIN_WALLET);

    let tokenCanister = actor (tokenCanisterId) : actor {
      icrc1_balance_of : (account : Account) -> async Nat;

    };

    assert await entry_require_permission(caller, #assign_role);

    let masterBalance = await tokenCanister.icrc1_balance_of({
      owner = master;
      subaccount = null;
    });

    let plateformBalance = await tokenCanister.icrc1_balance_of({
      owner = plateform;
      subaccount = null;
    });

    let adminBalance = await tokenCanister.icrc1_balance_of({
      owner = admin;
      subaccount = null;
    });

    return {
      master = masterBalance;
      plateform = plateformBalance;
      admin = adminBalance;
    }

  };
  public shared ({ caller }) func token_request_approve(requestId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {

    let oldUser = is_user(caller);
    assert oldUser != null;
    assert not Principal.isAnonymous(caller);
    assert require_permission(caller, #assign_role);

    let TOKEN = actor (TOKEN_CANISTER_ID) : actor {
      icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
    };
    let rich = Principal.fromText(MASTER_Token_WALLET);

    let userRewards = tokensClaimRequest.get(requestId);

    switch (userRewards) {
      case (?isRequest) {
        if(isRequest.status == #pending){

      
   

        let trans = await TOKEN.icrc2_transfer_from({
          amount = isRequest.tokens;
          created_at_time = null;
          fee = ?0;
          from = { owner = rich; subaccount = null };
          memo = null;
          spender_subaccount = null;
          to = { owner = isRequest.user; subaccount = null };
        });
        switch (trans) {
          case (#Ok(_)) {
            let tempRequest = { isRequest with status = #approved };
            let userRewards = tokensClaimRequest.put(requestId, tempRequest);

            return #ok("Approve sussessfully", true);
          };
          case (#Err(error)) {
            return #err("something went wrong", false);
          };

        };
          
          }else{
                        return #err("only pending request can be send", false);

        };


      };
      case (null) {
        return #err("Did't find request", false);
      };
    };
  };
    public shared ({ caller }) func token_request_reject(requestId : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {

    let oldUser = is_user(caller);
    assert oldUser != null;
    assert not Principal.isAnonymous(caller);
    assert require_permission(caller, #assign_role);

    let TOKEN = actor (TOKEN_CANISTER_ID) : actor {
      icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
    };
    let rich = Principal.fromText(MASTER_Token_WALLET);

    let userRewards = tokensClaimRequest.get(requestId);

    switch (userRewards) {
      case (?isRequest) {
        if(isRequest.status == #pending){
        let tempRequest = { isRequest with status = #rejected };
            let userRewards = tokensClaimRequest.put(requestId, tempRequest);
              return #ok("Rejected  sussessfully", true);

        }else{
       return #err("only pending request can be send", false);

        };


      };
      case (null) {
        return #err("Did't find request", false);
      };
    };
  };
  func isStatusMatched(status : TokensClaimStatus,itemStatus:TokensClaimStatus) : Bool {
 
      
              switch (status) {
                case (#pending) {
                  if(itemStatus==status){
                      return true;

                  }else{
                    return false;

                  };
               

                };
                case (#approved) {
                if(itemStatus==status){
                      return true;

                  }else{
                    return false;

                  };

                };
                case (#rejected) {
                if(itemStatus==status){
                      return true;

                  }else{
                    return false;

                  };

                };

              };

          
    
  };
  public query ({ caller }) func getTokensClaimedRequests(search : Text, startIndex : Nat, length : Nat, status : TokensClaimStatus, userId : ?Principal) : async {
    entries : TokenClaimRequests;
    amount : Nat;
    } {

    var sortedRequests = Map.HashMap<Text, TokenClaimRequest>(0, Text.equal, Text.hash);

    for ((key, item) in tokensClaimRequest.entries()) {
      switch (userId) {
        case (null) {
          let isMatche = isStatusMatched(status, item.status);
          if (isMatche) {
            sortedRequests.put(key, item);

          };
        };
        case (?isId) {
          if (isId == item.user) {
            let isMatche = isStatusMatched(status, item.status);
            if (isMatche) {
              sortedRequests.put(key, item);

            };

          };
        };
      };

     };
      let tempsortedRequests = Iter.toArray(sortedRequests.entries());

      return EntryStoreHelper.paginatedTokensClaimRequest(tempsortedRequests, startIndex, length);
    };
public query ({ caller }) func getTokensClaimedRequestsForUser(search : Text, startIndex : Nat, length : Nat) : async {
    entries : TokenClaimRequests;
    amount : Nat;
    totallAproved:Nat;
    } {

    var sortedRequests = Map.HashMap<Text, TokenClaimRequest>(0, Text.equal, Text.hash);
    var totallAproved:Nat=0;
    for ((key, item) in tokensClaimRequest.entries()) {
        if (caller == item.user) {
         if(item.status== #approved){
    totallAproved+=item.tokens;

         };
              sortedRequests.put(key, item);

          

          };
     };
      let tempsortedRequests = Iter.toArray(sortedRequests.entries());
        let res=EntryStoreHelper.paginatedTokensClaimRequest(tempsortedRequests, startIndex, length) ;

      return {
        res with totallAproved=totallAproved;
      }
    };

  system func preupgrade() {
    stable_users := Iter.toArray(userStorage.entries());
    stable_Article_reader := Iter.toArray(articleReadersStorage.entries());
    stable_users_rewards := Iter.toArray(usersRewardsStorage.entries());
    stable_daily_login_rewards := Iter.toArray(dailyUserLoginStorage.entries());
    stable_profile_complete_rewards := Iter.toArray(compProfileRewardedStorage.entries());
    stable_email_verified_rewards := Iter.toArray(emailVerifiedRewardedStorage.entries());
    stable_menual_and_artificial_reward := Iter.toArray(menualAndArtificialRewardStorage.entries());
    stable_rewards_values_changed := Iter.toArray(rewardValueChangedStorage.entries());
    stable_token_claimRequest := Iter.toArray(tokensClaimRequest.entries());

  };
  system func postupgrade() {
    userStorage := Map.fromIter<Id, User>(stable_users.vals(), stable_users.size(), Principal.equal, Principal.hash);
    articleReadersStorage := Map.fromIter<Id, EntryIds>(stable_Article_reader.vals(), stable_Article_reader.size(), Principal.equal, Principal.hash);
    usersRewardsStorage := Map.fromIter<Id, UsersRewards>(stable_users_rewards.vals(), stable_users_rewards.size(), Principal.equal, Principal.hash);
    dailyUserLoginStorage := Map.fromIter<Id, LoginRewardRecord>(stable_daily_login_rewards.vals(), stable_daily_login_rewards.size(), Principal.equal, Principal.hash);
    compProfileRewardedStorage := Map.fromIter<Id, ProfileCompleteReward>(stable_profile_complete_rewards.vals(), stable_profile_complete_rewards.size(), Principal.equal, Principal.hash);

    emailVerifiedRewardedStorage := Map.fromIter<Id, EmailVerification>(stable_email_verified_rewards.vals(), stable_email_verified_rewards.size(), Principal.equal, Principal.hash);
    menualAndArtificialRewardStorage := Map.fromIter<Text, MenualAndArtificialRewardType>(stable_menual_and_artificial_reward.vals(), stable_menual_and_artificial_reward.size(), Text.equal, Text.hash);
    rewardValueChangedStorage := Map.fromIter<Text, RewardValuesChangeRecord>(stable_rewards_values_changed.vals(), stable_rewards_values_changed.size(), Text.equal, Text.hash);
    tokensClaimRequest := Map.fromIter<Text, TokenClaimRequest>(stable_token_claimRequest.vals(), stable_token_claimRequest.size(), Text.equal, Text.hash);

    stable_users := [];
    stable_Article_reader := [];
    stable_users_rewards := [];
    stable_daily_login_rewards := [];
    stable_profile_complete_rewards := [];
    stable_email_verified_rewards := [];
    stable_menual_and_artificial_reward := [];
    stable_rewards_values_changed := [];
    stable_token_claimRequest := [];

  };
};
