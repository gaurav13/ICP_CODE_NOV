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

module UserType {
  type ImageObject = ImageType.ImageObject;
  type NewImageObject = ImageType.NewImageObject;
  public type UserId = ?Text;
  public type Id = Principal;
  public type Reward = {
    isClaimed : Bool;
    creation_time : Int;
    claimed_at : ?Int;
    amount : Nat;
  };
  public type UsersReward = {
    isClaimed : Bool;
    creation_time : Int;
    claimed_at : ?Int;
    amount : Nat;
    reward_type : Text;
  };
  public type MenualAndArtificialRewardType = {
    isMenual : Bool;
    creation_time : Int;
    amount : Nat;
    from : Id;
    to : Id;

  };
  public type ReturnMenualAndArtificialReward = {
    isMenual : Bool;
    creation_time : Int;
    amount : Nat;
    from : Id;
    to : Id;
    senderName : Text;
    receiverName : Text;

  };
  public type RewardValuesChangeRecord = {
    rewardType : Text;
    creation_time : Int;
    newValue : Nat;
    oldValue : Nat;
    changer : Id;

  };
  public type RewardValuesChangeRecordReturn = {
    rewardType : Text;
    creation_time : Int;
    newValue : Nat;
    oldValue : Nat;
    changer : Id;
    changerName : Text;

  };
  public type Rewards = [Reward];
  public type UsersRewards = [UsersReward];
  public type MenualAndArtificialRewardsType = [MenualAndArtificialRewardType];
  public type RewardValuesChangeRecordReturnList = [(Text, RewardValuesChangeRecordReturn)];

  public type EntryId = Text;
  public type Role = {
    #admin;
    #sub_admin;
    #user_admin;
    #article_admin;
    #authorized;
  };
  public type Permission = {
    #assign_role;
    #manage_user;
    #manage_article;
    #write;
  };
  public type User = {
    profileImg : ?NewImageObject;
    bannerImg : ?NewImageObject;
    name : ?Text;
    designation : ?Text;
    email : ?Text;
    website : ?Text;
    dob : ?Text;
    gender : ?Text;
    facebook : ?Text;
    twitter : ?Text;
    instagram : ?Text;
    linkedin : ?Text;
    authorInfo : ?Text;
    authorTitle : ?Text;
    authorDescription : ?Text;
    joinedFrom : Int;
    rewards : Rewards;
    role : Role;
    isVerified : Bool;
    isVerificationRequested : Bool;
    identificationImage : ?NewImageObject;
    isBlocked : Bool;
    isAdminBlocked : Bool;
  };
  public type ListUser = {
    name : ?Text;
    email : ?Text;
    joinedFrom : Int;
    isBlocked : Bool;
    isAdminBlocked : Bool;
    isVerified : Bool;
    isVerificationRequested : Bool;
    identificationImage : ?NewImageObject;

  };
  public type ListUserDashboard = {
    name : ?Text;
    email : ?Text;
    joinedFrom : Int;
    isBlocked : Bool;
    isAdminBlocked : Bool;
    isVerified : Bool;
    isVerificationRequested : Bool;
    identificationImage : ?NewImageObject;
    claimedReward : Nat;
    unclaimedReward : Nat;
  };
  public type TopWinnerUserList = {
    profileImg : ?NewImageObject;
    name : Text;
    dob : ?Text;
    gender : ?Text;
    joinedFrom : Int;
    rewards : UsersRewards;
    totalReward : Int;
  };
  public type ListAdminUser = {
    name : ?Text;
    email : ?Text;
    joinedFrom : Int;
    role : Role;
    isBlocked : Bool;
    isAdminBlocked : Bool;

  };
  public type LoginReward = {
    date : Int;
    reward : Nat;

  };
  public type ProfileCompleteReward = {
    creation_time : Int;
    reward : Nat;

  };
  public type LoginRewardRecord = [LoginReward];
  public type EmailVerifiedReward = Principal;
  public type EmailVerifiedRewardRecord = [EmailVerifiedReward];
  public type InputUser = {
    profileImg : ?NewImageObject;
    bannerImg : ?NewImageObject;
    name : Text;
    designation : Text;
    email : Text;
    website : Text;
    dob : Text;
    gender : Text;
    facebook : Text;
    twitter : Text;
    instagram : Text;
    linkedin : Text;
    authorInfo : Text;
    authorTitle : Text;
    authorDescription : Text;
  };
  public type EntryIds = [EntryId];

