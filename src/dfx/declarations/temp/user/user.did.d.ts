import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Burners = Array<[string, TokenBurn]>;
export type EntryId = string;
export type Id = Principal;
export type Id__1 = Principal;
export interface InputUser {
  'dob' : string,
  'authorDescription' : string,
  'linkedin' : string,
  'twitter' : string,
  'instagram' : string,
  'name' : string,
  'designation' : string,
  'authorInfo' : string,
  'email' : string,
  'website' : string,
  'facebook' : string,
  'gender' : string,
  'bannerImg' : [] | [NewImageObject],
  'authorTitle' : string,
  'profileImg' : [] | [NewImageObject],
}
export interface ListAdminUser {
  'isAdminBlocked' : boolean,
  'isBlocked' : boolean,
  'name' : [] | [string],
  'role' : Role,
  'email' : [] | [string],
  'joinedFrom' : bigint,
}
export interface ListUser {
  'isVerificationRequested' : boolean,
  'isAdminBlocked' : boolean,
  'isBlocked' : boolean,
  'name' : [] | [string],
  'email' : [] | [string],
  'isVerified' : boolean,
  'joinedFrom' : bigint,
  'identificationImage' : [] | [NewImageObject],
}
export interface ListUserDashboard {
  'unclaimedReward' : bigint,
  'isVerificationRequested' : boolean,
  'isAdminBlocked' : boolean,
  'claimedReward' : bigint,
  'isBlocked' : boolean,
  'name' : [] | [string],
  'email' : [] | [string],
  'isVerified' : boolean,
  'joinedFrom' : bigint,
  'identificationImage' : [] | [NewImageObject],
}
export type Minters = Array<[string, TokenMinter]>;
export type NewImageObject = string;
export type NewImageObject__1 = string;
export type Permission = { 'assign_role' : null } |
  { 'manage_user' : null } |
  { 'manage_article' : null } |
  { 'write' : null };
export type Result = { 'ok' : [string, User, [] | [User]] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [string, User] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [string, boolean] } |
  { 'err' : [string, boolean] };
export type Result_3 = { 'ok' : [string, User, boolean] } |
  { 'err' : string };
export interface ReturnMenualAndArtificialReward {
  'to' : Id__1,
  'creation_time' : bigint,
  'from' : Id__1,
  'isMenual' : boolean,
  'receiverName' : string,
  'senderName' : string,
  'amount' : bigint,
}
export type ReturnMenualAndArtificialRewardList = Array<
  [string, ReturnMenualAndArtificialReward]
>;
export interface Reward {
  'creation_time' : bigint,
  'claimed_at' : [] | [bigint],
  'isClaimed' : boolean,
  'amount' : bigint,
}
export interface RewardConfig {
  'admin' : bigint,
  'platform' : bigint,
  'master' : bigint,
}
export interface RewardValuesChangeRecordReturn {
  'creation_time' : bigint,
  'oldValue' : bigint,
  'newValue' : bigint,
  'changerName' : string,
  'rewardType' : string,
  'changer' : Id__1,
}
export type RewardValuesChangeRecordReturnList = Array<
  [string, RewardValuesChangeRecordReturn]
>;
export type Rewards = Array<Reward>;
export type Role = { 'admin' : null } |
  { 'article_admin' : null } |
  { 'authorized' : null } |
  { 'user_admin' : null } |
  { 'sub_admin' : null };
export type Role__1 = { 'admin' : null } |
  { 'article_admin' : null } |
  { 'authorized' : null } |
  { 'user_admin' : null } |
  { 'sub_admin' : null };