  //   public type ProfileComplete = {
  //   bannerImg : Nat;
  //   profileImg : Nat;
  //   name : Nat;
  //   designation : Nat;
  //   email : Nat;
  //   website : Nat;
  //   dob : Nat;
  //   facebook : Nat;
  //   twitter : Nat;
  //   instagram : Nat;
  //   linkedin : Nat;
  //   authorInfo : Nat;
  //   authorTitle : Nat;
  //   authorDescription : Nat;
  // };
  public type Users = [(Id, User)];
  public type ArticleReaders = [(Id, EntryIds)];
  public type ListUsers = [(Id, ListUser)];
  public type ListAdminUsers = [(Id, ListAdminUser)];
  public type ActivityType = {
    #like;
    #comment;
    #subscribe;
    #create;
    #create_web3;
    #create_podcats;
    #like_web3;
    #promote;
    #delete_article;
    #delete_web3;
    #delete_podcats;
    #delete_pressRelease;
    #comment_podcats;
    #comment_pressRelease;
    #create_pressRelease;
  };
  public type AdminActivityType = {
    #block;
    #unBlock;
    #verify_user;
    #un_verify_user;
    #approve;
    #reject;
    #editViews;
    #delete_web3;
    #delete_category;
    #delete_article;
    #delete_podcats;
    #delete_pressRelease;
    #add_event;
    #delete_event;
    #edit_event;
    #add_category;
    #edit_category;
    #editWeb3Views;
    #edit_web3;
    #verify_web3;
  };
  public type SubAccount = Blob;
  public type Icrc1Timestamp = Nat64;
  public type Icrc1Tokens = Nat;
  public type Icrc1BlockIndex = Nat;

  public type Account = {
    owner : Principal;
    subaccount : ?SubAccount;
  };
  public type UserCount = {
    Users : Int;
    verified : Int;
    unverified : Int;
    blocked : Int;
    Unblocked : Int;
  };

  public type TransferFromArgs = {
    spender_subaccount : ?SubAccount;
    from : Account;
    to : Account;
    amount : Icrc1Tokens;
    fee : ?Icrc1Tokens;
    memo : ?Blob;
    created_at_time : ?Icrc1Timestamp;
  };
  public type TransferFromResult = {
    #Ok : Icrc1BlockIndex;
    #Err : TransferFromError;
  };
  public type Comment = {
    user : Principal;
    content : Text;
    creation_time : Int;
  };
  public type CommentItem = {
    user : Principal;
    content : Text;
    creation_time : Int;
    entryId : Text;
  };
  public type TransferFromError = {
    #BadFee : { expected_fee : Icrc1Tokens };
    #BadBurn : { min_burn_amount : Icrc1Tokens };
    #InsufficientFunds : { balance : Icrc1Tokens };
    #InsufficientAllowance : { allowance : Icrc1Tokens };
    #TooOld;
    #CreatedInFuture : { ledger_time : Icrc1Timestamp };
    #Duplicate : { duplicate_of : Icrc1BlockIndex };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };
  public type TokenMinter = {
    tokens : Nat;
    creation_time : Int;
    user : Principal;
    name : Text;
    wallet : Principal;

  };
  public type TokenBurn = {
    tokens : Nat;
    creation_time : Int;
    user : Principal;
    name : Text;

  };
  public type Minters = [(Text, TokenMinter)];
  public type Burners = [(Text, TokenBurn)];
  public type TokensClaimStatus = {
    #pending;
    #approved;
    #rejected

  };
  public type TokenClaimRequest = {
    tokens : Nat;
    creation_time : Int;
    user : Principal;
    transectionFee:Nat;
    status : TokensClaimStatus

  };
  public type TokenClaimRequests = [(Text, TokenClaimRequest)];

  // this is locally
  // public let MASTER_WALLET = "ovwuo-27fz4-mzoqt-civgm-otc2n-k37td-m4d2e-n35pq-6an4y-j7q7i-5qe";

  // this is for mainnet
  public let MASTER_WALLET = "ovwuo-27fz4-mzoqt-civgm-otc2n-k37td-m4d2e-n35pq-6an4y-j7q7i-5qe";
  public let PLATFORM_WALLET = "s6ncu-m4pe4-x7ioz-pwupz-s3lcj-643je-76psx-k3kyb-yeh2n-64bhy-fqe";
  public let ADMIN_WALLET = "ah5hb-5wife-gghvi-mjmyg-hxha6-nani5-725xi-t2u2u-bep6q-t7qnm-oae";
  // public let MASTER_Token_WALLET = "flcnw-pwkoi-vvs6d-pbffq-jioth-56zqj-z3egd-w2oxu-f5sbj-xytsm-6ae";
  // local TOKEN_CANISTER_ID
  // public let TOKEN_CANISTER_ID = "dxfxs-weaaa-aaaaa-qaapa-cai";
  // mainnet TOKEN_CANISTER_ID
  public let TOKEN_CANISTER_ID = "fdk2c-7qaaa-aaaal-ajiba-cai";

};