export interface TokenBurn {
  'creation_time' : bigint,
  'name' : string,
  'user' : Principal,
  'tokens' : bigint,
}
export interface TokenClaimRequest {
  'creation_time' : bigint,
  'status' : TokensClaimStatus,
  'user' : Principal,
  'transectionFee' : bigint,
  'tokens' : bigint,
}
export type TokenClaimRequests = Array<[string, TokenClaimRequest]>;
export interface TokenMinter {
  'creation_time' : bigint,
  'name' : string,
  'user' : Principal,
  'tokens' : bigint,
  'wallet' : Principal,
}
export type TokensClaimStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export type TokensClaimStatus__1 = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export interface TopWinnerUserList {
  'dob' : [] | [string],
  'name' : string,
  'joinedFrom' : bigint,
  'gender' : [] | [string],
  'rewards' : UsersRewards,
  'totalReward' : bigint,
  'profileImg' : [] | [NewImageObject],
}
export interface User {
  'dob' : [] | [string],
  'authorDescription' : [] | [string],
  'linkedin' : [] | [string],
  'twitter' : [] | [string],
  'isVerificationRequested' : boolean,
  'isAdminBlocked' : boolean,
  'instagram' : [] | [string],
  'isBlocked' : boolean,
  'name' : [] | [string],
  'designation' : [] | [string],
  'authorInfo' : [] | [string],
  'role' : Role,
  'email' : [] | [string],
  'website' : [] | [string],
  'facebook' : [] | [string],
  'isVerified' : boolean,
  'joinedFrom' : bigint,
  'gender' : [] | [string],
  'rewards' : Rewards,
  'identificationImage' : [] | [NewImageObject],
  'bannerImg' : [] | [NewImageObject],
  'authorTitle' : [] | [string],
  'profileImg' : [] | [NewImageObject],
}
export interface UserCount {
  'verified' : bigint,
  'Users' : bigint,
  'blocked' : bigint,
  'unverified' : bigint,
  'Unblocked' : bigint,
}
export type UserId = [] | [string];
export interface UsersReward {
  'creation_time' : bigint,
  'claimed_at' : [] | [bigint],
  'isClaimed' : boolean,
  'reward_type' : string,
  'amount' : bigint,
}
export type UsersRewards = Array<UsersReward>;
export type UsersRewards__1 = Array<UsersReward>;
export interface anon_class_25_1 {
  'addReaderOfEntry' : ActorMethod<[EntryId, string], boolean>,
  'add_reward' : ActorMethod<[Principal, bigint, string], boolean>,
  'add_user' : ActorMethod<[], Result_1>,
  'admin_update_user' : ActorMethod<[Id, InputUser, string], Result>,
  'assign_role' : ActorMethod<[Principal, string, Role__1], Result_1>,
  'block_sub_admin' : ActorMethod<[string, string], Result_1>,
  'block_user' : ActorMethod<[string, string], Result_1>,
  'check_user_exists' : ActorMethod<[Principal], boolean>,
  'claim_rewards_of_user' : ActorMethod<[], boolean>,
  'entry_require_permission' : ActorMethod<[Principal, Permission], boolean>,
  'getArticleReadReward' : ActorMethod<[], bigint>,
  'getBalanceOfMyWallets' : ActorMethod<
    [string],
    { 'admin' : bigint, 'master' : bigint, 'plateform' : bigint }
  >,
  'getDailyLoginReward' : ActorMethod<[], bigint>,
  'getEmailVerificationReward' : ActorMethod<[], bigint>,
  'getListOfArtificialAndMenualRewardList' : ActorMethod<
    [boolean, string, bigint, bigint],
    { 'reward' : ReturnMenualAndArtificialRewardList, 'amount' : bigint }
  >,
  'getListOfBurner' : ActorMethod<
    [[] | [Principal], bigint, bigint, string],
    { 'total' : bigint, 'burners' : Burners }
  >,
  'getListOfMinters' : ActorMethod<
    [[] | [Principal], bigint, bigint, string],
    { 'total' : bigint, 'minters' : Minters }
  >,
  'getMinimumClaimReward' : ActorMethod<[], bigint>,
  'getProfileCompReward' : ActorMethod<[], bigint>,
  'getRewardChangerList' : ActorMethod<
    [string, bigint, bigint],
    { 'entries' : RewardValuesChangeRecordReturnList, 'amount' : bigint }
  >,
  'getTokensClaimedRequests' : ActorMethod<
    [string, bigint, bigint, TokensClaimStatus__1, [] | [Principal]],
    { 'entries' : TokenClaimRequests, 'amount' : bigint }
  >,
  'getTokensClaimedRequestsForUser' : ActorMethod<
    [string, bigint, bigint],
    {
      'entries' : TokenClaimRequests,
      'totallAproved' : bigint,
      'amount' : bigint,
    }
  >,
  'get_NFT24Coin' : ActorMethod<[], bigint>,
  'get_authorized_users' : ActorMethod<
    [string, bigint, bigint],
    { 'users' : Array<[Id, ListUserDashboard]>, 'amount' : bigint }
  >,
  'get_newUserReward' : ActorMethod<[], bigint>,
  'get_reward_of_user' : ActorMethod<
    [bigint, bigint],
    { 'reward' : UsersRewards__1, 'amount' : bigint }
  >,
  'get_reward_of_user_count' : ActorMethod<
    [],
    { 'all' : bigint, 'unclaimed' : bigint, 'claimed' : bigint }
  >,
  'get_subAdmin_users' : ActorMethod<
    [string, bigint, bigint],
    { 'users' : Array<[Id, ListAdminUser]>, 'amount' : bigint }
  >,
  'get_user_details' : ActorMethod<[UserId], Result_3>,
  'get_user_email' : ActorMethod<
    [Principal],
    [] | [{ 'email' : [] | [string] }]
  >,
  'get_user_name' : ActorMethod<
    [Principal],
    [] | [
      {
        'name' : [] | [string],
        'designation' : [] | [string],
        'image' : [] | [NewImageObject__1],
      }
    ]
  >,
  'get_user_name_only' : ActorMethod<[Principal], [] | [string]>,
  'get_users' : ActorMethod<
    [string, boolean, bigint, bigint],
    { 'users' : Array<[Id, ListUser]>, 'amount' : bigint }
  >,
  'get_winner_users' : ActorMethod<
    [string, bigint, bigint],
    { 'users' : Array<[Id, TopWinnerUserList]>, 'amount' : bigint }
  >,
  'give_reward' : ActorMethod<[Id, bigint, boolean], boolean>,
  'isAlreadyReadTheEntry' : ActorMethod<[EntryId], boolean>,
  'isAlreadyVerifiedEmail' : ActorMethod<[Id], boolean>,
  'make_admin' : ActorMethod<[Principal, Role__1], boolean>,
  'request_verification' : ActorMethod<[NewImageObject__1], Result>,
  'saveRewardValuesChangerInterCanister' : ActorMethod<
    [Id, RewardConfig, RewardConfig],
    undefined
  >,
  'saveRewardValuesChangers' : ActorMethod<
    [Id, bigint, bigint, string],
    undefined
  >,
  'token_request_approve' : ActorMethod<[string], Result_2>,
  'token_request_reject' : ActorMethod<[string], Result_2>,
  'unBlock_sub_admin' : ActorMethod<[string, string], Result_1>,
  'unBlock_user' : ActorMethod<[string, string], Result_1>,
  'un_verify_user' : ActorMethod<[string, string], Result>,
  'updateArticleReadReward' : ActorMethod<[bigint], boolean>,
  'updateDailyLoginReward' : ActorMethod<[bigint], boolean>,
  'updateEmailVerificationReward' : ActorMethod<[bigint], boolean>,
  'updateMinimumClaimReward' : ActorMethod<[bigint], boolean>,
  'updateNewUserReward' : ActorMethod<[bigint], boolean>,
  'updateProfileCompReward' : ActorMethod<[bigint], boolean>,
  'update_NFT24Coin' : ActorMethod<[bigint], boolean>,
  'update_user' : ActorMethod<[InputUser, string], Result>,
  'user_count' : ActorMethod<[], bigint>,
  'verified_user_count' : ActorMethod<[], UserCount>,
  'verify_user' : ActorMethod<[string, string], Result>,
}
export interface _SERVICE extends anon_class_25_1 {}
